import React, { useState, useEffect, useRef } from "react";
import { 
  Search, Play, LayoutDashboard, GitCompare, Lock, TrendingUp, Users, 
  Settings, Award, Sparkles, X, ShieldCheck, Key
} from "lucide-react";

interface CommandCenterProps {
  onClose: () => void;
  onNavigate: (view: string) => void;
  userTier: string;
  translations: any;
}

export default function CommandCenter({ onClose, onNavigate, userTier, translations }: CommandCenterProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus the input automatically
    inputRef.current?.focus();
  }, []);

  const commands = [
    { title: translations.dashboard, view: "dashboard", icon: LayoutDashboard, desc: "Go to central telemetry" },
    { title: translations.sandbox, view: "predictions", icon: Sparkles, desc: "Launch Sports & Ports simulation" },
    { title: "Comparison Lab", view: "comparison", icon: GitCompare, desc: "Compare side-by-side matchups" },
    { title: translations.vault, view: "vault", icon: Lock, desc: "Saved predictions vaults" },
    { title: translations.accuracy, view: "accuracy", icon: TrendingUp, desc: "Verify model success rates" },
    { title: translations.friends, view: "friends", icon: Users, desc: "Manage syndicate analyst team" },
    { title: translations.licensing, view: "membership", icon: ShieldCheck, desc: "Configure license and premium keys" },
  ];

  const filtered = commands.filter(c => 
    c.title.toLowerCase().includes(query.toLowerCase()) || 
    c.desc.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-xl bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden select-none animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 border-b border-white/5 flex items-center gap-3">
          <Search className="w-5 h-5 text-indigo-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={translations.searchPlaceholder || "Search command console..."}
            className="w-full bg-transparent border-none text-sm text-white outline-none placeholder-slate-500 py-1"
          />
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content body */}
        <div className="max-h-72 overflow-y-auto p-2 space-y-1">
          {filtered.length > 0 ? (
            filtered.map((cmd) => (
              <button
                key={cmd.view}
                onClick={() => {
                  onNavigate(cmd.view);
                  onClose();
                }}
                className="w-full flex items-center justify-between p-3.5 rounded-xl hover:bg-white/5 text-left transition group cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center border border-white/5 group-hover:border-indigo-500/30">
                    <cmd.icon className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white leading-none">{cmd.title}</h5>
                    <p className="text-[10px] text-slate-500 mt-1 font-medium">{cmd.desc}</p>
                  </div>
                </div>
                
                <span className="text-[9px] font-mono font-bold text-slate-600 group-hover:text-indigo-400 bg-slate-950 px-2 py-1 rounded-lg border border-white/5 transition">
                  Jump ↵
                </span>
              </button>
            ))
          ) : (
            <div className="py-8 text-center text-slate-500 text-xs font-medium">
              No matching analytical commands found for "{query}"
            </div>
          )}
        </div>

        {/* Short Key indicators footer */}
        <div className="bg-slate-950 p-4 border-t border-white/5 flex flex-wrap gap-4 justify-between items-center text-[10px] text-slate-400 font-mono">
          <div className="flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-bold text-slate-500 uppercase">{translations.shortcutsTitle || "SHORTCUTS"}:</span>
          </div>
          
          <div className="flex gap-3">
            <div className="flex items-center gap-1">
              <span className="bg-slate-900 border border-white/10 px-1.5 py-0.5 rounded text-[9px] font-bold text-slate-300">Ctrl K</span>
              <span className="text-slate-500">Toggle Search</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="bg-slate-900 border border-white/10 px-1.5 py-0.5 rounded text-[9px] font-bold text-slate-300">Ctrl P</span>
              <span className="text-slate-500">Run Sandbox</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
