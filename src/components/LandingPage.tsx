import React, { useState } from "react";
import { 
  ArrowRight, ShieldCheck, TrendingUp, Sparkles, Check, Zap, Cpu, Globe, Search, Database, Lock
} from "lucide-react";
import { auth, googleProvider, signInWithPopup } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

interface LandingPageProps {
  onContinueAsGuest: () => void;
  onAuthSuccess: (user: any) => void;
}

export default function LandingPage({ onContinueAsGuest, onAuthSuccess }: LandingPageProps) {
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      if (authMode === "signup") {
        if (!username.trim()) {
          throw new Error("Please enter a username for your profile.");
        }
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName: username.trim() });
        onAuthSuccess(cred.user);
      } else {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        onAuthSuccess(cred.user);
      }
      setIsAuthModalOpen(false);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An authentication error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      onAuthSuccess(result.user);
      setIsAuthModalOpen(false);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Google Workspace Sign-In failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const openAuthModal = (mode: "login" | "signup") => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  return (
    <div id="landing-container" className="min-h-screen text-slate-100 flex flex-col justify-between overflow-x-hidden relative select-none bg-slate-950 font-sans">
      
      {/* Disclaimer Warning Banner */}
      <div className="relative z-50 bg-amber-500 text-slate-950 px-4 py-2.5 text-center text-xs font-black tracking-wide flex items-center justify-center gap-1.5 shadow-[0_4px_20px_rgba(245,158,11,0.25)]">
        <ShieldCheck className="w-4 h-4 text-slate-950 shrink-0" />
        <span>⚠️ NOT FOR BETTING — APEXODDS IS AN ACADEMIC SIMULATION AND MATHEMATICAL MODELING TOOL FOR SPORTS TELEMETRY AND PORT LOGISTIC TRAFFIC EXPERIMENTS ONLY. WAGERING OR GAMBLING FUNCTIONS ARE STRICTLY FORBIDDEN.</span>
      </div>

      {/* Background Decor */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-550/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] left-[35%] w-[30%] h-[30%] bg-purple-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between border-b border-slate-900">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(79,70,229,0.3)] border border-white/10 shrink-0">
            <img 
              src="/src/assets/images/apexodds_logo_1781644611647.jpg" 
              referrerPolicy="no-referrer"
              alt="ApexOdds Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-indigo-400">ApexOdds Quantum</h2>
            <span className="text-[9px] uppercase tracking-[0.25em] text-indigo-400 font-bold font-mono">Platform v4.2</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => openAuthModal("login")} 
            className="px-5 py-2 rounded-xl text-xs font-semibold hover:bg-slate-900 border border-slate-800 transition cursor-pointer"
          >
            Log In
          </button>
          <button 
            onClick={() => openAuthModal("signup")} 
            className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)] transition cursor-pointer"
          >
            Sign Up
          </button>
        </div>
      </header>

      {/* Hero Body */}
      <main className="relative z-10 max-w-7xl w-full mx-auto px-6 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center my-auto py-12">
        <div className="space-y-6 text-left">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-550/35 px-4 py-1.5 rounded-full text-xs font-mono text-indigo-400 uppercase tracking-widest font-black">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span> Quantum Sports & Ports Predictive Simulation Rig
          </div>
          
          {/* Theme title */}
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-[1.1]">
            Dual Telemetry. <br />
            Sports Matchups & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-indigo-300 to-blue-400">
              Maritime Ports Modeling.
            </span>
          </h1>
          <p className="text-slate-350 text-xs md:text-sm max-w-2xl leading-relaxed font-sans font-medium">
            Model real-time team stats, customize high-dimensional offsets, and follow followed franchises alongside sub-second container shipping cargo and marine weather traffic indexes. Engineered strictly for academic research and physical simulation experiments. All users receive a private workspace to organize variables.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button 
              id="btn-guest-continue"
              onClick={onContinueAsGuest} 
              className="flex-1 sm:flex-none px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black transition shadow-[0_0_20px_rgba(79,70,229,0.25)] flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer"
            >
              <span>Build Blank Workspace (Guest)</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => openAuthModal("signup")} 
              className="flex-1 sm:flex-none px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-850 text-white font-bold border border-slate-800 transition flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer font-sans"
            >
              <span>Access Cloud Account</span>
            </button>
          </div>

          {/* Quick SaaS stats badge */}
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-900 max-w-lg text-left">
            <div>
              <p className="text-xs text-slate-500 font-medium font-mono uppercase">Simulation Confidence</p>
              <h4 className="text-xl font-bold text-indigo-400">84.2%</h4>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium font-mono uppercase">Grounding Engine</p>
              <h4 className="text-xl font-bold text-white">Google Search</h4>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium font-mono uppercase">Update Frequency</p>
              <h4 className="text-xl font-bold text-indigo-300">{"< 12ms"}</h4>
            </div>
          </div>
        </div>

        {/* Hero Interactive Feature Telemetry Card */}
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500/10 rounded-[2.5rem] blur-3xl pointer-events-none" />
          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 relative space-y-6 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-slate-850/85 pb-4">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 font-mono flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                Live Telemetry Simulation
              </span>
              <span className="bg-indigo-500/20 text-indigo-400 text-[9px] px-2 py-0.5 rounded font-mono font-bold">ACTIVE PRO</span>
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-850/80 flex justify-between items-center">
                <div>
                  <h4 className="font-extrabold text-sm text-white font-sans">SF 49ers vs KC Chiefs</h4>
                  <p className="text-[9px] text-indigo-400 font-bold uppercase tracking-wider font-mono mt-1">Match Projection Engine v4.2 — Quantum Odds Active</p>
                </div>
                <div className="text-right">
                  <span className="bg-indigo-500/10 text-indigo-400 text-xs px-2 py-1 rounded font-mono font-bold border border-indigo-500/20">A+ Edge</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-850/80 space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-350 font-semibold font-sans">Search Grounded Intelligence</span>
                  <span className="text-indigo-400 font-mono font-bold">Enabled</span>
                </div>
                <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500" style={{ width: "81%" }} />
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed italic text-center font-sans font-medium">
              "ApexOdds Quantum visualizes match parameters using real-world search-grounded statistics in seconds."
            </p>
          </div>
        </div>
      </main>

      {/* Feature Section Grid */}
      <section className="relative z-10 max-w-7xl w-full mx-auto px-6 py-12 border-t border-slate-900 grid md:grid-cols-3 gap-8">
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-850/80 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
            <Search className="w-5 h-5 text-indigo-400" />
          </div>
          <h4 className="font-extrabold text-base text-white">Google Search Grounding</h4>
          <p className="text-xs text-slate-400 leading-relaxed font-sans font-medium">
            Tired of outdated statistics? Harness real-time search queries to feed recent team rest matrices, player trades, stadium conditions, and harbor queue waits directly to our models.
          </p>
        </div>
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-850/80 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
            <Cpu className="w-5 h-5 text-indigo-400" />
          </div>
          <h4 className="font-extrabold text-base text-white">Custom Parameter Modeler</h4>
          <p className="text-xs text-slate-400 leading-relaxed font-sans font-medium">
            Set custom offensive, defensive, home field, container route delays, and harbor draft coefficients to fine-tune score projections in our simulation sandbox.
          </p>
        </div>
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-850/80 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
            <Database className="w-5 h-5 text-indigo-400" />
          </div>
          <h4 className="font-extrabold text-base text-white">Durable Cloud Sync</h4>
          <p className="text-xs text-slate-400 leading-relaxed font-sans font-medium">
            Create an account to securely sync favorite franchises, save matchup simulation findings, configure push parameters, and store custom observation sheets.
          </p>
        </div>
      </section>

      {/* Breakthrough Model v4.2 Section */}
      <section className="relative z-10 max-w-7xl w-full mx-auto px-6 py-16 border-t border-slate-900 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/25 px-3 py-1 rounded-full text-[10px] font-mono tracking-widest text-indigo-400 font-bold uppercase">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>THE BREAKTHROUGH MODEL V4.2</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
              The Absolute Apex of <br />
              <span className="bg-gradient-to-r from-indigo-400 to-teal-400 bg-clip-text text-transparent">Sports Telemetry Modeling.</span>
            </h2>
            
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-sans font-medium">
              Model v4.2 is the most powerful simulation architecture we have ever deployed. By blending multi-layered high-frequency Monte Carlo routines with our proprietary **Google Search Grounding Engine**, v4.2 delivers unmatched analytical precision for sports matchups and shipping cargo flows.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex gap-3 bg-slate-900/40 p-3.5 rounded-2xl border border-white/5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">14x Deep Telemetry Speed</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Sub-second execution of parallel high-dimensional matchup scenarios.</p>
                </div>
              </div>

              <div className="flex gap-3 bg-slate-900/40 p-3.5 rounded-2xl border border-white/5">
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center shrink-0">
                  <Globe className="w-4 h-4 text-teal-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider font-mono">Quantum Intelligence Web Grounding</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Inject up-to-the-minute browser search variables to immediately model injuries, weather events, and cargo flows.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] p-8 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" />
            <h4 className="text-xs font-black text-white font-mono uppercase tracking-widest border-b border-white/5 pb-3 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              <span>Model v4.2 Neural Outliers</span>
            </h4>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center text-[10px] font-mono mb-1.5">
                  <span className="text-slate-450 uppercase font-black">Monte Carlo Coverage</span>
                  <span className="text-indigo-400 font-bold">99.8%</span>
                </div>
                <div className="h-2 bg-slate-950 rounded-full p-0.5 overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: "99.8%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-[10px] font-mono mb-1.5">
                  <span className="text-slate-450 uppercase font-black">Search Confidence Interval</span>
                  <span className="text-indigo-400 font-bold">94.6%</span>
                </div>
                <div className="h-2 bg-slate-950 rounded-full p-0.5 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-400 to-teal-400 rounded-full" style={{ width: "94.6%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-[10px] font-mono mb-1.5">
                  <span className="text-slate-450 uppercase font-black">Accuracy Edge vs Baseline</span>
                  <span className="text-indigo-400 font-bold">+18.4%</span>
                </div>
                <div className="h-2 bg-slate-950 rounded-full p-0.5 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full" style={{ width: "88%" }} />
                </div>
              </div>

              <div className="pt-2 bg-black/35 p-4 rounded-2xl border border-white/5 font-mono text-[10px] text-indigo-300">
                <span className="block font-bold uppercase text-white mb-1">SYSTEM BRIEF: MODEL_STATE</span>
                MODEL_REVISION: v4.2-PROD-2026<br />
                AURA_ENGINE: ACTIVE<br />
                PROJECTION_METRICS: DEPLOYED (1,024,000 COUPLING DIMENSIONS)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SaaS Plans section */}
      <section className="relative z-10 max-w-7xl w-full mx-auto px-6 py-12 border-t border-slate-900">
        <div className="text-center max-w-lg mx-auto mb-12">
          <h3 className="text-2xl font-black text-white uppercase tracking-wider">Analytical SaaS Subscriptions</h3>
          <p className="text-xs text-slate-400 mt-2">Scale your simulator capacity from recreational to high-frequency bookmaker operations.</p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Free Tier */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[9px] font-mono font-bold text-indigo-400 uppercase bg-slate-950 px-2 py-1 rounded">Recreational</span>
              <h4 className="text-lg font-extrabold text-white mt-2">Free Plan</h4>
              <p className="text-[11px] text-slate-400 mt-1">Get started with standard matchup models.</p>
              <h2 className="text-2xl font-black text-white mt-3">$0 <span className="text-xs text-slate-500 font-medium">/ month</span></h2>
              <ul className="text-[11px] text-slate-300 mt-4 space-y-2">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> 3 projections count/day</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> NFL & NBA standard leagues</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> 3 Vault capacity saves</li>
                <li className="flex items-center gap-1.5 text-slate-500"><Check className="w-3.5 h-3.5 text-slate-650 shrink-0" /> No CSV exports</li>
              </ul>
            </div>
            <button id="btn-free-tier-register" onClick={() => openAuthModal("signup")} className="w-full bg-slate-800 hover:bg-slate-750 text-white text-xs py-2.5 rounded-xl font-bold transition cursor-pointer">Deploy Free Profile</button>
          </div>

          {/* Plus Tier */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[9px] font-mono font-bold text-indigo-400 uppercase bg-slate-950 px-2 py-1 rounded">Analytical</span>
              <h4 className="text-lg font-extrabold text-white mt-2">Plus Plan</h4>
              <p className="text-[11px] text-slate-400 mt-1">Expanded quotas with CSV exports.</p>
              <h2 className="text-2xl font-black text-white mt-3">$29 <span className="text-xs text-slate-500 font-medium">/ month</span></h2>
              <ul className="text-[11px] text-slate-300 mt-4 space-y-2">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> 10 projections count/day</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> UFC, MLB, Soccer & Hockey</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> 10 Vault capacity saves</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Premium CSV exports</li>
              </ul>
            </div>
            <button id="btn-plus-tier-register" onClick={() => openAuthModal("signup")} className="w-full bg-slate-800 hover:bg-slate-750 text-white text-xs py-2.5 rounded-xl font-bold transition cursor-pointer">Get Analytical Plus</button>
          </div>

          {/* Pro Tier */}
          <div className="p-6 rounded-3xl bg-slate-900/100 border border-indigo-500/30 flex flex-col justify-between space-y-4 relative shadow-[0_0_20px_rgba(79,70,229,0.15)]">
            <div className="absolute top-0 right-6 -translate-y-1/2 bg-indigo-600 text-[8px] text-white font-extrabold px-2.5 py-0.5 rounded-full font-mono uppercase tracking-widest">HIGHEST DEMAND</div>
            <div>
              <span className="text-[9px] font-mono font-bold text-indigo-400 uppercase bg-slate-950 px-2 py-1 rounded">Professional</span>
              <h4 className="text-lg font-extrabold text-white mt-2">Elite Pro Plan</h4>
              <p className="text-[11px] text-slate-400 mt-1">Unlimited simulations for heavy sports analysts.</p>
              <h2 className="text-2xl font-black text-white mt-3">$49 <span className="text-xs text-slate-500 font-medium">/ month</span></h2>
              <ul className="text-[11px] text-slate-300 mt-4 space-y-2">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Unlimited projections count</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> All core and exclusive leagues</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Unlimited Vault capacity saves</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> 10k Monte Carlo calculations</li>
              </ul>
            </div>
            <button id="btn-pro-tier-register" onClick={() => openAuthModal("signup")} className="w-full bg-indigo-600 hover:bg-indigo-550 text-white text-xs py-2.5 rounded-xl font-bold transition cursor-pointer">Activate Elite SaaS</button>
          </div>

          {/* Syndicate Tier */}
          <div className="p-6 rounded-3xl bg-indigo-950/20 border border-indigo-400/30 flex flex-col justify-between space-y-4 relative">
            <div className="absolute top-0 right-6 -translate-y-1/2 bg-amber-500 text-[8px] text-slate-950 font-black px-2.5 py-0.5 rounded-full font-mono uppercase tracking-widest">Syndicate Level</div>
            <div>
              <span className="text-[9px] font-mono font-bold text-amber-400 uppercase bg-slate-950 px-2 py-1 rounded font-mono">Bookmaker Grade</span>
              <h4 className="text-lg font-extrabold text-white mt-2">Syndicate Plan</h4>
              <p className="text-[11px] text-slate-400 mt-1">Industrial scale sub-second syndicate operations.</p>
              <h2 className="text-2xl font-black text-white mt-3">$99 <span className="text-xs text-slate-500 font-medium font-medium">/ month</span></h2>
              <ul className="text-[11px] text-slate-300 mt-4 space-y-2">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-amber-400 shrink-0" /> Ultra-high capacity workflows</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-amber-400 shrink-0" /> Tailored sports models</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-amber-400 shrink-0" /> High-fidelity expert findings</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-amber-400 shrink-0" /> Deep team fatigue logs</li>
              </ul>
            </div>
            <button id="btn-syndicate-tier-register" onClick={() => openAuthModal("signup")} className="w-full bg-slate-800 hover:bg-slate-750 text-white text-xs py-2.5 rounded-xl font-bold transition cursor-pointer">Initiate Syndicate</button>
          </div>
        </div>
      </section>

      {/* Auth Modal overlay */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-indigo-500/10 max-w-sm w-full rounded-[2rem] p-8 relative shadow-[0_0_50px_rgba(79,70,229,0.15)]">
            <button 
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute right-5 top-5 text-slate-400 hover:text-white font-extrabold text-sm w-8 h-8 flex items-center justify-center bg-slate-950 border border-slate-850 rounded-full cursor-pointer"
            >
              ×
            </button>
            <div className="mb-6">
              <h3 className="text-2xl font-black text-white">
                {authMode === "login" ? "Welcome Back" : "Create Account"}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {authMode === "login" ? "Sign in to access secure cloud synchronization." : "Create your free Standard Tier profile."}
              </p>
            </div>

            <form onSubmit={handleEmailAuth} className="space-y-4">
              {authMode === "signup" && (
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1.5">Username / Handle</label>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. sharp_bettor_99"
                    required={authMode === "signup"}
                    className="w-full text-xs rounded-xl border border-slate-800 bg-slate-955 px-4 py-3 text-white outline-none focus:border-indigo-550"
                  />
                </div>
              )}
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1.5">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="analyst@apexodds.io"
                  required
                  className="w-full text-xs rounded-xl border border-slate-800 bg-slate-955 px-4 py-3 text-white outline-none focus:border-indigo-550"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1.5">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full text-xs rounded-xl border border-slate-800 bg-slate-955 px-4 py-3 text-white outline-none focus:border-indigo-550"
                />
              </div>

              {errorMsg && (
                <p className="text-xs text-rose-400 bg-rose-500/10 p-3 rounded-lg border border-rose-500/20 leading-relaxed font-mono">
                  {errorMsg}
                </p>
              )}

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 tracking-wide uppercase shadow-[0_0_15px_rgba(79,70,229,0.3)] transition cursor-pointer"
              >
                {isLoading ? "Validating Session..." : authMode === "login" ? "Initialize Secure Session" : "Deploy SaaS Cloud Profile"}
              </button>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-850"></div>
                <span className="flex-shrink mx-4 text-[9px] text-slate-500 uppercase font-bold tracking-widest">or connect with</span>
                <div className="flex-grow border-t border-slate-850"></div>
              </div>

              <button 
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full py-3 px-4 rounded-xl border border-slate-800 bg-slate-955 hover:bg-slate-900 text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg className="w-4 h-4 text-indigo-400" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12.5 11h9.3a10 10 0 1 1-3-7.5l-2.4 2.4A7 7 0 1 0 12 17a6.8 6.8 0 0 0 6.1-4H12.5V11z"/>
                </svg>
                <span>Google Workspace Sign-in</span>
              </button>

              <p className="text-center text-xs text-slate-450 pt-2">
                <span>{authMode === "login" ? "New to ApexOdds Quantum?" : "Already have a profile?"}</span>{" "}
                <button 
                  type="button" 
                  onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")}
                  className="font-bold text-white underline decoration-dotted underline-offset-4 cursor-pointer"
                >
                  {authMode === "login" ? "Register instead" : "Log in instead"}
                </button>
              </p>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl w-full mx-auto border-t border-slate-900 py-8 text-center text-[10px] text-slate-500 px-6">
        <p>&copy; 2026 ApexOdds Quantum Inc. Grounding models verified via Google Search Grounding. For educational and structural analysis use only.</p>
      </footer>

    </div>
  );
}
