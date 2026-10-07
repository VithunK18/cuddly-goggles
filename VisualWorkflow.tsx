import React from 'react';
import { Database, Sliders, Cpu, BarChart2, GitCompare, ArrowRight } from 'lucide-react';

export const VisualWorkflow: React.FC = () => {
  const steps = [
    {
      title: 'Dataset Input',
      desc: 'Standardized or Custom CSV',
      icon: Database,
      badge: 'Step 1',
      color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/40 text-blue-400',
    },
    {
      title: 'Preprocessing',
      desc: 'StandardScaler + PCA Reduction',
      icon: Sliders,
      badge: 'Step 2',
      color: 'from-cyan-500/20 to-teal-500/20 border-cyan-500/40 text-cyan-400',
    },
    {
      title: 'Parallel Models',
      desc: 'Quantum VQC & Classical Suite',
      icon: Cpu,
      badge: 'Step 3',
      color: 'from-purple-500/20 to-indigo-500/20 border-purple-500/40 text-purple-400',
    },
    {
      title: 'Unified Metrics',
      desc: 'Accuracy, F1, Train & Infer Latency',
      icon: BarChart2,
      badge: 'Step 4',
      color: 'from-indigo-500/20 to-pink-500/20 border-indigo-500/40 text-indigo-400',
    },
    {
      title: 'Fair Comparison',
      desc: 'Objective Empirical Evaluation',
      icon: GitCompare,
      badge: 'Step 5',
      color: 'from-emerald-500/20 to-cyan-500/20 border-emerald-500/40 text-emerald-400',
    },
  ];

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            Unified Benchmarking Pipeline
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Strict fairness enforced across preprocessing, training splits, and evaluation metrics
          </p>
        </div>
        <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-800 text-cyan-300 border border-slate-700">
          Identical Conditions Paradigm
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div key={idx} className="relative group">
              <div className={`p-4 rounded-xl border bg-gradient-to-b ${step.color} transition-all duration-300 group-hover:scale-[1.02] h-full flex flex-col justify-between`}>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-mono font-bold px-1.5 py-0.5 rounded bg-slate-950/60 border border-slate-800">
                      {step.badge}
                    </span>
                    <Icon className="w-5 h-5 opacity-90" />
                  </div>
                  <h4 className="font-semibold text-slate-100 text-sm mb-1">{step.title}</h4>
                  <p className="text-xs text-slate-300/80 leading-relaxed">{step.desc}</p>
                </div>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-slate-600">
                  <ArrowRight className="w-4 h-4 text-cyan-400/60" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
