import React, { useState } from "react";
import { 
  Sparkles, BrainCircuit, RefreshCw, BarChart2, ShieldAlert, GitCompare, Lock, ShieldCheck, Grid, Layers, ExternalLink
} from "lucide-react";

interface ComparisonLabProps {
  userTier?: "free" | "plus" | "pro";
  onUpgrade?: () => void;
}

export default function ComparisonLab({ userTier = "free", onUpgrade }: ComparisonLabProps) {
  const [mode, setMode] = useState<"dual" | "tri">("dual");
  const [teamA, setTeamA] = useState("Chiefs");
  const [teamB, setTeamB] = useState("Bills");
  const [teamC, setTeamC] = useState("Celtics");

  // Core metrics for Team A
  const [offenseA, setOffenseA] = useState(87);
  const [defenseA, setDefenseA] = useState(91);
  const [formA, setFormA] = useState(88);
  const [coachA, setCoachA] = useState(85);

  // Core metrics for Team B
  const [offenseB, setOffenseB] = useState(81);
  const [defenseB, setDefenseB] = useState(84);
  const [formB, setFormB] = useState(90);
  const [coachB, setCoachB] = useState(78);

  // Core metrics for Team C
  const [offenseC, setOffenseC] = useState(89);
  const [defenseC, setDefenseC] = useState(82);
  const [formC, setFormC] = useState(85);
  const [coachC, setCoachC] = useState(83);

  const [isLoading, setIsLoading] = useState(false);

  const recalculateLabMetrics = () => {
    setIsLoading(true);
    setTimeout(() => {
      // Create interesting randomized parameters
      setOffenseA(Math.floor(Math.random() * 20) + 76);
      setOffenseB(Math.floor(Math.random() * 20) + 76);
      setOffenseC(Math.floor(Math.random() * 20) + 76);

      setDefenseA(Math.floor(Math.random() * 20) + 76);
      setDefenseB(Math.floor(Math.random() * 20) + 76);
      setDefenseC(Math.floor(Math.random() * 20) + 76);

      setFormA(Math.floor(Math.random() * 20) + 76);
      setFormB(Math.floor(Math.random() * 20) + 76);
      setFormC(Math.floor(Math.random() * 20) + 76);

      setCoachA(Math.floor(Math.random() * 20) + 76);
      setCoachB(Math.floor(Math.random() * 20) + 76);
      setCoachC(Math.floor(Math.random() * 20) + 76);

      setIsLoading(false);
    }, 600);
  };

  const getVerdictText = () => {
    const powerA = (offenseA + defenseA + formA + coachA) / 4;
    const powerB = (offenseB + defenseB + formB + coachB) / 4;
    
    if (powerA > powerB) {
      return `Neural comparison filters strongly favor ${teamA} (Model delta: +${(powerA - powerB).toFixed(1)}%). High defensive indices paired with tactical rest cycles yield a secure home field probability advantage over ${teamB}.`;
    } else {
      return `Comparative telemetry favors ${teamB} (Model delta: +${(powerB - powerA).toFixed(1)}%). Outstanding offensive output parameters and peak form values suggest potential underdog variance against ${teamA}.`;
    }
  };

  const getTriVerdictText = () => {
    const powerA = (offenseA + defenseA + formA + coachA) / 4;
    const powerB = (offenseB + defenseB + formB + coachB) / 4;
    const powerC = (offenseC + defenseC + formC + coachC) / 4;

    const maxPower = Math.max(powerA, powerB, powerC);
    let winningTeam = teamA;
    if (maxPower === powerB) winningTeam = teamB;
    if (maxPower === powerC) winningTeam = teamC;

    return `Tri-Team heatmap compilation confirms ${winningTeam} holds the primary statistical edge with an aggregate rating of ${maxPower.toFixed(1)}%. ${teamA} [${powerA.toFixed(1)}%], ${teamB} [${powerB.toFixed(1)}%], and ${teamC} [${powerC.toFixed(1)}%] showcase significant cross-metric variances. Under present parameters, defensive structure is the critical swing factor.`;
  };

  // Helper to color heatmap cells based on intensity (70 to 100)
  const getHeatmapColor = (value: number) => {
    const normalized = Math.min(100, Math.max(70, value));
    const intensity = (normalized - 70) / 30; // 0 to 1
    return {
      bg: `rgba(99, 102, 241, ${0.05 + intensity * 0.25})`,
      border: `rgba(99, 102, 241, ${0.1 + intensity * 0.3})`,
      text: intensity > 0.6 ? "text-indigo-300 font-extrabold" : "text-slate-300 font-semibold"
    };
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 select-none relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header with Mode Selector Tab */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-indigo-400" />
            Comparison Laboratory Suite
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Perform real-time multi-variable telemetry matchups and cross-metric assessments.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="bg-slate-950 p-1 rounded-xl border border-white/5 flex">
          <button
            onClick={() => setMode("dual")}
            className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition ${
              mode === "dual"
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Dual Matchup
          </button>
          <button
            onClick={() => setMode("tri")}
            className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition flex items-center gap-1 ${
              mode === "tri"
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>Tri-Team (Pro)</span>
            <span className="bg-indigo-500/20 text-[8px] px-1.5 py-0.5 rounded-full border border-indigo-400/20 text-indigo-300 font-mono">PLUS</span>
          </button>
        </div>
      </div>

      {mode === "dual" ? (
        /* DUAL VIEW */
        <div className="space-y-6">
          {/* Select matrix rows */}
          <div className="grid md:grid-cols-5 gap-4 items-center pt-2">
            <div className="md:col-span-2 space-y-1.5">
              <label className="block text-[10px] uppercase font-bold text-slate-500 font-mono tracking-wider">Franchise (Team A)</label>
              <select 
                value={teamA}
                onChange={(e) => setTeamA(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 hover:border-indigo-500/30 p-4 rounded-2xl outline-none focus:border-indigo-550 text-sm font-semibold cursor-pointer text-slate-200"
              >
                <option value="Chiefs" className="bg-slate-955 text-slate-100">🏈 KC Chiefs</option>
                <option value="Bills" className="bg-slate-955 text-slate-100">🏈 BUF Bills</option>
                <option value="Celtics" className="bg-slate-955 text-slate-100">🏀 BOS Celtics</option>
                <option value="Knicks" className="bg-slate-955 text-slate-100">🏀 NY Knicks</option>
                <option value="Ravens" className="bg-slate-955 text-slate-100">🏈 BAL Ravens</option>
                <option value="Eagles" className="bg-slate-955 text-slate-100">🏈 PHI Eagles</option>
              </select>
            </div>

            <div className="flex justify-center text-indigo-400 font-extrabold font-mono text-lg py-2 md:py-0">
              VS
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <label className="block text-[10px] uppercase font-bold text-slate-500 font-mono tracking-wider">Comparison (Team B)</label>
              <select 
                value={teamB}
                onChange={(e) => setTeamB(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 hover:border-indigo-500/30 p-4 rounded-2xl outline-none focus:border-indigo-550 text-sm font-semibold cursor-pointer text-slate-200"
              >
                <option value="Bills" className="bg-slate-955 text-slate-100">🏈 BUF Bills</option>
                <option value="Chiefs" className="bg-slate-955 text-slate-100">🏈 KC Chiefs</option>
                <option value="Knicks" className="bg-slate-955 text-slate-100">🏀 NY Knicks</option>
                <option value="Celtics" className="bg-slate-955 text-slate-100">🏀 BOS Celtics</option>
                <option value="Ravens" className="bg-slate-955 text-slate-100">🏈 BAL Ravens</option>
                <option value="Eagles" className="bg-slate-955 text-slate-100">🏈 PHI Eagles</option>
              </select>
            </div>
          </div>

          {/* Numerical Metrics and progress bars comparison */}
          <div className="grid md:grid-cols-2 gap-8 pt-6 border-t border-slate-850/80">
            
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-850/80 flex flex-col justify-between">
              <h4 className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold mb-4 flex items-center gap-1.5">
                <BarChart2 className="w-3.5 h-3.5 text-indigo-400" />
                Core Analytics Telemetry
              </h4>

              <div className="space-y-4">
                {/* Metric 1 */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-300 font-semibold font-mono">
                    <span>Offense Output Rating</span>
                    <span className="text-indigo-400">{offenseA} vs {offenseB}</span>
                  </div>
                  <div className="h-2 bg-slate-900 rounded-full flex overflow-hidden">
                    <div 
                      className="bg-indigo-400 h-full rounded-l transition-all duration-500" 
                      style={{ width: `${(offenseA / (offenseA + offenseB || 1)) * 100}%` }}
                    />
                    <div 
                      className="bg-indigo-650 h-full rounded-r transition-all duration-500" 
                      style={{ width: `${(offenseB / (offenseA + offenseB || 1)) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-300 font-semibold font-mono">
                    <span>Defense Effectiveness Index</span>
                    <span className="text-indigo-400">{defenseA} vs {defenseB}</span>
                  </div>
                  <div className="h-2 bg-slate-900 rounded-full flex overflow-hidden">
                    <div 
                      className="bg-indigo-400 h-full rounded-l transition-all duration-500" 
                      style={{ width: `${(defenseA / (defenseA + defenseB || 1)) * 100}%` }}
                    />
                    <div 
                      className="bg-indigo-650 h-full rounded-r transition-all duration-500" 
                      style={{ width: `${(defenseB / (defenseA + defenseB || 1)) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-300 font-semibold font-mono">
                    <span>Form & Momentum Ratio</span>
                    <span className="text-indigo-400">{formA} vs {formB}</span>
                  </div>
                  <div className="h-2 bg-slate-900 rounded-full flex overflow-hidden">
                    <div 
                      className="bg-indigo-400 h-full rounded-l transition-all duration-500" 
                      style={{ width: `${(formA / (formA + formB || 1)) * 100}%` }}
                    />
                    <div 
                      className="bg-indigo-650 h-full rounded-r transition-all duration-500" 
                      style={{ width: `${(formB / (formA + formB || 1)) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Metric 4 */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-300 font-semibold font-mono">
                    <span>Coaching Strategy Factor</span>
                    <span className="text-indigo-400">{coachA} vs {coachB}</span>
                  </div>
                  <div className="h-2 bg-slate-900 rounded-full flex overflow-hidden">
                    <div 
                      className="bg-indigo-400 h-full rounded-l transition-all duration-500" 
                      style={{ width: `${(coachA / (coachA + coachB || 1)) * 100}%` }}
                    />
                    <div 
                      className="bg-indigo-650 h-full rounded-r transition-all duration-500" 
                      style={{ width: `${(coachB / (coachA + coachB || 1)) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Color Guides footer */}
              <div className="flex gap-4 text-[10px] uppercase tracking-wider font-bold text-slate-500 font-mono mt-6 pt-3 border-t border-slate-850/80">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-indigo-400 block" />
                  <span>{teamA}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-indigo-650 block" />
                  <span>{teamB}</span>
                </div>
              </div>
            </div>

            {/* Competitive verdict panel */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-850/80 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="w-5 h-5 text-indigo-400 animate-pulse" />
                  <span className="text-[10px] uppercase font-bold tracking-widest text-white">AI Compare Output Verdict</span>
                </div>
                {isLoading ? (
                  <div className="space-y-2 py-4 animate-pulse">
                    <div className="h-4 bg-slate-800 rounded w-full" />
                    <div className="h-4 bg-slate-800 rounded w-5/6" />
                    <div className="h-4 bg-slate-800 rounded w-2/3" />
                  </div>
                ) : (
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {getVerdictText()}
                  </p>
                )}
              </div>

              <button 
                onClick={recalculateLabMetrics}
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-xl text-xs transition shadow-md uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Simulating Parameters...</span>
                  </>
                ) : (
                  <>
                    <span>Compile Visual Laboratory</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* TRI-TEAM BENCHMARK SUITE */
        <div className="space-y-6">
          {userTier === "free" ? (
            /* LOCKED STATE */
            <div className="bg-slate-950 rounded-3xl p-8 border border-indigo-500/10 text-center flex flex-col items-center justify-center space-y-5 animate-fade-in py-12">
              <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-505/20 text-indigo-400 animate-pulse">
                <Lock className="w-6 h-6" />
              </div>
              <div className="space-y-2 max-w-sm">
                <h4 className="text-white text-base font-black uppercase">Unlock Tri-Team Heatmap Mode</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Benchmarking three franchises simultaneously using cross-metric heatmaps is restricted to premium Plus and Pro analysts.
                </p>
              </div>
              <button
                onClick={onUpgrade}
                className="bg-indigo-600 hover:bg-indigo-550 text-white font-heavy text-xs px-6 py-3 rounded-xl transition cursor-pointer uppercase tracking-wider flex items-center gap-2 shadow-lg"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Upgrade Membership Now</span>
              </button>
            </div>
          ) : (
            /* DYNAMIC TRI-TEAM VIEW */
            <div className="space-y-6 animate-fade-in text-slate-300">
              
              {/* Selector Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <span className="block text-[10px] uppercase font-bold text-slate-500 font-mono tracking-wider">Benchmark Team A</span>
                  <select 
                    value={teamA}
                    onChange={(e) => setTeamA(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 hover:border-indigo-500/30 p-4 rounded-2xl outline-none focus:border-indigo-550 text-xs font-semibold cursor-pointer text-slate-200"
                  >
                    <option value="Chiefs">🏈 KC Chiefs</option>
                    <option value="Bills">🏈 BUF Bills</option>
                    <option value="Celtics">🏀 BOS Celtics</option>
                    <option value="Knicks">🏀 NY Knicks</option>
                    <option value="Ravens">🏈 BAL Ravens</option>
                    <option value="Eagles">🏈 PHI Eagles</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <span className="block text-[10px] uppercase font-bold text-slate-500 font-mono tracking-wider">Benchmark Team B</span>
                  <select 
                    value={teamB}
                    onChange={(e) => setTeamB(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 hover:border-indigo-500/30 p-4 rounded-2xl outline-none focus:border-indigo-550 text-xs font-semibold cursor-pointer text-slate-200"
                  >
                    <option value="Bills">🏈 BUF Bills</option>
                    <option value="Chiefs">🏈 KC Chiefs</option>
                    <option value="Celtics">🏀 BOS Celtics</option>
                    <option value="Knicks">🏀 NY Knicks</option>
                    <option value="Ravens">🏈 BAL Ravens</option>
                    <option value="Eagles">🏈 PHI Eagles</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <span className="block text-[10px] uppercase font-bold text-slate-500 font-mono tracking-wider">Benchmark Team C</span>
                  <select 
                    value={teamC}
                    onChange={(e) => setTeamC(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 hover:border-indigo-500/30 p-4 rounded-2xl outline-none focus:border-indigo-550 text-xs font-semibold cursor-pointer text-slate-200"
                  >
                    <option value="Celtics">🏀 BOS Celtics</option>
                    <option value="Chiefs">🏈 KC Chiefs</option>
                    <option value="Bills">🏈 BUF Bills</option>
                    <option value="Knicks">🏀 NY Knicks</option>
                    <option value="Ravens">🏈 BAL Ravens</option>
                    <option value="Eagles">🏈 PHI Eagles</option>
                  </select>
                </div>
              </div>

              {/* Cross-Metric Heatmap table */}
              <div className="bg-slate-950 rounded-2xl border border-slate-850/80 p-5 space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <h4 className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                    Cross-Metric Heatmap Matrix Index
                  </h4>
                  <span className="text-[8px] font-bold font-mono text-indigo-300 bg-indigo-500/10 px-20 py-0.5 rounded-full border border-indigo-400/20 uppercase tracking-widest">
                    Real-time Spectral Weights
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans">
                    <thead>
                      <tr className="border-b border-white/5">
                        <th className="py-2.5 text-slate-400 uppercase font-mono text-[9px] tracking-wider w-1/4">Core Metric Index</th>
                        <th className="py-2.5 text-indigo-400 font-extrabold text-center text-[10px] tracking-wider">{teamA}</th>
                        <th className="py-2.5 text-indigo-400 font-extrabold text-center text-[10px] tracking-wider">{teamB}</th>
                        <th className="py-2.5 text-indigo-305 font-extrabold text-center text-[10px] tracking-wider">{teamC}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-medium">
                      {/* Row 1 */}
                      {(() => {
                        const hA = getHeatmapColor(offenseA);
                        const hB = getHeatmapColor(offenseB);
                        const hC = getHeatmapColor(offenseC);
                        return (
                          <tr>
                            <td className="py-3 text-slate-300 font-semibold font-sans">Offense Output Rating</td>
                            <td className="py-3 text-center transition-all duration-300" style={{ backgroundColor: hA.bg, border: `1px solid ${hA.border}` }}>
                              <span className={hA.text}>{offenseA}%</span>
                            </td>
                            <td className="py-3 text-center transition-all duration-300" style={{ backgroundColor: hB.bg, border: `1px solid ${hB.border}` }}>
                              <span className={hB.text}>{offenseB}%</span>
                            </td>
                            <td className="py-3 text-center transition-all duration-300" style={{ backgroundColor: hC.bg, border: `1px solid ${hC.border}` }}>
                              <span className={hC.text}>{offenseC}%</span>
                            </td>
                          </tr>
                        );
                      })()}

                      {/* Row 2 */}
                      {(() => {
                        const hA = getHeatmapColor(defenseA);
                        const hB = getHeatmapColor(defenseB);
                        const hC = getHeatmapColor(defenseC);
                        return (
                          <tr>
                            <td className="py-3 text-slate-300 font-semibold font-sans">Defense Effectiveness Index</td>
                            <td className="py-3 text-center transition-all duration-300" style={{ backgroundColor: hA.bg, border: `1px solid ${hA.border}` }}>
                              <span className={hA.text}>{defenseA}%</span>
                            </td>
                            <td className="py-3 text-center transition-all duration-300" style={{ backgroundColor: hB.bg, border: `1px solid ${hB.border}` }}>
                              <span className={hB.text}>{defenseB}%</span>
                            </td>
                            <td className="py-3 text-center transition-all duration-300" style={{ backgroundColor: hC.bg, border: `1px solid ${hC.border}` }}>
                              <span className={hC.text}>{defenseC}%</span>
                            </td>
                          </tr>
                        );
                      })()}

                      {/* Row 3 */}
                      {(() => {
                        const hA = getHeatmapColor(formA);
                        const hB = getHeatmapColor(formB);
                        const hC = getHeatmapColor(formC);
                        return (
                          <tr>
                            <td className="py-3 text-slate-300 font-semibold font-sans">Form & Momentum Ratio</td>
                            <td className="py-3 text-center transition-all duration-300" style={{ backgroundColor: hA.bg, border: `1px solid ${hA.border}` }}>
                              <span className={hA.text}>{formA}%</span>
                            </td>
                            <td className="py-3 text-center transition-all duration-300" style={{ backgroundColor: hB.bg, border: `1px solid ${hB.border}` }}>
                              <span className={hB.text}>{formB}%</span>
                            </td>
                            <td className="py-3 text-center transition-all duration-300" style={{ backgroundColor: hC.bg, border: `1px solid ${hC.border}` }}>
                              <span className={hC.text}>{formC}%</span>
                            </td>
                          </tr>
                        );
                      })()}

                      {/* Row 4 */}
                      {(() => {
                        const hA = getHeatmapColor(coachA);
                        const hB = getHeatmapColor(coachB);
                        const hC = getHeatmapColor(coachC);
                        return (
                          <tr>
                            <td className="py-3 text-slate-300 font-semibold font-sans">Coaching Strategy Factor</td>
                            <td className="py-3 text-center transition-all duration-300" style={{ backgroundColor: hA.bg, border: `1px solid ${hA.border}` }}>
                              <span className={hA.text}>{coachA}%</span>
                            </td>
                            <td className="py-3 text-center transition-all duration-300" style={{ backgroundColor: hB.bg, border: `1px solid ${hB.border}` }}>
                              <span className={hB.text}>{coachB}%</span>
                            </td>
                            <td className="py-3 text-center transition-all duration-300" style={{ backgroundColor: hC.bg, border: `1px solid ${hC.border}` }}>
                              <span className={hC.text}>{coachC}%</span>
                            </td>
                          </tr>
                        );
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Competitive tripartite verdict panel */}
              <div className="grid md:grid-cols-3 gap-6 items-stretch">
                <div className="md:col-span-2 bg-slate-950 border border-slate-850/80 p-5 rounded-2xl flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[9px] font-mono text-indigo-400 block tracking-widest uppercase font-bold">Simulated Comparative Verdict Output</span>
                    {isLoading ? (
                      <div className="space-y-2.5 py-2 animate-pulse">
                        <div className="h-3.5 bg-slate-900 rounded w-full" />
                        <div className="h-3.5 bg-slate-900 rounded w-4/5" />
                        <div className="h-3.5 bg-slate-900 rounded w-2/3" />
                      </div>
                    ) : (
                      <p className="text-xs text-slate-300 leading-relaxed font-sans font-medium">
                        {getTriVerdictText()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-850/80 p-5 rounded-2xl flex flex-col justify-center">
                  <button 
                    onClick={recalculateLabMetrics}
                    disabled={isLoading}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-xl text-xs transition shadow-md uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Simulating Matrix...</span>
                      </>
                    ) : (
                      <>
                        <span>Compile Tri-Team Lab</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>
          )}
        </div>
      )}
    </div>
  );
}
