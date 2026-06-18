import React, { useState, useRef, useEffect } from "react";
import { 
  Terminal, Globe, Bot, User, Send, RefreshCw, BadgeHelp, CheckCircle
} from "lucide-react";

interface AnalystTerminalProps {
  onGrantXp: (amount: number) => void;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: Array<{ title: string; url: string }>;
}

export default function AnalystTerminal({ onGrantXp }: AnalystTerminalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "System ready. Welcome to Quantum AI Analyst Terminal. Access real-time matchup data, trade rest conditions, and live ground indices by typing your query below."
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [useSearch, setUseSearch] = useState(true);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput("");
    setIsLoading(true);

    const updatedMessages = [...messages, { role: "user" as const, content: userText }];
    setMessages(updatedMessages);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
          useSearch
        })
      });

      if (!res.ok) {
        throw new Error("Terminal pipeline generated invalid state");
      }

      const data = await res.json();
      setMessages(prev => [
        ...prev, 
        { 
          role: "assistant", 
          content: data.reply,
          sources: data.sources || []
        }
      ]);

      // Award XP
      onGrantXp(80);

    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "System pipeline trace interruption. Baseline local telemetry cached."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-white/10 rounded-[2rem] p-6 md:p-8 space-y-6 flex flex-col h-[650px] select-none">
      
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <Terminal className="w-5 h-5 text-emerald-400 animate-pulse" />
          <div>
            <h3 className="text-base font-extrabold text-white">Quantum AI Analyst</h3>
            <p className="text-[10px] text-slate-400">Interactive conversational search parameters pipeline.</p>
          </div>
        </div>

        <div className="bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-emerald-400 text-[10px] uppercase font-bold tracking-wider font-mono">Gemini Grounded</span>
        </div>
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar">
        {messages.map((m, idx) => (
          <div 
            key={idx} 
            className={`p-4 rounded-2xl text-xs font-mono border leading-relaxed ${
              m.role === "assistant" 
                ? "bg-black/30 border-white/5 text-slate-300" 
                : "bg-emerald-950/20 border-emerald-500/20 text-emerald-250 text-emerald-100"
            }`}
          >
            <div className="flex items-center gap-1.5 uppercase font-bold tracking-widest text-[9px] text-emerald-400 mb-2">
              {m.role === "assistant" ? (
                <>
                  <Bot className="w-3.5 h-3.5" />
                  <span>SYSTEM // REPORT TRANSMISSION</span>
                </>
              ) : (
                <>
                  <User className="w-3.5 h-3.5" />
                  <span>USER // VECTOR STATEMENT</span>
                </>
              )}
            </div>
            
            <p className="whitespace-pre-wrap">{m.content}</p>

            {/* Citations list links for ground index */}
            {m.sources && m.sources.length > 0 && (
              <div className="mt-3 pt-3 border-t border-white/5 space-y-1.5">
                <span className="text-[9px] uppercase tracking-wider font-bold text-slate-500 block flex items-center gap-1">
                  <Globe className="w-3 h-3 text-emerald-400" />
                  Research Sources CITED
                </span>
                <div className="flex flex-wrap gap-2 pt-0.5">
                  {m.sources.map((src, i) => (
                    <a 
                      key={i}
                      href={src.url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-[9px] bg-slate-800 hover:bg-slate-700 text-teal-400 px-2 py-1 rounded border border-white/5 flex items-center gap-1 transition"
                    >
                      <span className="max-w-[150px] truncate">{src.title}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-slate-400 font-mono text-xs flex items-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
            <span>Querying Google Grounding networks...</span>
          </div>
        )}
        <div ref={terminalEndRef} />
      </div>

      {/* Terminal Submission form */}
      <form onSubmit={handleSend} className="space-y-3 pt-3 border-t border-white/5">
        
        <div className="relative">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="Ask AI Analyst (e.g. Compare Celtics vs Knicks tactical rest indices)..."
            className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-5 pr-14 text-xs font-mono text-white outline-none focus:border-emerald-400"
          />
          <button 
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl hover:bg-emerald-400 hover:text-slate-950 transition disabled:opacity-50 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Toggle options footer */}
        <div className="flex items-center justify-between text-[10px] text-slate-400">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input 
              type="checkbox"
              checked={useSearch}
              onChange={(e) => setUseSearch(e.target.checked)}
              className="accent-emerald-400 w-3.5 h-3.5"
            />
            <span className="flex items-center gap-1">
              <Globe className="w-3 h-3 text-emerald-400" />
              Toggle Search Grounding
            </span>
          </label>
          <span className="flex items-center gap-1">
            <BadgeHelp className="w-3.5 h-3.5" />
            Each query awards 80 XP points
          </span>
        </div>

      </form>
    </div>
  );
}
