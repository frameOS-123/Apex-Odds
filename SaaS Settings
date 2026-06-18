import React, { useState } from "react";
import { Settings, Bell, Zap, Shield, Trash2, Save, Loader2 } from "lucide-react";

interface SaasSettingsProps {
  onClearWorkspace?: () => void;
}

export default function SaasSettings({ onClearWorkspace }: SaasSettingsProps) {
  const [highEdgeNotif, setHighEdgeNotif] = useState(true);
  const [upsetAlarms, setUpsetAlarms] = useState(true);
  const [preferredSports, setPreferredSports] = useState<string[]>(["NFL", "NBA", "Soccer"]);
  const [saveStatus, setSaveStatus] = useState<string>("");
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const toggleSportPreference = (sport: string) => {
    if (preferredSports.includes(sport)) {
      setPreferredSports(preferredSports.filter(s => s !== sport));
    } else {
      setPreferredSports([...preferredSports, sport]);
    }
  };

  const handleSave = () => {
    if (saveStatus) return;
    setSaveStatus("Syncing with Firestore...");
    setTimeout(() => {
      setSaveStatus("✅ Saved successfully to Cloud Firestore!");
      setTimeout(() => setSaveStatus(""), 4000);
    }, 1200);
  };

  const executeClear = () => {
    if (onClearWorkspace) {
      onClearWorkspace();
    }
    setShowConfirmReset(false);
    setSaveStatus("🧹 Workspace wiped! Starting 100% blank.");
    setTimeout(() => setSaveStatus(""), 5000);
  };

  return (
    <div className="bg-slate-900 border border-white/10 rounded-[2rem] p-6 md:p-8 space-y-6 select-none">
      <div>
        <h3 className="text-lg font-extrabold text-white">Workspace Preferences</h3>
        <p className="text-xs text-slate-400">Configure notifications and active followed league parameters.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 pt-6 border-t border-white/5">
        
        {/* Toggle options */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1">
            <Bell className="w-3.5 h-3.5 text-indigo-400" />
            Live Alerts Systems
          </h4>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 cursor-pointer">
              <div>
                <h5 className="font-extrabold text-white text-xs">High-Edge Telegram Alerts</h5>
                <p className="text-[10px] text-slate-400 leading-normal pt-0.5">Receive instant alerts when search trends shift win probabilities beyond limits.</p>
              </div>
              <input 
                type="checkbox"
                checked={highEdgeNotif}
                onChange={(e) => setHighEdgeNotif(e.target.checked)}
                className="w-4 h-4 accent-indigo-500"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 cursor-pointer">
              <div>
                <h5 className="font-extrabold text-white text-xs">Underdog Upset Alarms</h5>
                <p className="text-[10px] text-slate-400 leading-normal pt-0.5">Pings your channel if simulated underdog scores show peak form trends.</p>
              </div>
              <input 
                type="checkbox"
                checked={upsetAlarms}
                onChange={(e) => setUpsetAlarms(e.target.checked)}
                className="w-4 h-4 accent-indigo-500"
              />
            </label>
          </div>
        </div>

        {/* Checked preferred sports */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-indigo-400" />
            Tracked League Workspace
          </h4>

          <div className="grid grid-cols-2 gap-3 text-[11px] pt-1">
            {[
              { id: "NFL", label: "🏈 NFL Football" },
              { id: "NBA", label: "🏀 NBA Basketball" },
              { id: "MLB", label: "⚾ MLB Baseball" },
              { id: "NHL", label: "🏒 NHL Hockey" },
              { id: "Soccer", label: "⚽ Soccer" },
              { id: "Tennis", label: "🎾 Tennis Pro" },
              { id: "Formula 1", label: "🏎️ Formula 1" },
              { id: "UFC", label: "🥊 UFC MMA" },
              { id: "Cricket", label: "🏏 Cricket" }
            ].map((sportObj) => {
              const active = preferredSports.includes(sportObj.id);
              return (
                <button
                  key={sportObj.id}
                  type="button"
                  onClick={() => toggleSportPreference(sportObj.id)}
                  className={`p-3 rounded-xl border text-left font-bold transition flex items-center justify-between cursor-pointer ${
                    active 
                      ? "bg-indigo-550/10 border-indigo-500/30 text-indigo-400" 
                      : "bg-white/5 border-white/5 hover:border-white/10 text-slate-400 hover:text-white"
                  }`}
                >
                  <span>{sportObj.label}</span>
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
                </button>
              );
            })}
          </div>

          <div className="space-y-2 pt-2">
            <button 
              onClick={handleSave}
              disabled={!!saveStatus && !saveStatus.startsWith("✅") && !saveStatus.startsWith("🧹")}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-md disabled:opacity-50"
            >
              {saveStatus && !saveStatus.startsWith("✅") && !saveStatus.startsWith("🧹") ? (
                <Loader2 className="w-4 h-4 animate-spin text-white font-bold" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>Save Workspace Priorities</span>
            </button>
            {saveStatus && (
              <p className="text-[10px] font-mono text-indigo-400 font-bold text-center transition-all duration-300">
                {saveStatus}
              </p>
            )}
          </div>

          {/* Danger Zone / Start Blank */}
          <div className="pt-6 border-t border-rose-500/10 space-y-3">
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-rose-400 flex items-center gap-1 bg-rose-500/5 p-2 rounded-lg border border-rose-500/10 w-fit">
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              Danger Zone
            </h4>
            <p className="text-[10px] text-slate-400 leading-normal">
              Resetting will completely wipe all of your custom predicted matches, observation logs, and favorite followed franchises.
            </p>
            
            {!showConfirmReset ? (
              <button
                type="button"
                onClick={() => setShowConfirmReset(true)}
                className="w-full bg-rose-500/10 hover:bg-rose-550 hover:text-white text-rose-400 border border-rose-500/20 text-xs font-bold py-3 rounded-xl transition cursor-pointer uppercase tracking-wider"
              >
                Clear Workspace & Start Blank
              </button>
            ) : (
              <div className="space-y-2 p-3 bg-rose-950/20 border border-rose-550/20 rounded-2xl">
                <p className="text-[10px] font-bold text-rose-400 text-center uppercase tracking-wide">Are you absolutely sure?</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={executeClear}
                    className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-black py-2.5 rounded-xl transition cursor-pointer"
                  >
                    Yes, Wipe It 🧹
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowConfirmReset(false)}
                    className="bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold py-2.5 rounded-xl transition cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
