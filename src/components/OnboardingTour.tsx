import React, { useState } from "react";
import { 
  Sparkles, ChevronRight, ChevronLeft, X, Play, Target, Gauge, 
  HelpCircle, ShieldCheck, Zap, ArrowRight, Eye, RefreshCw
} from "lucide-react";

interface OnboardingTourProps {
  onClose: () => void;
  activeView: string;
  onChangeView: (view: string) => void;
  userTier: string;
}

interface TourStep {
  title: string;
  badge: string;
  description: string;
  highlightSelector?: string;
  viewName?: string; // Route user needs to be on
  icon: React.ReactNode;
  tips: string[];
}

export default function OnboardingTour({ onClose, activeView, onChangeView, userTier }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps: TourStep[] = [
    {
      title: "Welcome to ApexOdds Portfolio Platform v3.5",
      badge: "SaaS Command Deck",
      description: "ApexOdds combines custom numerical models, real-time Google search grounding, and gamification to deliver elite-tier predictions and matchup intelligence.",
      icon: <Sparkles className="w-8 h-8 text-indigo-400 animate-pulse" />,
      tips: [
        "Track model accuracy ratios live at 84.2%",
        "Toggle from Free Trial to Enterprise Pro SaaS license effortlessly",
        "Save and review static and dynamic sports archives"
      ]
    },
    {
      title: "Key Metrics & the Bento Grid Layout",
      badge: "Dashboard Overview",
      description: "Get a clear picture of live match spreads, followed franchises, win streaks, and session-based XP gains directly in your Bento Grid display.",
      viewName: "dashboard",
      icon: <Target className="w-8 h-8 text-indigo-400" />,
      tips: [
        "Earn up to 500 XP for deploying the custom seed dashboard template",
        "Observe active matchup win probability ratios side-by-side",
        "Monitor immediate roster injuries like Patrick Mahomes' Rest Index"
      ]
    },
    {
      title: "Quantum Odds Engine v3.5 & Parameter Tuning",
      badge: "Sandbox Modeler",
      description: "The core predictive engine lets you adjust offensive strengths, defensive ratings, and climate multipliers (precipitation, wind density) to generate highly specific forecasts.",
      viewName: "predictions",
      icon: <Gauge className="w-8 h-8 text-teal-400" />,
      tips: [
        "Toggle 'Deep Search Grounding' to scan recent real-world team events",
        "Adjust the core sliders to observe live changes in win probability",
        "Click any sport to see customized models (e.g. Football, Basketball, or Racing)"
      ]
    },
    {
      title: "Archiving in the Live Prediction Vault",
      badge: "Vault & Exports",
      description: "Save simulated matchups directly into your vault, where you can resolve them using actual sports outcomes, add manual game summaries, or export reports.",
      viewName: "vault",
      icon: <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin-slow" />,
      tips: [
        "Plus & Pro members can export full vault history as a CSV file",
        "Instantly copy curated Markdown reports for external analysis",
        "Simulate live resolution using our automated Oracle simulator"
      ]
    },
    {
      title: "SaaS Enterprise Licensing Tiers",
      badge: "Billing Configurator",
      description: "Customize your analytical scope! Shift between the Free Standard Sandbox, the feature-rich Analytical Plus, or the maximum precision Quantum Elite (Pro).",
      viewName: "membership",
      icon: <ShieldCheck className="w-8 h-8 text-amber-400" />,
      tips: [
        "Analytical Plus unlocks standard Monte Carlo runs and weekly sheets",
        "Quantum Elite supports all 12 sports, eV offsets, and unlimited queries",
        "Downgrade or scale up live on the flies"
      ]
    },
    {
      title: "Grounded AI Analyst Terminal",
      badge: "Dynamic Bot Queries",
      description: "Have direct, conversational access to our Bloomberg-style sports analyst terminal. Ask questions about team trades, field grass density, and injury bulletins.",
      viewName: "analyst",
      icon: <Zap className="w-8 h-8 text-indigo-400" />,
      tips: [
        "Ground models live using Google search queries",
        "Review actual sources matching real-world sports reporting",
        "Earn active XP points for terminal interactions"
      ]
    }
  ];

  const handleNext = () => {
    const nextIdx = currentStep + 1;
    if (nextIdx < steps.length) {
      setCurrentStep(nextIdx);
      const nextView = steps[nextIdx].viewName;
      if (nextView && activeView !== nextView) {
        onChangeView(nextView);
      }
    } else {
      // Completed!
      localStorage.setItem("apexodds-onboarding-completed", "true");
      onClose();
    }
  };

  const handleBack = () => {
    const prevIdx = currentStep - 1;
    if (prevIdx >= 0) {
      setCurrentStep(prevIdx);
      const prevView = steps[prevIdx].viewName;
      if (prevView && activeView !== prevView) {
        onChangeView(prevView);
      }
    }
  };

  const step = steps[currentStep];

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none">
      <div className="bg-slate-900 border border-indigo-500/30 rounded-[2rem] p-6 md:p-8 max-w-xl w-full text-left space-y-6 relative overflow-hidden shadow-2xl shadow-indigo-500/10">
        {/* Ambient light gradient */}
        <div className="absolute top-[-40%] left-[-20%] w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Header Close */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-indigo-500/25 border border-indigo-500/20 px-3 py-1 rounded-full text-indigo-400 font-bold tracking-widest font-mono uppercase inline-block">
              {step.badge}
            </span>
            <span className="text-slate-500 font-mono text-[10px] font-bold">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Area */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl shrink-0 shadow-inner">
              {step.icon}
            </div>
            <h3 className="text-lg md:text-xl font-black text-white leading-snug">
              {step.title}
            </h3>
          </div>

          <p className="text-xs text-slate-350 leading-relaxed font-sans font-medium">
            {step.description}
          </p>
        </div>

        {/* Dynamic Tips Panel */}
        <div className="bg-slate-950/80 p-4.5 rounded-2xl border border-white/5 space-y-2.5">
          <span className="text-[9px] text-indigo-400 font-black uppercase tracking-wider font-mono block">
            ⭐ Tactical Tips & Core Highlights:
          </span>
          <ul className="space-y-2 text-xs text-slate-300">
            {step.tips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-indigo-400 font-bold shrink-0 mt-0.5">•</span>
                <span className="font-medium">{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Navigation Step Indicator Progress Bar */}
        <div className="flex items-center gap-1.5 w-full">
          {steps.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentStep 
                  ? "flex-1 bg-indigo-500" 
                  : i < currentStep 
                    ? "w-4 bg-indigo-500/50" 
                    : "w-4 bg-white/10"
              }`} 
            />
          ))}
        </div>

        {/* Button Controls */}
        <div className="flex justify-between items-center pt-2">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white font-bold text-xs uppercase tracking-wide transition disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-slate-350 font-bold text-xs uppercase tracking-wide px-3 py-2 cursor-pointer transition hidden sm:inline-block"
            >
              Skip Tour
            </button>
            <button
              onClick={handleNext}
              className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-wider transition shadow-md shadow-indigo-600/20 flex items-center gap-1.5 cursor-pointer"
            >
              <span>{currentStep === steps.length - 1 ? "Finish" : "Next Step"}</span>
              <ChevronRight className="w-4 h-4 font-bold" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
