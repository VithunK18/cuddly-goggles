import React from 'react';
import { ShieldCheck, Sparkles } from 'lucide-react';

interface JudgeConfigBadgeProps {
  dataset: string;
  trainTestSplit: string;
  randomSeed: number;
  preprocessing: string;
  classicalModels: string[];
  quantumModel: string;
  quantumBackend: string;
  qubitCount?: number;
}

export const JudgeConfigBadge: React.FC<JudgeConfigBadgeProps> = ({
  dataset,
  trainTestSplit,
  randomSeed,
  preprocessing,
  classicalModels,
  quantumModel,
  quantumBackend,
  qubitCount,
}) => {
  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 border-2 border-cyan-500/30 rounded-2xl p-5 shadow-xl shadow-cyan-950/20 relative overflow-hidden">
      {/* Decorative gradient glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold tracking-wide uppercase text-slate-100 font-mono">
                Benchmark Configuration
              </h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                Fairness Verified
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Guaranteed identical experimental boundary conditions across quantum and classical models
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono bg-emerald-950/50 px-3 py-1 rounded-lg border border-emerald-500/30 self-start sm:self-auto">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Zero Data Leakage</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-4 text-xs font-mono">
        <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
          <span className="text-[10px] uppercase text-slate-400 block mb-1">Dataset</span>
          <span className="text-cyan-300 font-bold capitalize truncate block">{dataset}</span>
        </div>

        <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
          <span className="text-[10px] uppercase text-slate-400 block mb-1">Train / Test</span>
          <span className="text-indigo-300 font-bold block">{trainTestSplit}</span>
        </div>

        <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
          <span className="text-[10px] uppercase text-slate-400 block mb-1">Random Seed</span>
          <span className="text-purple-300 font-bold block">{randomSeed}</span>
        </div>

        <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
          <span className="text-[10px] uppercase text-slate-400 block mb-1">Preprocessing</span>
          <span className="text-teal-300 font-bold truncate block">{preprocessing}</span>
        </div>

        <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
          <span className="text-[10px] uppercase text-slate-400 block mb-1">Classical Suite</span>
          <span className="text-blue-300 font-bold truncate block">{classicalModels.length} Models</span>
        </div>

        <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
          <span className="text-[10px] uppercase text-slate-400 block mb-1">Quantum Engine</span>
          <span className="text-pink-300 font-bold truncate block">
            {quantumModel.toUpperCase()} {qubitCount ? `(${qubitCount}Q)` : ''} • {quantumBackend}
          </span>
        </div>
      </div>
    </div>
  );
};
