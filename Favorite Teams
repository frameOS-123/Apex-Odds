import React, { useState } from "react";
import { Star, Plus, ShieldCheck, Trash2, Search, Newspaper, Globe, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { Team } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface FavoriteTeamsProps {
  favoriteTeams: Team[];
  onAddTeam: (teamName: string, sportName: string) => void;
  onRemoveTeam: (teamName: string) => void;
}

interface TeamNewsItem {
  news: string;
  sources: Array<{ title: string; url: string }>;
  loading: boolean;
  error?: string;
}

export default function FavoriteTeams({ favoriteTeams, onAddTeam, onRemoveTeam }: FavoriteTeamsProps) {
  const [newTeamName, setNewTeamName] = useState("");
  const [newSport, setNewSport] = useState("NFL");
  const [searchQuery, setSearchQuery] = useState("");

  // News states for followed teams
  const [teamNews, setTeamNews] = useState<Record<string, TeamNewsItem>>({});
  const [expandedNewsTeam, setExpandedNewsTeam] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;

    onAddTeam(newTeamName.trim(), newSport);
    setNewTeamName("");
  };

  const fetchNewsForTeam = async (teamName: string, sport: string) => {
    setTeamNews(prev => ({
      ...prev,
      [teamName]: { news: "", sources: [], loading: true }
    }));

    try {
      const res = await fetch("/api/team-news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamName, sport })
      });
      if (!res.ok) {
        throw new Error("Unable to fetch news feed");
      }
      const data = await res.json();
      setTeamNews(prev => ({
        ...prev,
        [teamName]: { 
          news: data.news, 
          sources: data.sources || [], 
          loading: false 
        }
      }));
    } catch (err: any) {
      console.error(err);
      setTeamNews(prev => ({
        ...prev,
        [teamName]: { 
          news: "", 
          sources: [], 
          loading: false, 
          error: "Headlines transmission paused. Check connections." 
        }
      }));
    }
  };

  const handleToggleNews = (teamName: string, sport: string) => {
    if (expandedNewsTeam === teamName) {
      setExpandedNewsTeam(null);
    } else {
      setExpandedNewsTeam(teamName);
      if (!teamNews[teamName]) {
        fetchNewsForTeam(teamName, sport);
      }
    }
  };

  const renderNewsContent = (newsText: string) => {
    if (!newsText) return null;
    const lines = newsText.split("\n").map(l => l.trim()).filter(l => l.length > 0 && l !== "-");
    return (
      <ul className="space-y-2 mt-1">
        {lines.map((line, lIdx) => {
          const cleanLine = line.replace(/^-\s*/, "").replace(/^\*\s*/, "").replace(/^•\s*/, "");
          return (
            <li key={lIdx} className="flex gap-2 text-[11px] leading-relaxed text-slate-300 font-sans font-medium text-left">
              <span className="text-emerald-400 select-none font-bold mt-0.5">•</span>
              <span>{cleanLine}</span>
            </li>
          );
        })}
      </ul>
    );
  };

  const filteredTeams = favoriteTeams.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.sport.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-slate-900 border border-white/10 rounded-[2rem] p-6 md:p-8 space-y-6 select-none">
      
      {/* Header view */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h3 className="text-lg font-extrabold text-white">Favorite Team Workspaces</h3>
          <p className="text-xs text-slate-400">Configure notifications, upcoming matchups, and trend alerts for your followed franchises.</p>
        </div>

        {/* Add custom favorite form overlay */}
        <form onSubmit={handleSubmit} className="flex gap-2 flex-wrap sm:flex-nowrap">
          <select 
            value={newSport} 
            onChange={(e) => setNewSport(e.target.value)}
            className="bg-black/40 border border-white/10 px-3.5 py-2 rounded-xl text-xs text-slate-200 outline-none focus:border-emerald-400 cursor-pointer"
          >
            <option value="NFL">🏈 NFL</option>
            <option value="NBA">🏀 NBA</option>
            <option value="MLB">⚾ MLB</option>
            <option value="Soccer">⚽ Soccer</option>
          </select>
          <input 
            type="text"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            placeholder="Franchise Name..."
            className="bg-black/40 border border-white/10 px-4 py-2 rounded-xl text-xs text-white outline-none focus:border-emerald-400 w-36 sm:w-48"
          />
          <button 
            type="submit"
            className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 font-bold" />
            <span>Follow</span>
          </button>
        </form>
      </div>

      {/* Search Input Bar */}
      {favoriteTeams.length > 0 && (
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search followed teams by name or sport..."
            className="bg-black/30 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold text-white outline-none focus:border-emerald-400 w-full"
          />
        </div>
      )}

      {/* Grid listing */}
      {favoriteTeams.length === 0 ? (
        <div className="text-center py-16 opacity-70 space-y-3">
          <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center mx-auto">
            <Star className="w-5 h-5 text-emerald-400" />
          </div>
          <h4 className="text-white font-bold text-sm">No diikuti team workspaces active</h4>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Your followed list is blank. Add your favorite franchises above to track prediction parameters and rest index cycles easily.
          </p>
        </div>
      ) : filteredTeams.length === 0 ? (
        <div className="text-center py-12 opacity-75 space-y-3">
          <p className="text-xs text-slate-400">No teams matched "{searchQuery}"</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((t, idx) => {
            const isNewsOpen = expandedNewsTeam === t.name;
            const newsData = teamNews[t.name];

            return (
              <div 
                key={idx} 
                className="p-6 rounded-3xl bg-black/35 border border-white/5 space-y-4 relative overflow-hidden group hover:border-emerald-500/25 transition duration-300 flex flex-col justify-between"
              >
                <div>
                  <button 
                    onClick={() => onRemoveTeam(t.name)}
                    className="absolute right-4 top-4 text-slate-500 hover:text-rose-400 transition cursor-pointer"
                    title="Stop following team"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="space-y-1">
                    <span className="text-[9px] text-emerald-400 font-bold block font-mono uppercase tracking-widest">{t.sport} FRANCHISE</span>
                    <h4 className="font-extrabold text-white text-base text-left">{t.name}</h4>
                  </div>

                  <div className="p-3 bg-black/40 rounded-xl space-y-1.5 text-xs font-mono leading-relaxed mt-4">
                    <div className="flex justify-between text-slate-400">
                      <span>Up Matchup:</span>
                      <span className="text-white font-semibold">{t.nextMatch}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Forecast Win:</span>
                      <span className="text-emerald-400 font-bold">{t.winProb}</span>
                    </div>
                  </div>
                </div>

                {/* Grounded news feed triggers */}
                <div className="pt-2">
                  <button
                    onClick={() => handleToggleNews(t.name, t.sport)}
                    className="w-full py-2.5 mt-2 bg-slate-800/60 hover:bg-slate-800/100 text-[10px] font-bold text-slate-300 hover:text-white rounded-xl border border-white/5 transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Newspaper className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                    <span>{isNewsOpen ? "Hide Grounded Intel" : "View Live News Feed"}</span>
                    {isNewsOpen ? <ChevronUp className="w-3.5 h-3.5 ml-0.5" /> : <ChevronDown className="w-3.5 h-3.5 ml-0.5" />}
                  </button>

                  <AnimatePresence>
                    {isNewsOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 pt-3 border-t border-white/5 space-y-3">
                          <div className="flex justify-between items-center bg-slate-950/65 py-1 px-2 rounded-lg border border-white/5">
                            <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                              <Globe className="w-3 h-3 text-emerald-400" />
                              Search Grounded
                            </span>
                            
                            <button
                              disabled={newsData?.loading}
                              onClick={() => fetchNewsForTeam(t.name, t.sport)}
                              className="text-slate-400 hover:text-white p-1 rounded-md transition cursor-pointer disabled:opacity-40"
                              title="Fetch Fresh Grounded Headlines"
                            >
                              <RefreshCw className={`w-3 h-3 ${newsData?.loading ? "animate-spin text-emerald-400" : ""}`} />
                            </button>
                          </div>

                          {newsData?.loading && (
                            <div className="py-8 text-center space-y-2">
                              <RefreshCw className="w-5 h-5 text-emerald-400 animate-spin mx-auto" />
                              <p className="text-[10px] font-mono text-slate-400">Consulting real-time feed pipelines...</p>
                            </div>
                          )}

                          {newsData?.error && (
                            <div className="p-3 bg-red-950/20 border border-red-500/20 rounded-xl text-center">
                              <p className="text-[10px] text-red-300 font-mono">{newsData.error}</p>
                            </div>
                          )}

                          {!newsData?.loading && !newsData?.error && newsData?.news && (
                            <div className="space-y-3">
                              {renderNewsContent(newsData.news)}

                              {newsData.sources && newsData.sources.length > 0 && (
                                <div className="pt-2 border-t border-white/5">
                                  <span className="text-[8px] uppercase tracking-wider font-extrabold text-slate-500 block mb-1">
                                    Cited Sources
                                  </span>
                                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                                    {newsData.sources.map((src, sIdx) => {
                                      // Only render if we have a valid title/index
                                      if (!src.title) return null;
                                      return (
                                        <a
                                          key={sIdx}
                                          href={src.url}
                                          target="_blank"
                                          referrerPolicy="no-referrer"
                                          rel="noopener noreferrer"
                                          className="text-[9px] text-emerald-450 text-emerald-400 hover:underline max-w-full truncate block bg-slate-950/80 px-2 py-0.5 rounded border border-white/5 font-sans font-semibold"
                                          title={src.title}
                                        >
                                          🔗 {src.title.length > 18 ? src.title.slice(0, 18) + "..." : src.title}
                                        </a>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
