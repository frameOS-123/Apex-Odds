import React, { useState, useEffect } from "react";
import { 
  Users, UserPlus, Send, Zap, Crown, UserMinus, Sparkles, Check, 
  HelpCircle, ShieldAlert, MessageSquare, AlertCircle, RefreshCw, Trophy, XSquare
} from "lucide-react";
import { UserProfile, Friend } from "../types";
import { db } from "../firebase";
import { doc, getDoc, updateDoc, collection, query, where, getDocs, limit } from "firebase/firestore";

interface FriendsNetworkProps {
  userProfile: UserProfile;
  onChangeProfile: (profile: UserProfile) => void;
  userTier: "free" | "plus" | "pro" | "syndicate";
  onUpgrade: () => void;
}

export default function FriendsNetwork({ userProfile, onChangeProfile, userTier, onUpgrade }: FriendsNetworkProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [syndicateLobbyCode, setSyndicateLobbyCode] = useState("");
  const [activeSyndicateRoom, setActiveSyndicateRoom] = useState<string | null>(null);
  const [groupAnalysts, setGroupAnalysts] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"friends" | "syndicate">("friends");

  // Notifications or instant feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Chat system state declarations
  const [activeChatFriend, setActiveChatFriend] = useState<Friend | null>(null);
  const [chatMessages, setChatMessages] = useState<Record<string, Array<{ sender: "me" | "friend" | "system", text: string, time: string }>>>({});
  const [chatInput, setChatInput] = useState("");

  const handleOpenChat = (friend: Friend) => {
    setActiveChatFriend(friend);
    // Initialize with a friendly welcome message if there are no messages yet
    if (!chatMessages[friend.username]) {
      const initialMsgs = [
        {
          sender: "friend" as const,
          text: friend.username === "SharpSlayer_88" 
            ? "Yo! Just checked the AI parameters for the spread... what's your model projecting?"
            : friend.username === "Quantum_Pro"
            ? "Analytical accuracy hit rate is sitting comfortable at 84% today. Ready to build a joint Syndicate consensus?"
            : `Hey! Good to connect with you. Let's make some accurate forecasts today.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ];
      setChatMessages(prev => ({
        ...prev,
        [friend.username]: initialMsgs
      }));
    }
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeChatFriend) return;

    const userMsg = {
      sender: "me" as const,
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const buddy = activeChatFriend.username;
    const currentMsgs = chatMessages[buddy] || [];
    const updatedMsgs = [...currentMsgs, userMsg];

    setChatMessages(prev => ({
      ...prev,
      [buddy]: updatedMsgs
    }));

    const textToMatch = chatInput.toLowerCase();
    setChatInput("");

    // Simulate real friend response after 1 second!
    setTimeout(() => {
      let replyText = "Interesting perspective. Let's verify standard deviations vs our seasonal hit rate before submitting!";
      if (textToMatch.includes("odds") || textToMatch.includes("predict") || textToMatch.includes("model") || textToMatch.includes("bet")) {
        replyText = "Yeah, I am running a multi-variance simulation now. My Rest Coefficient model is favoring Chiefs by 3.";
      } else if (textToMatch.includes("hello") || textToMatch.includes("hi") || textToMatch.includes("hey")) {
        replyText = "Hey! Good to see another pro analyst on the network directory. Let's make some high-value forecasts!";
      } else if (textToMatch.includes("nudge") || textToMatch.includes("edge") || textToMatch.includes("streak")) {
        replyText = "Received your nudge! Recalculating my team stamina impact logs. We're keeping this streak alive!";
      } else if (textToMatch.includes("how are you") || textToMatch.includes("how's it going")) {
        replyText = "Doing great! Reviewing injury reports and updating my dashboard widgets.";
      }

      setChatMessages(prev => ({
        ...prev,
        [buddy]: [
          ...(prev[buddy] || []),
          {
            sender: "friend" as const,
            text: replyText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]
      }));
    }, 1000);
  };

  // Initialize group members if Syndicate room is generated
  useEffect(() => {
    if (activeSyndicateRoom) {
      setGroupAnalysts(["You", "Alpha_Odds_Bot", ...friendsList.filter(f => f.status === "accepted").map(f => f.username).slice(0, 2)]);
    }
  }, [activeSyndicateRoom]);

  // Handle Toast timers
  useEffect(() => {
    if (toastMessage) {
      const t = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toastMessage]);

  // Load friends from local profile or Firestore if available
  const friendsList = (userProfile as any).friends || (userProfile.uid === "guest" ? [
    { username: "SharpSlayer_88", status: "accepted", level: 12, streak: 5, tier: "pro", incoming: false },
    { username: "Quantum_Pro", status: "accepted", level: 8, streak: 3, tier: "plus", incoming: false },
    { username: "Mathematician_9", status: "pending", level: 4, streak: 0, tier: "free", incoming: true }
  ] : []) as Friend[];

  // Update cloud user friends state helper
  const updateFriendsInCloud = async (newFriends: Friend[]) => {
    const updated = {
      ...userProfile,
      friends: newFriends
    };
    onChangeProfile(updated);

    if (userProfile.uid !== "guest") {
      try {
        const userRef = doc(db, "users", userProfile.uid);
        await updateDoc(userRef, { friends: newFriends });
      } catch (err) {
        console.error("Failed to sync new friends with remote Firestore database:", err);
      }
    }
  };

  // Search Usernames within remote Firestore/Local repository
  const handleSearchUsers = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    if (userProfile.uid === "guest") {
      // Guest local simulation search
      setIsSearching(true);
      setErrorMessage(null);
      setTimeout(() => {
        setIsSearching(false);
        const mocks = [
          { username: searchQuery.trim().toLowerCase(), level: 4, streak: 2, uid: "mock-user-123", tier: "plus" },
          { username: `${searchQuery.trim().toLowerCase()}_elite`, level: 14, streak: 7, uid: "mock-user-456", tier: "syndicate" }
        ];
        setSearchResults(mocks);
      }, 700);
      return;
    }

    try {
      setIsSearching(true);
      setErrorMessage(null);
      setSearchResults([]);

      // Firestore query search
      const usersRef = collection(db, "users");
      const q = query(
        usersRef, 
        where("displayName", ">=", searchQuery.trim()), 
        where("displayName", "<=", searchQuery.trim() + "\uf8ff"),
        limit(5)
      );
      
      const querySnapshot = await getDocs(q);
      const results: any[] = [];
      querySnapshot.forEach((doc) => {
        const raw = doc.data();
        // Prevent searching for self
        if (raw.uid !== userProfile.uid) {
          results.push({
            username: raw.displayName || "Unknown Analyst",
            uid: raw.uid,
            level: raw.level || 1,
            streak: raw.streak || 0,
            tier: raw.tier || "free"
          });
        }
      });

      if (results.length === 0) {
        // Fallback mockup search to assist presentation sandbox
        const defaultMocks = [
          { username: searchQuery.trim() + "_analyst", level: 3, streak: 1, uid: "mock-u1", tier: "free" },
          { username: searchQuery.trim() + "_SaaS", level: 9, streak: 4, uid: "mock-u2", tier: "pro" }
        ];
        setSearchResults(defaultMocks);
      } else {
        setSearchResults(results);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage("Query failed. Please verify Firestore blueprints indices.");
    } finally {
      setIsSearching(false);
    }
  };

  // Follow/Friend-invite a user
  const handleAddFriend = async (target: { username: string, uid?: string, level?: number, streak?: number, tier?: string }) => {
    const exists = friendsList.find(f => f.username.toLowerCase() === target.username.toLowerCase());
    if (exists) {
      setErrorMessage(`You already have a friendship state with ${target.username}.`);
      return;
    }

    const newFriend: Friend = {
      uid: target.uid || "mock-uid",
      username: target.username,
      status: "pending",
      incoming: false,
      level: target.level || 1,
      streak: target.streak || 0,
      tier: target.tier || "free"
    };

    const nextFriends = [...friendsList, newFriend];
    await updateFriendsInCloud(nextFriends);
    setSuccessMessage(`Friend request sent to ${target.username}!`);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // Accept incoming friend request
  const handleAcceptFriendGroup = async (username: string) => {
    const updated = friendsList.map(f => {
      if (f.username.toLowerCase() === username.toLowerCase()) {
        return { ...f, status: "accepted" as const };
      }
      return f;
    });
    await updateFriendsInCloud(updated);
    setToastMessage(`Friendship with ${username} accepted!`);
  };

  // Remove/Unfriend buddy
  const handleUnfriendUser = async (username: string) => {
    const filtered = friendsList.filter(f => f.username.toLowerCase() !== username.toLowerCase());
    await updateFriendsInCloud(filtered);
    setToastMessage(`Removed ${username} from your analysts list.`);
  };

  // Send fun stats nudge trigger
  const handleNudgeFriend = (username: string) => {
    setToastMessage(`⚡ Sent predictive edge nudge to ${username}!`);
  };

  // Syndicate Workspace Multi-User room simulations
  const handleGenerateRoom = () => {
    if (userTier !== "syndicate") {
      alert("Only Syndicate Plan users can create multi-friend lobbies. Upgrade your plan to unlock shared workspaces.");
      return;
    }
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "SYN-";
    for (let i = 0; i < 4; i++) {
       code += chars[Math.floor(Math.random() * chars.length)];
    }
    setActiveSyndicateRoom(code);
    setToastMessage(`Room ${code} created. Share code with friends!`);
  };

  const handleJoinRoomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!syndicateLobbyCode.trim()) return;
    setActiveSyndicateRoom(syndicateLobbyCode.trim().toUpperCase());
    setToastMessage(`Connected to Syndicate Lobby Room ${syndicateLobbyCode.trim().toUpperCase()}`);
    setSyndicateLobbyCode("");
  };

  return (
    <div className="bg-slate-900 border border-white/10 rounded-[2rem] p-6 md:p-8 space-y-6 select-none relative overflow-hidden">
      
      {/* Glow ambient background */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 z-50 bg-indigo-650 tracking-wider text-white border border-indigo-400/30 text-xs px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <Zap className="w-4 h-4 text-amber-400 animate-pulse fill-amber-400" />
          <span className="font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-extrabold text-white">Friends & Analyst Syndicate Network</h3>
          </div>
          <p className="text-xs text-slate-450 mt-1">
            Build your team, compare analytical sports projections, nudge friends with edges, and synchronize multi-user Syndicate plans.
          </p>
        </div>

        {/* Dashboard Tabs Toggle */}
        <div className="flex bg-black/40 border border-white/10 p-1 rounded-2xl text-xs font-bold w-full md:w-auto self-start">
          <button 
            onClick={() => setActiveTab("friends")} 
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition cursor-pointer w-1/2 md:w-auto justify-center ${
              activeTab === "friends" ? "bg-indigo-600 text-white font-extrabold shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Buddy List</span>
          </button>
          
          <button 
            onClick={() => setActiveTab("syndicate")} 
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition cursor-pointer w-1/2 md:w-auto justify-center ${
              activeTab === "syndicate" ? "bg-indigo-600 text-white font-extrabold shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            <Crown className="w-4 h-4" />
            <span>Syndicate Hub</span>
          </button>
        </div>
      </div>

      {/* Guest Mode Protection Banner */}
      {userProfile.uid === "guest" && (
        <div className="p-5 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <ShieldAlert className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-black uppercase text-amber-400 font-mono">Guest Session Mode Limit</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Friend search requests and cloud syndicate room sessions are simulated locally for guests. Register or Sign in to synchronize live friend streak challenges in real-time.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ACTIVE VIEW TAB 1: FRIENDS DIRECTORY */}
      {activeTab === "friends" && (
        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* SEARCH FOR NEW FRIENDS */}
          <div className="lg:col-span-1 bg-black/30 p-6 rounded-3xl border border-white/5 space-y-4 h-fit">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider font-mono">Discover Buddy Analysts</h4>
            <p className="text-[11px] text-slate-400">Search handle to follow their live high-fidelity prediction accuracy charts.</p>
            
            <form onSubmit={handleSearchUsers} className="space-y-2">
              <div className="relative">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="analyst_username..." 
                  className="w-full text-xs bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 pl-10 text-white outline-none focus:border-indigo-550"
                />
                <Users className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              </div>
              <button 
                type="submit" 
                disabled={isSearching}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl cursor-pointer transition flex items-center justify-center gap-1"
              >
                {isSearching ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <UserPlus className="w-3.5 h-3.5" />}
                <span>Search Handles</span>
              </button>
            </form>

            {successMessage && (
              <p className="text-xs text-emerald-400 bg-emerald-500/10 py-2.5 px-3 rounded-xl border border-emerald-500/20 font-semibold text-center">
                {successMessage}
              </p>
            )}

            {errorMessage && (
              <p className="text-xs text-rose-400 bg-rose-500/10 py-2.5 px-3 rounded-xl border border-rose-500/20 font-mono text-center">
                {errorMessage}
              </p>
            )}

            {/* Results */}
            {searchResults.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-white/5">
                <p className="text-[9px] uppercase tracking-wider font-bold text-slate-450 font-mono">Found Matches:</p>
                {searchResults.map((user, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-white/5 text-xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-extrabold text-white text-xs">@{user.username}</span>
                        <span className="text-[8px] uppercase px-1.5 py-0.5 rounded font-black font-mono bg-slate-800 text-indigo-400">
                          {user.tier}
                        </span>
                      </div>
                      <span className="text-[9px] text-slate-400 block font-mono">
                        Level {user.level} • Streak: {user.streak}🔥
                      </span>
                    </div>

                    <button 
                      onClick={() => handleAddFriend(user)}
                      className="p-2 bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 rounded-xl hover:bg-indigo-600 hover:text-white transition cursor-pointer"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* REAL BUDDY LIST */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold text-white uppercase tracking-wider font-mono">Active Connected Buddies ({friendsList.length})</h4>
              <span className="text-[9px] font-mono text-indigo-400 font-bold bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full uppercase">
                Challenge Streak active
              </span>
            </div>

            {friendsList.length === 0 ? (
              <div className="p-12 text-center border border-white/5 rounded-3xl bg-black/20 text-slate-500 space-y-2">
                <Users className="w-8 h-8 mx-auto text-slate-600" />
                <p className="text-xs">Your buddies list is empty. Add handles in the left pane to connect!</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {friendsList.map((friend, idx) => {
                  const isPending = friend.status === "pending";
                  const isIncoming = friend.incoming;

                  return (
                    <div 
                      key={idx}
                      className="p-5 rounded-3xl bg-black/40 border border-white/5 flex flex-col justify-between space-y-4 hover:border-indigo-500/20 transition relative group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-black text-xs text-white">@{friend.username}</span>
                            <span className={`text-[8px] uppercase font-black px-1.5 py-0.5 rounded font-mono ${
                              friend.tier === "syndicate" ? "bg-amber-500/20 text-amber-400 border border-amber-500/20" : "bg-indigo-500/20 text-indigo-400"
                            }`}>
                              {friend.tier || "FREE"}
                            </span>
                          </div>
                          
                          {!isPending ? (
                            <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400 pt-1">
                              <span className="flex items-center gap-1 text-indigo-400 font-bold">
                                <Trophy className="w-3 h-3" />
                                Lvl {friend.level || 5}
                              </span>
                              <span className="text-pink-400 font-bold">
                                🔥 {friend.streak || 2} Streak
                              </span>
                            </div>
                          ) : (
                            <span className="inline-block text-[9px] font-black uppercase text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded font-mono border border-amber-500/10">
                              {isIncoming ? "Incoming Invite" : "Awaiting response"}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => handleUnfriendUser(friend.username)}
                          className="text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition p-1 cursor-pointer"
                          title="Remove Friend"
                        >
                          <UserMinus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 pt-1 border-t border-white/5">
                        {isPending && isIncoming ? (
                          <button
                            onClick={() => handleAcceptFriendGroup(friend.username)}
                            className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[10px] uppercase rounded-lg cursor-pointer transition flex items-center justify-center gap-1"
                          >
                            <Check className="w-3 h-3" />
                            <span>Accept</span>
                          </button>
                        ) : !isPending ? (
                          <>
                            <button
                              onClick={() => handleNudgeFriend(friend.username)}
                              className="flex-1 py-1.5 bg-indigo-600/10 hover:bg-indigo-600/25 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase rounded-lg cursor-pointer transition flex items-center justify-center gap-1.5"
                            >
                              <Zap className="w-3 h-3 fill-indigo-400" />
                              <span>Nudge Edge</span>
                            </button>
                            <button
                              onClick={() => handleOpenChat(friend)}
                              className="p-1 px-3 bg-indigo-600/10 hover:bg-indigo-650 border border-indigo-500/20 rounded-lg text-indigo-400 hover:text-white transition text-[10px] flex items-center justify-center cursor-pointer animate-pulse"
                              title="Send instant message"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : (
                          <span className="text-[9px] text-slate-500 italic block font-sans">
                            Pending confirmation from user...
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ACTIVE VIEW TAB 2: SYNDICATE HIGH-FI ROOMS */}
      {activeTab === "syndicate" && (
        <div className="space-y-6">
          
          {/* Header promo on syndicate features */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border border-indigo-500/10 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-[10px] uppercase tracking-widest font-black font-mono text-amber-400">Elite Syndicate Feature</span>
              </div>
              <h4 className="text-base font-black text-white">Invite Friends directly to your Syndicate Room</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Connect and sync active sports prediction builders together. By inviting friends, your group aggregates individual models, producing consensus indicators with highly resilient standard deviation limits!
              </p>
            </div>

            {userTier !== "syndicate" ? (
              <button 
                onClick={onUpgrade}
                className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 border border-indigo-500/20 text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 shrink-0 self-start md:self-center cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                <span>Upgrade to Syndicate Plan</span>
              </button>
            ) : (
              <span className="bg-amber-400/20 text-amber-400 border border-amber-400/20 rounded-2xl py-2 px-4 text-xs font-mono font-black shrink-0 self-start md:self-center uppercase flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Syndicate Active</span>
              </span>
            )}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            
            {/* Left: Join or Create rooms */}
            <div className="bg-black/30 p-6 rounded-3xl border border-white/5 space-y-6">
              <h5 className="text-xs font-extrabold text-white uppercase tracking-wider font-mono">Control Canvas Connection</h5>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block font-mono">Lobby Option A: Deploy unique room</span>
                  <button 
                    onClick={handleGenerateRoom}
                    className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-widest transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Crown className="w-4 h-4 text-amber-300" />
                    <span>Generate Lobby Invite Code</span>
                  </button>
                </div>

                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-white/5"></div>
                  <span className="flex-shrink mx-4 text-[9px] text-slate-500 uppercase font-bold tracking-widest">or Join existing</span>
                  <div className="flex-grow border-t border-white/5"></div>
                </div>

                <form onSubmit={handleJoinRoomSubmit} className="space-y-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block font-mono">Lobby Option B: Enter Buddy invite code</span>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={syndicateLobbyCode}
                      onChange={(e) => setSyndicateLobbyCode(e.target.value)}
                      placeholder="e.g. SYN-K3A8" 
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-indigo-550 font-mono uppercase"
                    />
                    <button 
                      type="submit"
                      className="px-5 bg-slate-800 hover:bg-slate-750 text-white font-black text-xs uppercase rounded-xl transition cursor-pointer"
                    >
                      Connect
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Right: Active Room Display */}
            <div className={`p-6 rounded-3xl border transition ${
              activeSyndicateRoom ? "bg-indigo-950/20 border-indigo-500/20" : "bg-black/20 border-white/5 opacity-60"
            }`}>
              {activeSyndicateRoom ? (
                <div className="space-y-5">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <div className="space-y-1">
                      <span className="text-[8px] bg-indigo-500/20 text-indigo-400 font-bold font-mono px-2 py-0.5 rounded uppercase">Connected</span>
                      <h5 className="text-sm font-black text-white">Syndicate Room: {activeSyndicateRoom}</h5>
                    </div>
                    <button 
                      onClick={() => {
                        setActiveSyndicateRoom(null);
                        setToastMessage("Disconnected from Syndicate lobby.");
                      }}
                      className="text-xs text-slate-400 hover:text-rose-400 font-bold cursor-pointer underline underline-offset-2"
                    >
                      Leave Lobby
                    </button>
                  </div>

                  <div className="space-y-3">
                    <span className="text-[10px] text-slate-400 uppercase font-black font-mono tracking-wider">Sync Members ({groupAnalysts.length}):</span>
                    
                    <div className="space-y-2">
                      {groupAnalysts.map((analyst, index) => (
                        <div key={index} className="flex items-center justify-between bg-slate-950/60 p-3 rounded-xl border border-white/5">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-xs font-bold text-white">@{analyst}</span>
                          </div>
                          <span className="text-[9px] font-mono text-slate-505 bg-slate-900 px-2 py-0.5 rounded border border-white/5 font-semibold">
                            {index === 0 ? "HOST" : index === 1 ? "BOT AGENT" : "ANALYST"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-950 rounded-xl border border-white/5 text-[11px] text-slate-400 leading-relaxed font-mono flex gap-2">
                    <AlertCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span>consensus system is online! Custom predictions generated will auto-adjust consensus weight indices by +12.3% variance.</span>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-500 space-y-3">
                  <Crown className="w-8 h-8 mx-auto text-slate-600 animate-bounce" />
                  <p className="text-xs">No active Connected Lobby.</p>
                  <p className="text-[10px] text-slate-450 max-w-xs mx-auto">Generate an invite code or enter a friend's connection code to establish a unified prediction team.</p>
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* Real-time Friend Chat Modal Workspace */}
      {activeChatFriend && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-indigo-500/20 rounded-[2.5rem] max-w-lg w-full overflow-hidden shadow-2xl flex flex-col h-[520px] animate-fade-in relative text-left">
            <div className="absolute top-[-30%] left-[-30%] w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />
            
            {/* Header */}
            <div className="p-5 border-b border-white/5 bg-slate-900/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center font-extrabold text-indigo-400 text-sm font-sans uppercase">
                    {activeChatFriend.username.slice(0, 2)}
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-950 rounded-full animate-pulse" />
                </div>
                <div>
                  <h4 className="font-extrabold text-white text-xs">@{activeChatFriend.username}</h4>
                  <p className="text-[10px] text-slate-400 font-mono">
                    Active • Level {activeChatFriend.level || 5} • {activeChatFriend.tier?.toUpperCase() || "FREE"}
                  </p>
                </div>
              </div>
              
              <button 
                onClick={() => setActiveChatFriend(null)}
                className="text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 text-xs rounded-xl transition cursor-pointer"
                title="Close Chat"
              >
                <XSquare className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar bg-slate-950">
              {(chatMessages[activeChatFriend.username] || []).map((msg, i) => {
                const isMe = msg.sender === "me";
                return (
                  <div 
                    key={i} 
                    className={`flex flex-col max-w-[80%] ${isMe ? "ml-auto items-end" : "mr-auto items-start"}`}
                  >
                    <div className={`p-3.5 rounded-2xl text-xs leading-relaxed font-sans ${
                      isMe 
                        ? "bg-indigo-600 text-white rounded-br-none" 
                        : "bg-slate-900 text-slate-250 border border-white/5 rounded-bl-none"
                    }`}>
                      {msg.text}
                    </div>
                    <span className="text-[8px] font-mono text-slate-500 mt-1">{msg.time}</span>
                  </div>
                );
              })}
            </div>

            {/* Input submission footer */}
            <form onSubmit={handleSendChatMessage} className="p-4 border-t border-white/5 bg-slate-900/40 flex gap-2">
              <input 
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type your strategic analysis response..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-indigo-550 font-sans font-medium"
              />
              <button 
                type="submit"
                className="px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition cursor-pointer flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
