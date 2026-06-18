import React from "react";
import { Check, X, BadgeCheck, Zap, Sparkles, Shield, Cpu, Flame } from "lucide-react";

interface SaasLicenseProps {
  userTier: "free" | "plus" | "pro" | "syndicate";
  onSetTier: (tier: "free" | "plus" | "pro" | "syndicate") => void;
}

export default function SaasLicense({ userTier, onSetTier }: SaasLicenseProps) {
  return (
    <div className="bg-slate-900 border border-white/10 rounded-[2rem] p-6 md:p-8 space-y-8 select-none">
      <div className="text-center max-w-xl mx-auto space-y-3 pb-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-mono uppercase font-black tracking-widest">
          <BadgeCheck className="w-3.5 h-3.5" />
          <span>SaaS Plan Configurator</span>
        </div>
        <h3 className="text-2xl font-black text-white md:text-3xl">Choose Your Workspace License</h3>
        <p className="text-xs text-slate-400">
          Scale up to unlock real-time Google search grounding, high-precision climate multipliers, comparison labs, massive Monte Carlo runs, and arbitrage hedge tables.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto items-stretch pt-2">
        
        {/* Free Plan */}
        <div id="license-tier-free" className={`bg-slate-950 p-6 rounded-3xl border transition duration-300 flex flex-col justify-between ${
          userTier === "free" ? "border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.1)] animate-subtle-glow" : "border-white/5"
        }`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[9px] bg-slate-900 text-slate-400 px-2.5 py-1 rounded-lg font-bold font-mono">SANDBOX</span>
              {userTier === "free" && <span className="text-[9px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded font-mono uppercase">ACTIVE</span>}
            </div>
            <div className="space-y-1">
              <h4 className="font-extrabold text-white text-base">Standard Sandbox</h4>
              <p className="text-[11px] text-slate-400">Run standard-precision predictions with daily quota caps.</p>
            </div>
            <div className="pt-3 border-b border-white/5 pb-3">
              <span className="text-3xl font-black text-white font-mono">$0</span>
              <span className="text-xs text-slate-500 font-semibold font-mono"> / forever</span>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-300 pt-2 font-medium">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-indigo-400" />
                <span>3 Free Daily Projections</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-indigo-400" />
                <span>2 Sports (NFL, NBA)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-indigo-400" />
                <span>Follow 2 Franchises</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-indigo-400" />
                <span>Save 3 Matches in Vault</span>
              </li>
              <li className="flex items-center gap-2 text-slate-500">
                <X className="w-3.5 h-3.5 text-slate-600" />
                <span>Monte Carlo Runs (Locked)</span>
              </li>
              <li className="flex items-center gap-2 text-slate-500">
                <X className="w-3.5 h-3.5 text-slate-600" />
                <span>CSV Vault History Export</span>
              </li>
              <li className="flex items-center gap-2 text-slate-500">
                <X className="w-3.5 h-3.5 text-slate-600" />
                <span>Deep Search Grounding</span>
              </li>
            </ul>
          </div>
          <button 
            id="btn-license-free"
            onClick={() => onSetTier("free")}
            className={`w-full mt-8 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition ${
              userTier === "free" 
                ? "bg-slate-800 text-slate-300 border border-white/10" 
                : "bg-white/5 hover:bg-white/10 text-white border border-white/5 cursor-pointer"
            }`}
          >
            {userTier === "free" ? "Active License" : "Select Standard"}
          </button>
        </div>

        {/* Plus Plan */}
        <div id="license-tier-plus" className={`bg-slate-955 p-6 rounded-3xl border transition duration-300 flex flex-col justify-between relative ${
          userTier === "plus" ? "border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.15)]" : "border-indigo-500/25"
        }`}>
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white font-black text-[8px] uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
            GREAT VALUE TIER
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between pt-2">
              <span className="text-[9px] bg-indigo-650/40 text-indigo-300 px-2.5 py-1 rounded-lg font-bold font-mono">PLUS SUITE</span>
              {userTier === "plus" && <span className="text-[9px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded font-mono uppercase">ACTIVE</span>}
            </div>
            
            <div className="space-y-1">
              <h4 className="font-extrabold text-white text-base">Analytical Plus</h4>
              <p className="text-[11px] text-slate-400">Unlock expanded sport rosters, deeper file logs, and historical archives.</p>
            </div>
            <div className="pt-3 border-b border-white/5 pb-3">
              <span className="text-3xl font-black text-white font-mono">$19</span>
              <span className="text-xs text-slate-500 font-semibold font-mono"> / month</span>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-200 pt-2 font-medium">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-indigo-400" />
                <span>10 Daily Projections</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-indigo-400" />
                <span>7 Sports (inc. Soccer, UFC)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-indigo-400" />
                <span>Save 10 Matches in Vault</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-indigo-400" />
                <span>Monte Carlo (100 runs)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-indigo-400" />
                <span>Gaussian Variance curve</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-emerald-300">CSV History Export</span>
              </li>
              <li className="flex items-center gap-2 text-slate-500">
                <X className="w-3.5 h-3.5 text-slate-600" />
                <span>Deep Search Grounding</span>
              </li>
            </ul>
          </div>
          <button 
            id="btn-license-plus"
            onClick={() => onSetTier("plus")}
            className={`w-full mt-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition ${
              userTier === "plus" 
                ? "bg-slate-800 text-slate-300 border border-white/10" 
                : "bg-indigo-600 hover:bg-indigo-500 text-white font-semibold cursor-pointer shadow-md"
            }`}
          >
            {userTier === "plus" ? "Active License" : "Select Analytical Plus"}
          </button>
        </div>

        {/* Pro Plan */}
        <div id="license-tier-pro" className={`bg-gradient-to-tr from-slate-900 to-slate-950 p-6 rounded-3xl border transition duration-300 flex flex-col justify-between relative ${
          userTier === "pro" ? "border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.15)]" : "border-amber-550/25"
        }`}>
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 font-black text-[8px] uppercase tracking-widest px-3 py-1 rounded-full shadow-md flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 fill-slate-950 text-slate-950" />
            MAX ACCURACY ELITE
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between pt-2">
              <span className="text-[9px] bg-amber-400/10 text-amber-400 px-2.5 py-1 rounded-lg font-bold font-mono">QUANTUM ELITE</span>
              {userTier === "pro" && <span className="text-[9px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded font-mono uppercase">ACTIVE</span>}
            </div>

            <div className="space-y-1">
              <h4 className="font-extrabold text-white text-base">Quantum Elite (Pro)</h4>
              <p className="text-[11px] text-slate-400">Lock fully accurate search-grounded models, variance simulations and arbitrage calculators.</p>
            </div>
            <div className="pt-3 border-b border-white/5 pb-3">
              <span className="text-3xl font-black text-white font-mono">$49</span>
              <span className="text-xs text-slate-500 font-semibold font-mono"> / month</span>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-200 pt-2 font-medium">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-amber-400" />
                <span>Unlimited Projections</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-amber-300">Support for ALL 12 Sports</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-amber-400" />
                <span>Unlimited Saved Matches</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-amber-400" />
                <span>Monte Carlo (10k runs + curves)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-amber-300">Google AI Search Grounding</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-amber-400" />
                <span>Arbitrage eV Split Hedger</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-amber-400" />
                <span>CSV History Export & PDF Reports</span>
              </li>
            </ul>
          </div>
          <button 
            id="btn-license-pro"
            onClick={() => onSetTier("pro")}
            className={`w-full mt-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition ${
              userTier === "pro" 
                ? "bg-slate-800 text-slate-300 border border-white/10" 
                : "bg-amber-400 hover:bg-amber-300 text-slate-950 font-black cursor-pointer shadow-md"
            }`}
          >
            {userTier === "pro" ? "Active License" : "Activate Elite SaaS"}
          </button>
        </div>

        {/* Syndicate Plan (New Plan requested by user!) */}
        <div id="license-tier-syndicate" className={`bg-gradient-to-tr from-indigo-950 via-slate-900 to-slate-950 p-6 rounded-3xl border transition duration-300 flex flex-col justify-between relative ${
          userTier === "syndicate" ? "border-indigo-400 shadow-[0_0_30px_rgba(99,102,241,0.2)] animate-pulse-slow" : "border-indigo-500/20"
        }`}>
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-550 to-purple-600 text-white font-black text-[8px] uppercase tracking-widest px-3 py-1 rounded-full shadow-md flex items-center gap-1">
            <Flame className="w-2.5 h-2.5 text-amber-400 shrink-0 fill-amber-400" />
            BOOKMAKER SYNDICATE
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between pt-2">
              <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-lg font-bold font-mono">TEAM SYNDICATE</span>
              {userTier === "syndicate" && <span className="text-[9px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded font-mono uppercase">ACTIVE</span>}
            </div>

            <div className="space-y-1">
              <h4 className="font-extrabold text-white text-base">Syndicate Syndicate</h4>
              <p className="text-[11px] text-indigo-200">Ultimate High Frequency enterprise tier designed for betting syndicates and analysts.</p>
            </div>
            
            <div className="pt-3 border-b border-white/5 pb-3">
              <span className="text-3xl font-black text-white font-mono">$99</span>
              <span className="text-xs text-slate-500 font-semibold font-mono"> / month</span>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-200 pt-2 font-medium">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-indigo-300 font-bold">Multi-seat Team Collaboration</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-indigo-400" />
                <span>Custom Sliders Presets Vault</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-indigo-300">Live Las Vegas / FanDuel Odds Volatility</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-indigo-400" />
                <span>Unlimited Grounded AI scans</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-indigo-400" />
                <span>Extreme Outlier Backtesting Engine</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-indigo-400" />
                <span>Premium API Tickers Integrations</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-emerald-300">Sub-12ms Multi-core Server speed</span>
              </li>
            </ul>
          </div>

          <button 
            id="btn-license-syndicate"
            onClick={() => onSetTier("syndicate")}
            className={`w-full mt-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition ${
              userTier === "syndicate" 
                ? "bg-slate-800 text-slate-350 border border-white/10" 
                : "bg-indigo-600 hover:bg-indigo-500 text-white font-black cursor-pointer shadow-lg shadow-indigo-650/20"
            }`}
          >
            {userTier === "syndicate" ? "Active License" : "Enable Bookmaker Syndicate"}
          </button>
        </div>

      </div>
    </div>
  );
}
