import React, { useState } from "react";
import { 
  Play, Upload, Download, RefreshCw, FileText, CheckCircle2, Lock, 
  BarChart2, HelpCircle, FileSpreadsheet, Trash2, ShieldAlert
} from "lucide-react";
import { Prediction } from "../types";

interface BulkSimulatorProps {
  userTier: "free" | "plus" | "pro" | "syndicate";
  onAddPredictionToVault: (pred: Prediction) => void;
  onGrantXp: (amount: number) => void;
  translations: any;
}

interface BulkMatchupRow {
  id: string;
  matchup: string;
  sport: string;
  status: "idle" | "running" | "ready" | "failed";
  progress: number;
  probA?: number;
  probB?: number;
  score?: string;
  upsetRisk?: number;
}

export default function BulkSimulator({ userTier, onAddPredictionToVault, onGrantXp, translations }: BulkSimulatorProps) {
  const [inputText, setInputText] = useState(
    `Miami Dolphins vs Buffalo Bills\nChicago Bears vs Green Bay Packers\nDallas Cowboys vs NY Giants`
  );
  const [rows, setRows] = useState<BulkMatchupRow[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [sportSelect, setSportSelect] = useState("NFL");

  const isPro = userTier === "pro" || userTier === "syndicate";

  const handleLoadSample = () => {
    setInputText(`Houston Texans vs Indianapolis Colts\nSeattle Seahawks vs San Francisco 49ers\nPhiladelphia Eagles vs Washington Commanders\nDenver Broncos vs Las Vegas Raiders`);
  };

  // Drag and drop for quick matchup lists
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          setInputText(text);
        }
      };
      reader.readAsText(file);
    }
  };

  const fileInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          setInputText(text);
        }
      };
      reader.readAsText(file);
    }
  };

  const triggerBulkSimulations = () => {
    if (!inputText.trim()) return;

    let parsedLines = inputText
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 0 && line.toLowerCase().includes("vs"));

    if (parsedLines.length === 0) {
      alert("Please enter matchups in 'Team A vs Team B' format, one per line.");
      return;
    }

    // Free/Plus tier caps
    const maxAllowed = isPro ? 100 : 3;
    if (parsedLines.length > maxAllowed) {
      parsedLines = parsedLines.slice(0, maxAllowed);
    }

    const initialRows: BulkMatchupRow[] = parsedLines.map((line, idx) => ({
      id: `${Date.now()}-${idx}`,
      matchup: line,
      sport: sportSelect,
      status: "idle",
      progress: 0
    }));

    setRows(initialRows);
    setIsProcessing(true);

    // Simulate parallel processing tickers
    initialRows.forEach((row, rIdx) => {
      let currentProgress = 0;
      const speed = Math.floor(Math.random() * 80) + 40; // varied velocity
      const interval = setInterval(() => {
        currentProgress += Math.floor(Math.random() * 15) + 5;
        if (currentProgress >= 100) {
          currentProgress = 100;
          clearInterval(interval);

          // Simulate Monte Carlo calculations
          const probA = Math.floor(Math.random() * 45) + 35; // 35% - 80%
          const probB = 100 - probA;
          const scoreA = Math.floor(Math.random() * 14) + 17;
          const scoreB = Math.floor(Math.random() * 14) + 14;
          const scoreStr = `${scoreA} - ${scoreB}`;
          const risk = Math.max(8, Math.round(95 - probA));

          setRows(prev => prev.map(pRow => {
            if (pRow.id === row.id) {
              const [teamA, teamB] = row.matchup.split(/vs\.?|contra/i).map(t => t.trim());
              
              // Automatically feed simulated items to the vault if supported
              const mockPred: Prediction = {
                id: `${row.id}-vault`,
                sport: row.sport,
                matchup: row.matchup,
                teamA: teamA || "Team Alpha",
                teamB: teamB || "Team Beta",
                probA,
                probB,
                score: scoreStr,
                edgeLevel: probA > 65 ? "High Confidence" : "Moderate Risk",
                edgeDesc: `Bulk physical model simulated with ${isPro ? "10,000" : "150"} Monte Carlo iterations. Optimal stamina routing detected.`,
                markdownAnalysis: `### Co-efficient Modeling\nSimulated in bulk concurrent batch. Projected success margins indicate optimal stability.`,
                findings: ["Parallel simulation index cleared standard deviations smoothly."],
                notes: "Bulk queued model execution. Environmental drafts zeroed out.",
                createdAt: new Date().toLocaleString()
              };

              // Safely notify app vault
              try {
                onAddPredictionToVault(mockPred);
              } catch (e) {
                console.warn(e);
              }

              return {
                ...pRow,
                status: "ready",
                progress: 100,
                probA,
                probB,
                score: scoreStr,
                upsetRisk: risk
              };
            }
            return pRow;
          }));

          // Finished checking
          if (rIdx === initialRows.length - 1) {
            setIsProcessing(false);
            onGrantXp(parsedLines.length * 75);
          }
        } else {
          setRows(prev => prev.map(pRow => {
            if (pRow.id === row.id) {
              return { ...pRow, status: "running", progress: currentProgress };
            }
            return pRow;
          }));
        }
      }, speed);
    });
  };

  const handleDownloadCSV = () => {
    if (rows.length === 0) return;
    let csvContent = "data:text/csv;charset=utf-8,Matchup,Sport,Winner Probability,Margin Forecast,Upset Risk (%)\n";
    rows.forEach(r => {
      const winnerProb = r.probA !== undefined ? `${r.probA}% / ${r.probB}%` : "Pending";
      csvContent += `"${r.matchup}","${r.sport}","${winnerProb}","${r.score || "Pending"}","${r.upsetRisk || 0}%"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ApexOdds_Bulk_Simulation_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-white/10 rounded-[2rem] p-6 md:p-8 space-y-6 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div>
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
              {translations.bulkUploadTitle}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {translations.bulkUploadDesc}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isPro ? (
              <span className="bg-emerald-500/15 text-emerald-400 text-[9px] font-bold px-3 py-1.5 rounded-full border border-emerald-500/25 uppercase font-mono">
                PRO ACTIVE — UNLIMITED CORE
              </span>
            ) : (
                <span className="bg-amber-500/10 text-amber-300 text-[9px] font-bold px-3 py-1.5 rounded-full border border-amber-500/20 uppercase font-mono flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-amber-400" />
                  FREE TRIAL (3 LIMIT)
                </span>
            )}
          </div>
        </div>

        {/* Form elements for bulk uploads */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-mono tracking-wider font-bold text-slate-400 block uppercase">
                {translations.pasteLabel}
              </label>
              
              <button
                onClick={handleLoadSample}
                className="text-[10px] text-indigo-400 hover:text-white transition font-bold"
              >
                ⚡ Load Elite Sample Pack
              </button>
            </div>

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full h-36 bg-slate-950/80 border border-white/10 rounded-2xl p-4 text-xs font-mono text-slate-200 outline-none focus:border-indigo-500 font-medium leading-relaxed resize-none"
              placeholder="E.g.:&#10;KC Chiefs vs SF 49ers&#10;MIA Dolphins vs BUF Bills"
            />
          </div>

          {/* Settings / Upload file zone */}
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-mono tracking-wider font-bold text-slate-400 block uppercase mb-1.5">
                Bulk Category Sport
              </label>
              <select
                value={sportSelect}
                onChange={(e) => setSportSelect(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs font-bold text-slate-305 text-slate-300 outline-none focus:border-indigo-400 cursor-pointer"
              >
                <option value="NFL">NFL Football</option>
                <option value="NBA">NBA Basketball</option>
                <option value="MLB">MLB Baseball</option>
                <option value="Soccer">Soccer / Football</option>
                <option value="NHL">NHL Ice Hockey</option>
              </select>
            </div>

            {/* Drag & Drop Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-5 text-center flex flex-col justify-center items-center h-[96px] cursor-pointer transition duration-200 select-none ${
                dragOver 
                  ? "border-emerald-500 bg-emerald-500/5 text-slate-205" 
                  : "border-white/5 bg-slate-950/40 hover:border-white/15"
              }`}
              onClick={() => document.getElementById("csvFilePicker")?.click()}
            >
              <Upload className="w-5 h-5 text-indigo-400 mb-1" />
              <p className="text-[10px] font-bold text-slate-300">Drag & Drop TXT/CSV</p>
              <p className="text-[8px] text-slate-500 mt-0.5">Or click to upload</p>
              <input
                id="csvFilePicker"
                type="file"
                accept=".csv,.txt"
                onChange={fileInputHandler}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Submit process */}
        <button
          onClick={triggerBulkSimulations}
          disabled={isProcessing || !inputText.trim()}
          className="w-full py-4 text-xs font-black uppercase tracking-widest text-white bg-indigo-600 hover:bg-indigo-550 rounded-2xl transition cursor-pointer shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
              <span>{translations.statusProcessing}</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white text-white" />
              <span>{translations.uploadBtnName}</span>
            </>
          )}
        </button>

        {!isPro && parsedLinesCount(inputText) > 3 && (
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-2 text-[10px] text-amber-200">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Only the first 3 matchups will be processed on the Free Trial. Upgrade your subscription to Pro for 100+ concurrent bulk queue simulations.</span>
          </div>
        )}
      </div>

      {/* Grid Results Spreadsheet Table */}
      {rows.length > 0 && (
        <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] p-6 space-y-4 text-left">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-indigo-400" />
              <h4 className="font-extrabold text-sm text-white">Quantum Telemetry Report Output</h4>
            </div>
            
            <button
              onClick={handleDownloadCSV}
              className="flex items-center gap-1.5 bg-slate-950 border border-white/10 hover:border-emerald-500 hover:text-emerald-400 text-[10px] font-bold px-3.5 py-1.5 rounded-xl cursor-pointer text-slate-300 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-[11px] font-sans">
              <thead>
                <tr className="border-b border-white/5 text-slate-500 text-[9px] uppercase tracking-wider text-left font-bold font-mono">
                  <th className="pb-3 text-left pl-2">Competitor Matchup</th>
                  <th className="pb-3 text-left">Category</th>
                  <th className="pb-3 text-left">Simulation State</th>
                  <th className="pb-3 text-center">Team A / B Win Odds</th>
                  <th className="pb-3 text-center">Projected Score</th>
                  <th className="pb-3 text-center">Upset Risk Index</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium">
                {rows.map((row) => (
                  <tr key={row.id} className="hover:bg-white/2">
                    <td className="py-3 text-left pl-2 font-bold text-white max-w-[200px] truncate">
                      {row.matchup}
                    </td>
                    <td className="py-3 text-left">
                      <span className="bg-slate-950 px-2 py-0.5 rounded text-[8px] font-mono border border-white/5 text-indigo-400 select-none uppercase">
                        {row.sport}
                      </span>
                    </td>
                    <td className="py-3 text-left">
                      {row.status === "running" ? (
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-1.5 bg-slate-950 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500" style={{ width: `${row.progress}%` }}></div>
                          </div>
                          <span className="text-[9px] font-mono text-indigo-400">{row.progress}%</span>
                        </div>
                      ) : row.status === "ready" ? (
                        <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Core Done
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-slate-500 font-bold">Queued</span>
                      )}
                    </td>
                    <td className="py-3 text-center font-mono">
                      {row.probA !== undefined ? (
                        <div className="flex justify-center items-center gap-1">
                          <span className="text-indigo-400 font-bold">{row.probA}%</span>
                          <span className="text-slate-600 text-[10px]">/</span>
                          <span className="text-slate-400 font-semibold">{row.probB}%</span>
                        </div>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>
                    <td className="py-3 text-center font-mono font-bold text-slate-300">
                      {row.score || <span className="text-slate-500 font-normal">—</span>}
                    </td>
                    <td className="py-3 text-center font-mono">
                      {row.upsetRisk !== undefined ? (
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          row.upsetRisk > 50 
                            ? "bg-rose-500/10 text-rose-450 text-rose-400" 
                            : row.upsetRisk > 25 
                            ? "bg-yellow-500/10 text-yellow-450 text-yellow-340" 
                            : "bg-emerald-500/10 text-emerald-450 text-emerald-400"
                        }`}>
                          {row.upsetRisk}% Risk
                        </span>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function parsedLinesCount(text: string): number {
  return text
    .split("\n")
    .map(line => line.trim())
    .filter(line => line.length > 0 && line.toLowerCase().includes("vs")).length;
}
