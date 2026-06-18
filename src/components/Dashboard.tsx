import React, { useState, useEffect } from "react";
import { 
  Target, Calendar, Zap, Activity, Flame, ShieldAlert, Sparkles, ArrowRight, Play,
  GitCompare, XSquare, BrainCircuit, RefreshCw, BarChart2, ChevronRight, Globe, Search, TrendingUp,
  ChevronUp, ChevronDown, GripVertical, Lock, ArrowUpDown
} from "lucide-react";
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip
} from "recharts";
import { Prediction } from "../types";

interface DashboardProps {
  initialized: boolean;
  onInitializeWorkspace: () => void;
  predictions: Prediction[];
  userTier?: "free" | "plus" | "pro" | "syndicate";
  onUpgrade?: () => void;
  onQuickAnalyze: (sport: string, matchup: string) => void;
}

export default function Dashboard({ 
  initialized, 
  onInitializeWorkspace, 
  predictions, 
  userTier = "free",
  onUpgrade,
  onQuickAnalyze 
}: DashboardProps) {
  // Drag & drop sorting layout states
  const [widgets, setWidgets] = useState<string[]>(() => {
    const saved = localStorage.getItem("apexodds_dashboard_widgets");
    return saved ? JSON.parse(saved) : ["metrics", "predictions", "sentiment", "trends"];
  });
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    if (userTier !== "pro" && userTier !== "syndicate") return;
    setDraggedId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (userTier !== "pro" && userTier !== "syndicate") return;
    if (dragOverId !== id) {
      setDragOverId(id);
    }
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (userTier !== "pro" && userTier !== "syndicate") return;
    if (!draggedId || draggedId === targetId) return;

    const sourceIndex = widgets.indexOf(draggedId);
    const targetIndex = widgets.indexOf(targetId);
    const updated = [...widgets];
    updated.splice(sourceIndex, 1);
    updated.splice(targetIndex, 0, draggedId);

    setWidgets(updated);
    localStorage.setItem("apexodds_dashboard_widgets", JSON.stringify(updated));
    setDraggedId(null);
    setDragOverId(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverId(null);
  };

  const moveWidget = (id: string, dir: "up" | "down") => {
    const idx = widgets.indexOf(id);
    if (idx === -1) return;
    const nextIdx = dir === "up" ? idx - 1 : idx + 1;
    if (nextIdx < 0 || nextIdx >= widgets.length) return;

    const updated = [...widgets];
    const temp = updated[idx];
    updated[idx] = updated[nextIdx];
    updated[nextIdx] = temp;

    setWidgets(updated);
    localStorage.setItem("apexodds_dashboard_widgets", JSON.stringify(updated));
  };

  const renderWidgetHeader = (id: string, title: string) => {
    const isPro = userTier === "pro" || userTier === "syndicate";
    const idx = widgets.indexOf(id);

    return (
      <div className="flex items-center justify-between bg-slate-950/60 border border-slate-900 px-5 py-2.5 rounded-2xl mb-3 text-xs font-semibold backdrop-blur select-none">
        <div className="flex items-center gap-2">
          {isPro && (
            <div 
              className="cursor-grab active:cursor-grabbing text-slate-500 hover:text-indigo-450 p-1"
              title="Drag handle to reorganize workspace"
            >
              <GripVertical className="w-3.5 h-3.5" />
            </div>
          )}
          <span className="text-[9px] font-mono uppercase bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded font-black border border-indigo-500/20">
            {id === "sentiment" ? "GROUNDING" : id.toUpperCase()}
          </span>
          <span className="text-white font-extrabold tracking-wide font-sans text-xs">{title}</span>
        </div>

        <div className="flex items-center gap-1">
          {isPro ? (
            <>
              <button 
                onClick={() => moveWidget(id, "up")}
                disabled={idx === 0}
                className="p-1 px-1.5 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-705 disabled:opacity-20 disabled:hover:text-slate-400 transition cursor-pointer"
                title="Move up"
              >
                <ChevronUp className="w-3 h-3" />
              </button>
              <button 
                onClick={() => moveWidget(id, "down")}
                disabled={idx === widgets.length - 1}
                className="p-1 px-1.5 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-705 disabled:opacity-20 disabled:hover:text-slate-400 transition cursor-pointer"
                title="Move down"
              >
                <ChevronDown className="w-3 h-3" />
              </button>
            </>
          ) : (
            <button
              onClick={onUpgrade}
              className="text-[8px] font-mono tracking-widest uppercase font-black text-amber-400 hover:text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full flex items-center gap-1 border border-amber-400/20 cursor-pointer"
              title="Plus/Pro feature to customize widgets"
            >
              <Lock className="w-2.5 h-2.5 text-amber-500" />
              Arrange Canvas
            </button>
          )}
        </div>
      </div>
    );
  };

  // Quick Compare states
  const [compareModalTeams, setCompareModalTeams] = useState<{ teamA: string; teamB: string; sport: string } | null>(null);
  const [offenseA, setOffenseA] = useState(80);
  const [offenseB, setOffenseB] = useState(80);
  const [defenseA, setDefenseA] = useState(80);
  const [defenseB, setDefenseB] = useState(80);
  const [formA, setFormA] = useState(80);
  const [formB, setFormB] = useState(80);
  const [coachA, setCoachA] = useState(80);
  const [coachB, setCoachB] = useState(80);
  const [isSimulating, setIsSimulating] = useState(false);

  // Market Sentiment search-grounded states
  const [sentimentData, setSentimentData] = useState<any[]>([]);
  const [sentimentSources, setSentimentSources] = useState<any[]>([]);
  const [selectedSentimentTeam, setSelectedSentimentTeam] = useState<string>("");
  const [isSentimentLoading, setIsSentimentLoading] = useState(true);

  useEffect(() => {
    const fetchSentiment = async () => {
      try {
        setIsSentimentLoading(true);
        const res = await fetch("/api/market-sentiment");
        if (res.ok) {
          const data = await res.json();
          if (data && data.teams) {
            setSentimentData(data.teams);
            setSentimentSources(data.sources || []);
            if (data.teams.length > 0) {
              setSelectedSentimentTeam(data.teams[0].name);
            }
          }
        }
      } catch (err) {
        console.warn("Error fetching sentiment", err);
      } finally {
        setIsSentimentLoading(false);
      }
    };
    fetchSentiment();
  }, []);

  const getStableMetric = (nameA: string, nameB: string, multiplier: number, offset: number) => {
    const sum = nameA.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) + 
                nameB.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) * multiplier;
    return (sum % 20) + offset;
  };

  useEffect(() => {
    if (compareModalTeams) {
      const { teamA, teamB } = compareModalTeams;
      setOffenseA(getStableMetric(teamA, teamB, 1, 75));
      setOffenseB(getStableMetric(teamB, teamA, 2, 75));
      setDefenseA(getStableMetric(teamA, teamB, 3, 75));
      setDefenseB(getStableMetric(teamB, teamA, 4, 75));
      setFormA(getStableMetric(teamA, teamB, 5, 75));
      setFormB(getStableMetric(teamB, teamA, 6, 75));
      setCoachA(getStableMetric(teamA, teamB, 7, 75));
      setCoachB(getStableMetric(teamB, teamA, 8, 75));
    }
  }, [compareModalTeams]);

  const recalculateCompareMetrics = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setOffenseA(Math.floor(Math.random() * 20) + 76);
      setOffenseB(Math.floor(Math.random() * 20) + 76);
      setDefenseA(Math.floor(Math.random() * 20) + 76);
      setDefenseB(Math.floor(Math.random() * 20) + 76);
      setFormA(Math.floor(Math.random() * 20) + 76);
      setFormB(Math.floor(Math.random() * 20) + 76);
      setCoachA(Math.floor(Math.random() * 20) + 76);
      setCoachB(Math.floor(Math.random() * 20) + 76);
      setIsSimulating(false);
    }, 600);
  };

  const getVerdictText = () => {
    if (!compareModalTeams) return "";
    const powerA = (offenseA + defenseA + formA + coachA) / 4;
    const powerB = (offenseB + defenseB + formB + coachB) / 4;
    
    if (powerA > powerB) {
      return `Neural comparison filters strongly favor ${compareModalTeams.teamA} (Model delta: +${(powerA - powerB).toFixed(1)}%). High defensive indices paired with tactical rest cycles yield a secure home field probability advantage.`;
    } else {
      return `Comparative telemetry favors ${compareModalTeams.teamB} (Model delta: +${(powerB - powerA).toFixed(1)}%). Outstanding offensive output parameters and peak form values suggest potential underdog variance.`;
    }
  };

  if (!initialized) {
    return (
      <div id="blank-workspace-container" className="py-12 flex items-center justify-center min-h-[60vh] select-none">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 max-w-2xl text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-[-30%] left-[-30%] w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="w-16 h-16 rounded-2xl bg-indigo-550/10 flex items-center justify-center mx-auto border border-indigo-500/20">
            <Sparkles className="w-8 h-8 text-indigo-400 animate-pulse" />
          </div>

          <div className="space-y-2">
            <span className="bg-indigo-500/10 text-indigo-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-indigo-500/20">Canvas Engine Enabled</span>
            <h2 className="text-3xl font-black text-white mt-4">Create Custom Workspace</h2>
            <p className="text-slate-400 text-xs md:text-sm leading-relaxed max-w-md mx-auto">
              Your analytics workspace is currently blank and ready. Deploy the modular design template to seed predictions, player indicators, and comparison tabs.
            </p>
          </div>

          <button 
            onClick={onInitializeWorkspace}
            className="px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black transition text-xs uppercase tracking-wider cursor-pointer"
          >
            Deploy Analytical Canvas
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 select-none font-sans">
      
      {/* Personalized Workspace Header Block for Pro & Syndicate users */}
      {(userTier === "pro" || userTier === "syndicate") && (
        <div className="p-4 bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-indigo-950/40 border border-indigo-500/10 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/15 rounded-xl border border-indigo-500/20 text-indigo-400">
              <ArrowUpDown className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase text-indigo-400 font-mono tracking-wider">Modular Workspace Personalizer Active</h4>
              <p className="text-[11px] text-slate-400">Pro features unlocked! Drag each module by its handle or use manual arrows to sort your workspace dashboard.</p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full uppercase">
            LIVE COMPOSER
          </span>
        </div>
      )}

      {widgets.map((widgetId) => {
        const isDragged = draggedId === widgetId;
        const isOver = dragOverId === widgetId;

        return (
          <div
            key={widgetId}
            draggable={userTier === "pro" || userTier === "syndicate"}
            onDragStart={(e) => handleDragStart(e, widgetId)}
            onDragOver={(e) => handleDragOver(e, widgetId)}
            onDrop={(e) => handleDrop(e, widgetId)}
            onDragEnd={handleDragEnd}
            className={`transition-all duration-300 relative group/widget ${
              isDragged ? "opacity-30 scale-95" : ""
            } ${
              isOver ? "border-2 border-dashed border-indigo-500 bg-indigo-500/5 p-4 rounded-[2rem] scale-98" : ""
            }`}
          >
            {widgetId === "metrics" && (
              <div className="space-y-3">
                {renderWidgetHeader("metrics", "Quick Stats & Metrics Counters")}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-slate-900 border border-slate-800 hover:border-slate-705 px-6 py-6 rounded-3xl relative overflow-hidden transition-all duration-300">
                    <div className="absolute right-4 top-4 w-11 h-11 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-550/20">
                      <Target className="w-5 h-5 text-indigo-400" />
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">AI Model Accuracy</p>
                    <h3 className="text-2xl font-black text-white font-mono mt-2">84.2%</h3>
                    <span className="text-[9px] text-indigo-400 font-bold font-mono mt-1 inline-block">↑ 2.1% this session</span>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 hover:border-slate-705 px-6 py-6 rounded-3xl relative overflow-hidden transition-all duration-300">
                    <div className="absolute right-4 top-4 w-11 h-11 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-550/20">
                      <Calendar className="w-5 h-5 text-indigo-400" />
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Your Active Predictions</p>
                    <h3 className="text-2xl font-black text-white font-mono mt-2">{predictions.length}</h3>
                    <span className="text-[9px] text-indigo-400 font-bold font-mono mt-1 inline-block">Projections inside your vault</span>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 hover:border-slate-705 px-6 py-6 rounded-3xl relative overflow-hidden transition-all duration-300">
                    <div className="absolute right-4 top-4 w-11 h-11 bg-amber-500/10 rounded-2xl flex items-center justify-center border border-amber-550/20">
                      <Zap className="w-5 h-5 text-amber-400" />
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Accurate Match Spreads</p>
                    <h3 className="text-2xl font-black text-white font-mono mt-2">12 in a row</h3>
                    <span className="text-[9px] text-amber-400 font-bold font-mono mt-1 inline-block">🔥 Active Level Double XP</span>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 hover:border-slate-705 px-6 py-6 rounded-3xl relative overflow-hidden transition-all duration-300">
                    <div className="absolute right-4 top-4 w-11 h-11 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-550/20">
                      <Activity className="w-5 h-5 text-indigo-400" />
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Key Top Franchise</p>
                    <h3 className="text-2xl font-black text-white mt-2">NFL Pro</h3>
                    <span className="text-[9px] text-indigo-400 font-bold font-mono mt-1 inline-block">89.8% accurate predictions</span>
                  </div>
                </div>
              </div>
            )}

            {widgetId === "predictions" && (
              <div className="space-y-4">
                {renderWidgetHeader("predictions", "Active Matchup Predictions")}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {predictions.map((p) => {
                    return (
                      <div 
                        key={p.id} 
                        className="bg-slate-900 border border-slate-800 hover:border-indigo-500/30 rounded-3xl p-6 transition-all duration-300 relative group overflow-hidden pb-[95px]"
                      >
                        {/* Floating Quick Compare button with adjusted z-index and spacing constraints */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setCompareModalTeams({ teamA: p.teamA, teamB: p.teamB, sport: p.sport });
                          }}
                          className="absolute right-4 bg-slate-950/90 hover:bg-indigo-600 hover:text-white text-indigo-400 px-2.5 py-1.5 rounded-xl border border-white/5 hover:border-indigo-400/40 transition-all duration-300 shadow-xl flex items-center gap-1.5 cursor-pointer z-10 hover:shadow-indigo-500/10"
                          style={{ top: p.edgeLevel === "High" ? "36px" : "16px" }}
                          title="Quick Side-by-Side Comparison"
                        >
                          <GitCompare className="w-3.5 h-3.5 shrink-0" />
                          <span className="text-[9px] uppercase font-mono font-bold tracking-wider">Quick Compare</span>
                        </button>

                        {p.edgeLevel === "High" && (
                          <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[9px] font-extrabold px-3 py-1 rounded-bl-xl tracking-wider uppercase font-mono shadow-sm">
                            UPSET EDGE
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2 text-[10px] text-indigo-400 font-bold font-mono uppercase mb-4">
                          <span>{p.sport}</span> • <span>LIVE TELEMETRY</span>
                        </div>

                        <div className="space-y-3 mb-6">
                          <div className="flex justify-between items-center">
                            <span className="text-white font-extrabold text-base">{p.teamA}</span>
                            <span className="text-indigo-400 font-mono font-black text-base">{p.probA}%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400 font-semibold">{p.teamB}</span>
                            <span className="text-slate-400 font-mono">{p.probB}%</span>
                          </div>

                          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-2xl text-[10px] uppercase font-mono font-bold flex items-center justify-between text-left">
                            <span>🏆 Winner Edge:</span>
                            <span className="text-white font-extrabold">{p.probA >= p.probB ? p.teamA : p.teamB}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-center text-xs mb-4">
                          <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800">
                            <p className="text-slate-500 text-[8px] font-bold uppercase tracking-wider">SCORE</p>
                            <p className="text-white font-bold font-mono">{p.score}</p>
                          </div>
                          <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800">
                            <p className="text-slate-500 text-[8px] font-bold uppercase tracking-wider">AI CLUSTER</p>
                            <p className="text-indigo-400 font-bold font-mono">{p.edgeLevel === "High" ? "S-TIER" : "A-TIER"}</p>
                          </div>
                        </div>

                        <button 
                          onClick={() => onQuickAnalyze(p.sport, p.matchup)}
                          className="absolute bottom-6 left-6 right-6 bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 text-xs cursor-pointer shadow-sm"
                        >
                          <span>Analyze Sandbox Weights</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {widgetId === "sentiment" && (
              <div className="space-y-3">
                {renderWidgetHeader("sentiment", "Intelligence Market Sentiment Laboratory")}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
                  
                  {/* Section Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-400/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
                        <Globe className="w-3 h-3 text-indigo-400 animate-pulse" />
                        Real-time Google Grounding Matrix
                      </span>
                      <h4 className="text-sm font-extrabold text-white uppercase flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-indigo-400" />
                        Intelligence Market Sentiment Laboratory
                      </h4>
                      <p className="text-xs text-slate-400">
                        Aggregating media headlines, expert briefings, and public consensus index via real-world search synthesis.
                      </p>
                    </div>
                    
                    <button 
                      onClick={async () => {
                        try {
                          setIsSentimentLoading(true);
                          const res = await fetch("/api/market-sentiment");
                          if (res.ok) {
                            const data = await res.json();
                            if (data && data.teams) {
                              setSentimentData(data.teams);
                              setSentimentSources(data.sources || []);
                            }
                          }
                        } catch (e) {
                          console.warn(e);
                        } finally {
                          setIsSentimentLoading(false);
                        }
                      }}
                      disabled={isSentimentLoading}
                      className="flex items-center gap-1.5 bg-slate-950 hover:bg-slate-850 px-3.5 py-2 rounded-xl text-[10px] font-bold text-slate-300 hover:text-white transition cursor-pointer border border-white/5 disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSentimentLoading ? "animate-spin text-indigo-400" : ""}`} />
                      <span>Recalculate Sentiment</span>
                    </button>
                  </div>

                  {isSentimentLoading ? (
                    <div className="py-12 flex flex-col items-center justify-center space-y-4 animate-pulse">
                      <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
                      <p className="text-xs text-slate-400 font-mono">Synthesizing multi-model expert databases...</p>
                    </div>
                  ) : (
                    <div className="grid lg:grid-cols-3 gap-8">
                      
                      {/* Team Sentiment Selectors List */}
                      <div className="space-y-3.5 lg:border-r lg:border-white/5 lg:pr-6">
                        <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Top 5 Tracked Franchises</span>
                        <div className="space-y-2.5">
                          {sentimentData.map((team) => {
                            const isSelected = selectedSentimentTeam === team.name;
                            return (
                              <button
                                key={team.name}
                                onClick={() => setSelectedSentimentTeam(team.name)}
                                className={`w-full text-left p-3.5 rounded-2xl border transition duration-200 flex items-center justify-between cursor-pointer ${
                                  isSelected 
                                    ? "bg-indigo-600/10 border-indigo-500/30 text-white" 
                                    : "bg-slate-950/40 border-white/5 text-slate-400 hover:bg-white/5 hover:text-slate-200"
                                }`}
                              >
                                <div className="space-y-0.5">
                                  <strong className={`text-xs block font-bold ${isSelected ? "text-indigo-300" : "text-white"}`}>{team.name}</strong>
                                  <span className="text-[9px] block text-slate-550 font-mono font-bold uppercase tracking-wider">{team.sport} • CONSENSUS</span>
                                </div>
                                <div className="text-right flex items-center gap-2">
                                  <span className={`text-xs font-mono font-black ${
                                    team.sentimentScore >= 85 
                                      ? "text-emerald-450" 
                                      : team.sentimentScore >= 75 
                                      ? "text-indigo-400" 
                                      : "text-amber-405"
                                  }`}>
                                    {team.sentimentScore}%
                                  </span>
                                  <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? "translate-x-0.5 text-indigo-400" : "text-slate-600"}`} />
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Recharts Trend Line Visualizer */}
                      <div className="lg:col-span-2 space-y-6 flex flex-col justify-between">
                        {(() => {
                          const currentTeam = sentimentData.find(t => t.name === selectedSentimentTeam);
                          if (!currentTeam) return null;
                          const trendPoints = currentTeam.trend.map((score: number, idx: number) => ({
                            week: `Week ${idx + 1}`,
                            Sentiment: score
                          }));

                          return (
                            <>
                              <div className="space-y-4">
                                <div className="flex justify-between items-center bg-slate-950/50 px-4 py-3 rounded-2xl border border-white/5">
                                  <div>
                                    <h5 className="text-[10px] font-mono font-bold text-slate-405 uppercase tracking-widest">Active Sentiment Dossier</h5>
                                    <h4 className="text-xs font-black text-white mt-1 uppercase">{currentTeam.name} Consensus</h4>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-[10px] font-mono font-bold text-slate-450 block uppercase">Weekly Avg</span>
                                    <span className="text-indigo-400 font-mono font-bold text-xs">
                                      {Math.round(currentTeam.trend.reduce((a, b) => a + b, 0) / currentTeam.trend.length)}%
                                    </span>
                                  </div>
                                </div>

                                {/* Line Chart Area */}
                                <div className="h-44 w-full bg-slate-950/40 p-2.5 rounded-2xl border border-white/5">
                                  <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={trendPoints} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                                      <XAxis 
                                        dataKey="week" 
                                        stroke="rgba(255,255,255,0.3)" 
                                        fontSize={9} 
                                        fontFamily="JetBrains Mono"
                                        tickLine={false} 
                                      />
                                      <YAxis 
                                        stroke="rgba(255,255,255,0.3)" 
                                        fontSize={9} 
                                        fontFamily="JetBrains Mono" 
                                        domain={[50, 100]}
                                        tickLine={false}
                                      />
                                      <Tooltip 
                                        contentStyle={{ 
                                          backgroundColor: "#020617", 
                                          borderColor: "#1e293b", 
                                          borderRadius: "12px",
                                          fontSize: "10px",
                                          color: "#fff",
                                          fontFamily: "JetBrains Mono"
                                        }} 
                                      />
                                      <Line 
                                        type="monotone" 
                                        dataKey="Sentiment" 
                                        stroke="#6366f1" 
                                        strokeWidth={2.5} 
                                        activeDot={{ r: 6, fill: "#818cf8", strokeWidth: 0 }} 
                                        dot={{ r: 4, fill: "#312e81", strokeWidth: 1 }}
                                      />
                                    </LineChart>
                                  </ResponsiveContainer>
                                </div>
                              </div>

                              {/* Briefing Synopsis & Real-time Citations */}
                              <div className="space-y-4">
                                <div className="p-4 bg-slate-950/60 rounded-2xl border border-white/5 space-y-2">
                                  <span className="text-[8px] font-mono font-bold text-indigo-400 uppercase tracking-widest block">Bloomberg-Style Expert Briefing</span>
                                  <p className="text-xs text-slate-300 font-sans leading-relaxed italic">
                                    "{currentTeam.expertQuote}"
                                  </p>
                                </div>

                                {/* Sources ground check citations */}
                                {sentimentSources.length > 0 && (
                                  <div className="flex flex-wrap gap-2.5 items-center">
                                    <span className="text-[8px] tracking-widest font-bold text-slate-500 uppercase font-mono">Google Ground Citations:</span>
                                    {sentimentSources.map((source, rIdx) => (
                                      <a
                                        key={rIdx}
                                        href={source.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-[9px] font-mono text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1 bg-indigo-500/5 px-2.5 py-1 rounded-lg border border-indigo-400/10 hover:border-indigo-400/30"
                                      >
                                        <Search className="w-2.5 h-2.5 shrink-0" />
                                        <span className="max-w-[130px] truncate">{source.title}</span>
                                      </a>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {widgetId === "trends" && (
              <div className="space-y-3">
                {renderWidgetHeader("trends", "Momentum Shifts & Injury Telemetry")}
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-850/80 pb-3">
                      <div className="flex items-center gap-2.5">
                        <Flame className="w-5 h-5 text-amber-400" />
                        <h4 className="font-extrabold text-white text-sm">Momentum Shifts & Upset Alarms</h4>
                      </div>
                      <span className="text-[9px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">HIGH RESOLUTION</span>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex justify-between items-center">
                        <div>
                          <h5 className="font-extrabold text-white text-xs">Dallas Cowboys</h5>
                          <p className="text-[10px] text-slate-450 mt-1">Spread value moving from -3.5 to -6.5. High risk variables registered.</p>
                        </div>
                        <span className="text-rose-450 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded font-mono font-bold text-[9px]">High Risk</span>
                      </div>
                      <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex justify-between items-center">
                        <div>
                          <h5 className="font-extrabold text-white text-xs">Arsenal FC</h5>
                          <p className="text-[10px] text-slate-455 mt-1">Possession parameters projected at 68% against defensively crippled opponent.</p>
                        </div>
                        <span className="text-indigo-400 bg-indigo-500/10 border border-indigo-505/20 px-2 py-0.5 rounded font-mono font-bold text-[9px]">Optimal</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-850/80 pb-3">
                      <div className="flex items-center gap-2.5">
                        <ShieldAlert className="w-5 h-5 text-indigo-400" />
                        <h4 className="font-extrabold text-white text-sm">Real-time Player Injury Impacts</h4>
                      </div>
                      <span className="text-[9px] text-indigo-455 font-mono font-bold uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">Dynamic Metric</span>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] font-mono font-bold text-slate-300">
                          <span>Patrick Mahomes Backache Rest Index</span>
                          <span className="text-rose-400 font-bold">CRITICAL DECREASE (-14%)</span>
                        </div>
                        <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                          <div className="h-full bg-rose-550" style={{ width: "84%" }} />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] font-mono font-bold text-slate-300">
                          <span>LeBron James Recuperation Ratio</span>
                          <span className="text-indigo-400 font-bold">OPTIMAL RATING (+8%)</span>
                        </div>
                        <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500" style={{ width: "32%" }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Side-by-Side Quick Compare Modal */}
      {compareModalTeams && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-950 border border-white/10 rounded-[2.5rem] p-6 md:p-8 max-w-4xl w-full space-y-6 relative overflow-hidden shadow-2xl animate-fade-in my-8">
            <div className="absolute top-[-20%] left-[-20%] w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />
            
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-white/5 pb-5">
              <div>
                <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">
                  {compareModalTeams.sport} • Real-time Lab Compare
                </span>
                <h3 className="text-xl md:text-2xl font-black text-white mt-2 flex items-center gap-2">
                  <GitCompare className="w-5 h-5 text-indigo-400" />
                  Side-by-Side Comparison Laboratory
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Active Comparison Matrix: <strong className="text-slate-200">{compareModalTeams.teamA}</strong> vs <strong className="text-slate-200">{compareModalTeams.teamB}</strong>
                </p>
              </div>
              <button
                onClick={() => setCompareModalTeams(null)}
                className="text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 p-2.5 rounded-xl transition cursor-pointer"
                title="Close"
              >
                <XSquare className="w-5 h-5" />
              </button>
            </div>

            {/* Numerical Metrics Progress Bars side-by-side */}
            <div className="grid md:grid-cols-2 gap-8 pt-2">
              <div className="bg-slate-900/45 p-6 rounded-3xl border border-white/5 flex flex-col justify-between space-y-6">
                <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 border-b border-white/5 pb-2">
                  <BarChart2 className="w-3.5 h-3.5 text-indigo-400" />
                  Core Telemetry Comparison Indicators
                </h4>

                <div className="space-y-4">
                  {/* Metric 1 */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-slate-300 font-semibold font-mono font-sans">
                      <span>Offense Output Rating</span>
                      <span className="text-indigo-400">{offenseA} vs {offenseB}</span>
                    </div>
                    <div className="h-2 bg-slate-950 rounded-full flex overflow-hidden p-0.5 border border-white/5">
                      <div 
                        className="bg-indigo-450 h-full rounded-l transition-all duration-500" 
                        style={{ width: `${(offenseA / (offenseA + offenseB)) * 100}%` }}
                      />
                      <div 
                        className="bg-indigo-650 h-full rounded-r transition-all duration-500" 
                        style={{ width: `${(offenseB / (offenseA + offenseB)) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Metric 2 */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-slate-300 font-semibold font-mono font-sans">
                      <span>Defense Effectiveness Index</span>
                      <span className="text-indigo-400">{defenseA} vs {defenseB}</span>
                    </div>
                    <div className="h-2 bg-slate-950 rounded-full flex overflow-hidden p-0.5 border border-white/5">
                      <div 
                        className="bg-indigo-450 h-full rounded-l transition-all duration-500" 
                        style={{ width: `${(defenseA / (defenseA + defenseB)) * 105}%` }}
                      />
                      <div 
                        className="bg-indigo-650 h-full rounded-r transition-all duration-500" 
                        style={{ width: `${(defenseB / (defenseA + defenseB)) * 105}%` }}
                      />
                    </div>
                  </div>

                  {/* Metric 3 */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-slate-300 font-semibold font-mono font-sans">
                      <span>Form & Momentum Ratio</span>
                      <span className="text-indigo-400">{formA} vs {formB}</span>
                    </div>
                    <div className="h-2 bg-slate-950 rounded-full flex overflow-hidden p-0.5 border border-white/5">
                      <div 
                        className="bg-indigo-450 h-full rounded-l transition-all duration-500" 
                        style={{ width: `${(formA / (formA + formB)) * 100}%` }}
                      />
                      <div 
                        className="bg-indigo-650 h-full rounded-r transition-all duration-500" 
                        style={{ width: `${(formB / (formA + formB)) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Metric 4 */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-slate-300 font-semibold font-mono font-sans">
                      <span>Coaching Strategy Factor</span>
                      <span className="text-indigo-400">{coachA} vs {coachB}</span>
                    </div>
                    <div className="h-2 bg-slate-950 rounded-full flex overflow-hidden p-0.5 border border-white/5">
                      <div 
                        className="bg-indigo-450 h-full rounded-l transition-all duration-500" 
                        style={{ width: `${(coachA / (coachA + coachB)) * 100}%` }}
                      />
                      <div 
                        className="bg-indigo-650 h-full rounded-r transition-all duration-500" 
                        style={{ width: `${(coachB / (coachA + coachB)) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 text-[10px] uppercase tracking-wider font-bold text-slate-500 font-mono pt-3 border-t border-white/5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-indigo-450 block" />
                    <span>{compareModalTeams.teamA}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-indigo-650 block" />
                    <span>{compareModalTeams.teamB}</span>
                  </div>
                </div>
              </div>

              {/* Dynamic AI Verdict Panel */}
              <div className="bg-slate-900/45 p-6 rounded-3xl border border-white/5 flex flex-col justify-between space-y-6">
                <div className="space-y-3.5">
                  <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                    <BrainCircuit className="w-4 h-4 text-indigo-400 animate-pulse" />
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 font-mono">AI Comparison Verdict Output</span>
                  </div>
                  {isSimulating ? (
                    <div className="space-y-2 py-4 animate-pulse">
                      <div className="h-4 bg-slate-800 rounded w-full" />
                      <div className="h-4 bg-slate-800 rounded w-5/6" />
                      <div className="h-4 bg-slate-800 rounded w-2/3" />
                    </div>
                  ) : (
                    <p className="text-xs text-slate-300 leading-relaxed font-sans font-medium bg-black/40 p-4 rounded-2xl border border-white/5">
                      {getVerdictText()}
                    </p>
                  )}
                </div>

                <button 
                  onClick={recalculateCompareMetrics}
                  disabled={isSimulating}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-xl text-xs transition shadow-md uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSimulating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Re-compiling Parameters...</span>
                    </>
                  ) : (
                    <>
                      <span>Compile Modal Laboratory</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
