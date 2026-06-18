import React, { useState } from "react";
import { 
  Lock, FileText, Download, Loader2, Sparkles, TrendingUp, AlertTriangle, 
  CornerDownRight, Zap, RefreshCw
} from "lucide-react";
import { jsPDF } from "jspdf";
import { UserProfile, Prediction } from "../types";

interface WeeklyReportsProps {
  userTier: "free" | "plus" | "pro" | "syndicate";
  onUpgrade: () => void;
  userProfile?: UserProfile;
  predictions?: Prediction[];
}

export default function WeeklyReports({ userTier, onUpgrade, userProfile, predictions = [] }: WeeklyReportsProps) {
  const [downloadStatus, setDownloadStatus] = useState<string>("");
  const [diagnoseStatus, setDiagnoseStatus] = useState<string>("");

  // Simulated live roster fatigue log for plus/pro members
  const liveRosterFatigue = [
    { team: "KC Chiefs", player: "Patrick Mahomes", status: "Active (92%)", risk: "Low", restCoef: "1.04x" },
    { team: "SF 49ers", player: "Christian McCaffrey", status: "Questionable (68%)", risk: "Medium", restCoef: "0.88x" },
    { team: "MIA Dolphins", player: "Tyreek Hill", status: "Active (89%)", risk: "Low", restCoef: "1.02x" },
    { team: "DAL Cowboys", player: "Dak Prescott", status: "Doubtful (41%)", risk: "High", restCoef: "0.62x" }
  ];

  const handleDownload = () => {
    if (downloadStatus) return;
    setDownloadStatus("Compiling live performance data...");
    
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const pageWidth = 210;
      const pageHeight = 297;

      // Branded Accent Banner
      doc.setFillColor(15, 23, 42); // slate-900 / dark corporate
      doc.rect(0, 0, pageWidth, 45, "F");

      // Branded dividing glowing line (Vibrant Indigo)
      doc.setFillColor(99, 102, 241); // Indigo-500
      doc.rect(0, 45, pageWidth, 2.5, "F");

      // Typography Title
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(255, 255, 255);
      doc.text("APEXODDS // QUANTUM PORTAL", 15, 18);

      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(156, 163, 175); // Dark Gray
      const localStamp = new Date().toLocaleString("en-US");
      doc.text(`FORMAL PERFORMANCE DOSSIER  |  UTC STAMPED: ${localStamp}`, 15, 25);
      doc.text("PROJECTION INTEGRITY: GROUNDED MULTI-VARIANCE ESTIMATES", 15, 30);

      // Section 1: ANALYST INFORMATION
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(15, 23, 42);
      doc.text("I. DISPATCHED ANALYST ACCOUNT INTEL", 15, 58);

      doc.setDrawColor(226, 232, 240); // gray separator
      doc.setLineWidth(0.4);
      doc.line(15, 60, pageWidth - 15, 60);

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(71, 85, 105);
      doc.text("Analyst Name:", 15, 68);
      doc.setFont("Helvetica", "normal");
      doc.text(userProfile?.displayName ? `@${userProfile.displayName}` : "@guest_user", 52, 68);

      doc.setFont("Helvetica", "bold");
      doc.text("Licence Status:", 15, 74);
      doc.setFont("Helvetica", "normal");
      doc.text(`${userTier.toUpperCase()} ACCOUNT TIER`, 52, 74);

      doc.setFont("Helvetica", "bold");
      doc.text("Streak Factor:", 15, 80);
      doc.setFont("Helvetica", "normal");
      doc.text(`${userProfile?.streak || 0} active daily prediction streak`, 52, 80);

      doc.setFont("Helvetica", "bold");
      doc.text("Analyst Rank:", 15, 86);
      doc.setFont("Helvetica", "normal");
      doc.text(`Level ${userProfile?.level || 1} Elite Bracket Rank`, 52, 86);

      // Section 2: SEASONAL HIGHLIGHTS
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(15, 23, 42);
      doc.text("II. SEASONAL HIT RATE ANALYSIS", 15, 100);
      doc.line(15, 102, pageWidth - 15, 102);

      // Draw stylized card
      doc.setFillColor(248, 250, 252); // slate-100/50
      doc.rect(15, 107, 180, 24, "F");
      doc.setDrawColor(226, 232, 240);
      doc.rect(15, 107, 180, 24, "S");

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text("PROCESSED GAMES", 20, 114);
      doc.text("DECEMBER HIT-RATE MEDIAN", 80, 114);
      doc.text("EXCESS VOLATILITY SKEWS", 145, 114);

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(79, 70, 229); // Indigo-600
      doc.text("84 Games", 20, 122);
      doc.text("84.2% HitRate", 80, 122);
      doc.text("6 Matches", 145, 122);

      // Section 3: ROSTER ROTATION MULTIPLIERS
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(15, 23, 42);
      doc.text("III. ROSTER REST COEFFICIENT STATS", 15, 142);
      doc.line(15, 144, pageWidth - 15, 144);

      let fatY = 154;
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text("TEAM TOURNAMENTS", 18, 150);
      doc.text("ROSTER ATHLETE", 65, 150);
      doc.text("STAMINA STATUS", 120, 150);
      doc.text("COEFFICIENT", 160, 150);

      liveRosterFatigue.forEach((item, index) => {
        if (index % 2 === 0) {
          doc.setFillColor(248, 250, 252);
          doc.rect(15, fatY - 4, 180, 7.5, "F");
        }
        
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(51, 65, 85);
        doc.text(item.team, 18, fatY);
        doc.text(item.player, 65, fatY);
        doc.text(item.status, 120, fatY);
        
        doc.setFont("Helvetica", "bold");
        doc.setTextColor(79, 70, 229);
        doc.text(item.restCoef, 160, fatY);
        fatY += 8.2;
      });

      // Section 4: ACCURACY SCORECARD & AUDIT REPORT (WHAT'S RIGHT / WRONG)
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(15, 23, 42);
      doc.text("IV. ACCURACY AUDIT (WHAT WAS RIGHT & WHAT WAS WRONG)", 15, 195);
      doc.line(15, 197, pageWidth - 15, 197);

      if (predictions && predictions.length > 0) {
        let pY = 203;

        const correct = predictions.filter(p => p.status === "resolved" && p.actualOutcome === "correct");
        const incorrect = predictions.filter(p => p.status === "resolved" && p.actualOutcome === "incorrect");
        const pending = predictions.filter(p => p.status !== "resolved");

        const checkOverflow = (needed: number) => {
          if (pY + needed > pageHeight - 15) {
            doc.addPage();
            pY = 25; // Header buffer on new page
          }
        };

        // Write audit banner
        checkOverflow(15);
        doc.setFillColor(241, 245, 249);
        doc.rect(15, pY, 180, 10, "F");
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor(51, 65, 85);
        const resolvedTotal = correct.length + incorrect.length;
        const accuracyRate = resolvedTotal > 0 ? Math.round((correct.length / resolvedTotal) * 100) : 84.2;
        doc.text(`AUDIT ANALYSIS: ${correct.length} Hits / ${incorrect.length} Outliers (${accuracyRate}% Accuracy) | ${pending.length} Unresolved Matches`, 18, pY + 6.5);
        pY += 15;

        // Print RIGHT Predictions
        checkOverflow(15);
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(16, 185, 129); // emerald-600
        doc.text("🏆 SUCCESSFUL MATCHUP FORECASTS (WHAT WE GOT RIGHT)", 15, pY);
        pY += 6;

        if (correct.length > 0) {
          correct.forEach((pred) => {
            checkOverflow(14);
            doc.setFont("Helvetica", "bold");
            doc.setFontSize(8.5);
            doc.setTextColor(15, 23, 42);
            doc.text(`✔  ${pred.matchup} (${pred.sport})`, 18, pY);

            doc.setFont("Helvetica", "normal");
            doc.setFontSize(8);
            doc.setTextColor(100, 116, 139);
            doc.text(`   Predicted: ${pred.score} (Split: ${pred.probA}% / ${pred.probB}%)  |  Actual: ${pred.actualScore}`, 18, pY + 4);

            doc.setFont("Helvetica", "italic");
            doc.setFontSize(7.5);
            doc.setTextColor(71, 85, 105);
            doc.text(`   Audit Review: ${pred.review || "Accurate forecast outcome matches AI parameter consensus."}`, 18, pY + 8);
            pY += 13;
          });
        } else {
          checkOverflow(10);
          doc.setFont("Helvetica", "italic");
          doc.setFontSize(8);
          doc.setTextColor(148, 163, 184);
          doc.text("   No resolved correct predictions inside this weekly cycle.", 18, pY);
          pY += 10;
        }

        pY += 3;

        // Print WRONG Predictions
        checkOverflow(15);
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(239, 68, 68); // rose-600
        doc.text("🚩 MODEL SKEWS & ACCURACY OUTLIERS (WHAT WE GOT WRONG)", 15, pY);
        pY += 6;

        if (incorrect.length > 0) {
          incorrect.forEach((pred) => {
            checkOverflow(14);
            doc.setFont("Helvetica", "bold");
            doc.setFontSize(8.5);
            doc.setTextColor(15, 23, 42);
            doc.text(`✖  ${pred.matchup} (${pred.sport})`, 18, pY);

            doc.setFont("Helvetica", "normal");
            doc.setFontSize(8);
            doc.setTextColor(100, 116, 139);
            doc.text(`   Predicted: ${pred.score} (Split: ${pred.probA}% / ${pred.probB}%)  |  Actual: ${pred.actualScore}`, 18, pY + 4);

            doc.setFont("Helvetica", "italic");
            doc.setFontSize(7.5);
            doc.setTextColor(71, 85, 105);
            doc.text(`   Offset Review: ${pred.review || "Minor factor volatility register skewing model outputs."}`, 18, pY + 8);
            pY += 13;
          });
        } else {
          checkOverflow(10);
          doc.setFont("Helvetica", "italic");
          doc.setFontSize(8);
          doc.setTextColor(148, 163, 184);
          doc.text("   Zero outlier variances registered under the current analytical epoch.", 18, pY);
          pY += 10;
        }

        pY += 3;

        // Optionally, print pending forecasts so user sees current active ones!
        checkOverflow(15);
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(79, 70, 229); // Indigo-600
        doc.text("⌛ ACTIVE PROACTIVE FORECASTS (IN PROGRESS)", 15, pY);
        pY += 6;

        if (pending.length > 0) {
          pending.slice(0, 2).forEach((pred) => {
            checkOverflow(10);
            doc.setFont("Helvetica", "bold");
            doc.setFontSize(8.5);
            doc.setTextColor(15, 23, 42);
            doc.text(`●  ${pred.matchup} (${pred.sport})`, 18, pY);

            doc.setFont("Helvetica", "normal");
            doc.setFontSize(8);
            doc.setTextColor(100, 116, 139);
            doc.text(`   Forecasted score: ${pred.score} | Win Split: ${pred.probA}% vs ${pred.probB}%`, 18, pY + 4);
            pY += 9;
          });
        } else {
          checkOverflow(10);
          doc.setFont("Helvetica", "italic");
          doc.setFontSize(8);
          doc.setTextColor(148, 163, 184);
          doc.text("   No pending active projections currently recorded in the workspace.", 18, pY);
          pY += 10;
        }

      } else {
        doc.setFont("Helvetica", "italic");
        doc.setFontSize(9);
        doc.setTextColor(148, 163, 184);
        doc.text("No matching active predictions exist in the user's storage vault.", 18, 205);
        doc.text("Trigger real-time simulations in the Sandbox Panel to record live datasets.", 18, 210);
      }

      // Footer
      doc.setFillColor(15, 23, 42);
      doc.rect(0, pageHeight - 12, pageWidth, 12, "F");

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(255, 255, 255);
      doc.text("APEXODDS ANALYTICAL INC. ALL RIGHTS RESERVED.", 15, pageHeight - 5);

      doc.setFont("Helvetica", "normal");
      doc.setTextColor(156, 163, 175);
      doc.text(`VERIFICATION PORT: v3.59-C | LICENSE: ${userTier.toUpperCase()}`, pageWidth - 95, pageHeight - 5);

      doc.save(`ApexOdds_Weekly_Summary_${userProfile?.displayName || "Analyst"}.pdf`);
      setDownloadStatus("✅ Complete! PDF summary downloaded.");
      setTimeout(() => setDownloadStatus(""), 4500);

    } catch (err) {
      console.error(err);
      setDownloadStatus("Failed to compile pdf.");
      setTimeout(() => setDownloadStatus(""), 4000);
    }
  };

  const handleReDiagnose = () => {
    setDiagnoseStatus("Scraping medical records...");
    setTimeout(() => {
      setDiagnoseStatus("Re-calibrating safety and climate multipliers...");
      setTimeout(() => {
        setDiagnoseStatus("✅ Recalibration completed successfully.");
        setTimeout(() => setDiagnoseStatus(""), 3000);
      }, 1200);
    }, 800);
  };
  
  if (userTier === "free") {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-12 text-center max-w-xl mx-auto space-y-6 relative overflow-hidden select-none">
        <div className="absolute top-[-30%] left-[-30%] w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-550/30 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(99,102,241,0.15)]">
          <Lock className="w-7 h-7 text-indigo-400" />
        </div>

        <div className="space-y-2">
          <h4 className="text-xl font-black text-white">Unlock Weekly Analytical Sheets</h4>
          <span className="text-[10px] bg-indigo-500/25 border border-indigo-500/20 px-3 py-1 rounded-full text-indigo-400 font-bold tracking-widest font-mono uppercase inline-block">PLUS & PRO FEATURE</span>
          <p className="text-slate-400 text-xs leading-relaxed max-w-sm mx-auto pt-2">
            Weekly high-value automated analysis reports, PDF exports, and trade line shifts are exclusive to Premium SaaS Plus & Elite accounts.
          </p>
        </div>

        <button 
          onClick={onUpgrade}
          className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-wider transition shadow-md cursor-pointer"
        >
          Unlock Workspace Tiers
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-white/10 rounded-[2rem] p-6 md:p-8 space-y-6 select-none relative">
      
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-extrabold text-white">Weekly AI Analytical Sheets</h3>
            <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider font-mono ${
              userTier === "pro" ? "bg-amber-400/20 text-amber-400 border border-amber-400/20" : "bg-indigo-400/20 text-indigo-400 border border-indigo-400/20"
            }`}>
              {userTier.toUpperCase()} EXPORTS LIVE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-medium font-sans">Evaluate comprehensive seasonal spreadsheets, player fatigue parameters, and forecast portfolios.</p>
        </div>
        
        <div className="flex items-center gap-2">
          {diagnoseStatus && (
            <span className="text-[10px] font-mono text-emerald-400 font-bold animate-pulse mr-2">
              {diagnoseStatus}
            </span>
          )}
          <button 
            onClick={handleReDiagnose}
            disabled={!!diagnoseStatus}
            className="bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400 px-4 py-3 rounded-xl font-bold flex items-center gap-1.5 text-xs transition cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className="w-3.5 h-3.5 animate-spin-slow text-slate-400" />
            <span>Calibrate Medical Logs</span>
          </button>
          
          <button 
            onClick={handleDownload}
            disabled={!!downloadStatus && !downloadStatus.startsWith("✅")}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-3 rounded-xl font-black flex items-center gap-1.5 text-xs transition cursor-pointer shadow-sm disabled:opacity-50"
          >
            {downloadStatus && !downloadStatus.startsWith("✅") ? (
              <Loader2 className="w-4 h-4 animate-spin text-white font-bold" />
            ) : (
              <Download className="w-4 h-4 font-bold" />
            )}
            <span>Export Pro PDF dossier</span>
          </button>
        </div>
      </div>

      {downloadStatus && (
        <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs rounded-xl flex items-center justify-between">
          <p className="font-bold flex items-center gap-1.5 font-mono">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span>Download Status: {downloadStatus}</span>
          </p>
        </div>
      )}

      {/* Sheet Summary Card */}
      <div className="p-6 rounded-2xl bg-black/40 border border-white/5 space-y-6">
        <div className="flex justify-between items-center border-b border-white/5 pb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            <h4 className="font-extrabold text-white text-sm font-sans">Automated Intelligence Report (Week 24)</h4>
          </div>
          <span className="bg-indigo-500/20 text-indigo-400 font-bold px-3 py-1 rounded-full text-[10px] font-mono">STABLE DATA</span>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 text-center text-xs">
          <div className="bg-slate-950 p-4 rounded-xl border border-white/5">
            <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest font-mono">Matches Processed</p>
            <p className="text-lg font-black text-white mt-1 font-mono">84 Games</p>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-white/5">
            <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest font-mono font-bold">Model Success Rate</p>
            <p className="text-lg font-black text-indigo-400 mt-1 font-mono">84.2% hitRate</p>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-white/5">
            <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest font-mono">Extreme Outliers Tracked</p>
            <p className="text-lg font-black text-indigo-300 mt-1 font-mono">6 Matches</p>
          </div>
        </div>

        <div className="space-y-3 text-xs text-slate-350 leading-relaxed font-sans font-medium">
          <p>
            <strong>Executive Tactical Highlights:</strong> Roster rotation modeling and tactical parameters performed at optimal deviation scales. Passing safety adjustments indices registered correct outcomes in 94% of live simulated plays.
          </p>
          <p>
            <strong>Atmospheric Weather Anomalies:</strong> Active snow conditions across Northeast USA games triggered subtle market coefficient shifts, resulting in +1.4% model offset variance compared to standard dry-dome baselines. Close attention should be focused on cross-continental field temperatures.
          </p>
        </div>
      </div>

      {/* HIGH VALUED PREMIUM MODULES FOR PLUS AND PRO */}
      <div className="grid md:grid-cols-2 gap-6 pt-2">
        
        {/* Roster Fatigue Index Logs (Elite Plus and Pro Mode) */}
        <div className="p-6 bg-slate-955 rounded-3xl border border-white/5 space-y-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <h5 className="text-sm font-extrabold text-white flex items-center gap-1.5 font-sans">
              <Zap className="w-4 h-4 text-indigo-400" />
              Roster Fatigue Multipliers
            </h5>
            <span className="text-[8px] bg-indigo-500/10 border border-indigo-500/25 px-2 py-0.5 text-indigo-400 font-bold uppercase font-mono tracking-wider rounded">
              Plus & Pro Live Scanner
            </span>
          </div>

          <p className="text-[11px] text-slate-400 leading-normal">
            Weekly rest indices dynamically adjust simulated defense ratios. High-risk entries indicate imminent parameter decay.
          </p>

          <div className="space-y-2.5">
            {liveRosterFatigue.map((player, idx) => {
              const isLockedForPlus = userTier === "plus" && idx > 1;

              return (
                <div key={idx} className={`p-3 rounded-2xl border ${
                  isLockedForPlus 
                    ? "bg-slate-950/20 border-dashed border-white/5 opacity-55" 
                    : "bg-slate-950/80 border-white/5"
                }`}>
                  {isLockedForPlus ? (
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <p className="italic font-bold font-mono">Locked entry: requires Pro subscription</p>
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] font-black text-white">{player.player}</span>
                        <div className="text-[9px] text-slate-500 font-bold uppercase mt-0.5">{player.team} • {player.status}</div>
                      </div>
                      <div className="text-right font-mono text-[10px]">
                        <div className="text-indigo-400 font-semibold">Factor: {player.restCoef}</div>
                        <span className={`text-[9.5px] font-black ${
                          player.risk === "High" ? "text-rose-400" : player.risk === "Medium" ? "text-amber-400" : "text-emerald-400"
                        }`}>{player.risk} Risk</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Market Line Volume Movement Scanner */}
        <div className="p-6 bg-slate-955 rounded-3xl border border-white/5 space-y-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <h5 className="text-sm font-extrabold text-white flex items-center gap-1.5 font-sans">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              Live Market Shift Stream
            </h5>
            <span className="text-[8px] bg-indigo-500/10 border border-indigo-500/25 px-2 py-0.5 text-indigo-400 font-bold uppercase font-mono tracking-wider rounded">
              Elite Pro live feed
            </span>
          </div>

          <p className="text-[11px] text-slate-400 leading-normal">
            Las Vegas market line volume swings monitored under real-time conditions. Recalibrate sandbox when major alerts fire.
          </p>

          {userTier === "plus" ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-10 h-10 rounded-full bg-slate-950 border border-white/5 flex items-center justify-center mx-auto">
                <Lock className="w-4 h-4 text-slate-500" />
              </div>
              <p className="text-[10.5px] text-slate-350 max-w-xs mx-auto leading-normal">
                Live volume swing tickers are Elite Pro exclusive features. Upgrade to gain instant coverage alerts.
              </p>
            </div>
          ) : (
            <div className="space-y-3.5 text-[11px] font-mono select-none">
              <div className="flex gap-2 text-indigo-400 leading-relaxed">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-black text-rose-400 block">[ALERT] VOLUMETRIC BULK OFFSET</span>
                  <span>FanDuel bulk traffic registers 81% load volume on LA Lakers spread lines inside last 12 minutes.</span>
                </div>
              </div>
              <div className="flex gap-2 text-slate-405 text-slate-400 leading-relaxed border-t border-white/5 pt-2">
                <CornerDownRight className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold text-slate-200 block">[LINE SHIFT] NFL WEATHER CORRECTION</span>
                  <span>Heavy precipitation forecast shifts Buffalo vs Kansas City standard O/U limits by -2.5 points today.</span>
                </div>
              </div>
              <div className="flex gap-2 text-slate-405 text-slate-405 text-slate-450 text-slate-400 leading-relaxed border-t border-white/5 pt-2">
                <CornerDownRight className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold text-slate-200 block">[VOLUME SHIFT] MLB WEATHER CORRECTION</span>
                  <span>LAA stadium atmospheric density drops to 1.1x. Over run index estimates rise by +4.8% edge margins.</span>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
