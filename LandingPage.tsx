import React from 'react';
import { Play, History, Sparkles, CheckCircle2, ChevronRight, Zap, Award, Layers } from 'lucide-react';
import { VisualWorkflow } from '../components/VisualWorkflow';
import type { ExperimentSummary } from '../types';

interface LandingPageProps {
  onStartBenchmark: () => void;
  onViewHistory: () => void;
  onRunDemo: () => void;
  onSelectExperiment: (exp: ExperimentSummary) => void;
  experiments: ExperimentSummary[];
  loadingDemo: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartBenchmark,
  onViewHistory,
  onRunDemo,
  onSelectExperiment,
  experiments,
  loadingDemo,
}) => {
  const totalExperiments = experiments.length;
  const uniqueDatasets = new Set(experiments.map((e) => e.dataset_name)).size || 4;

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border border-slate-800 p-8 sm:p-12 shadow-2xl">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-48 bg-gradient-to-b from-cyan-500/10 via-purple-500/5 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>RESEARCH GRADE QUANTUM VS CLASSICAL BENCHMARKING</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 font-mono">
              Q-Bench
            </span>
          </h1>

          <h2 className="text-xl sm:text-2xl font-semibold text-slate-200 max-w-2xl mx-auto">
            Fair, Reproducible Benchmarking of Quantum and Classical Machine Learning
          </h2>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Compare Quantum Machine Learning (QML) and Classical Machine Learning (CML) under identical experimental conditions:
            same dataset, same preprocessing, same train/test split, and standardized evaluation metrics.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={onStartBenchmark}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/25 transition-all duration-200 hover:scale-[1.02]"
            >
              <Play className="w-4 h-4 fill-white" />
              Start Benchmark
            </button>

            <button
              onClick={onRunDemo}
              disabled={loadingDemo}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-purple-950/70 hover:bg-purple-900/80 text-purple-200 border border-purple-500/40 font-semibold text-sm transition-all duration-200 hover:scale-[1.02] disabled:opacity-50"
            >
              <Zap className="w-4 h-4 text-purple-400" />
              {loadingDemo ? 'Running Live Demo...' : 'Demo Benchmark (Iris)'}
            </button>

            <button
              onClick={onViewHistory}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-700 font-semibold text-sm transition-all duration-200 hover:scale-[1.02]"
            >
              <History className="w-4 h-4 text-slate-400" />
              View Previous Experiments
            </button>
          </div>

          {/* Core Principle Banner */}
          <div className="pt-6">
            <div className="inline-block p-3 px-5 rounded-xl bg-slate-900/90 border border-cyan-500/20 text-xs sm:text-sm font-mono text-cyan-200">
              <span className="text-slate-400">Core Principle: </span>
              <span className="font-semibold text-cyan-300">
                Same Dataset + Same Preprocessing + Same Train/Test Split + Same Evaluation Metrics = Fair Comparison
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Pipeline Diagram */}
      <VisualWorkflow />

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase font-mono">Total Experiments</span>
            <Layers className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{totalExperiments}</div>
          <div className="text-[11px] text-slate-400 mt-1">Recorded in SQLite storage</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase font-mono">Datasets Tested</span>
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{uniqueDatasets}</div>
          <div className="text-[11px] text-slate-400 mt-1">Iris, Breast Cancer, Wine, Digits</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase font-mono">Quantum Models</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">VQC</div>
          <div className="text-[11px] text-slate-400 mt-1">ZZFeatureMap + RealAmplitudes</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase font-mono">Classical Models</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">3 Models</div>
          <div className="text-[11px] text-slate-400 mt-1">Logistic Reg, SVM, Random Forest</div>
        </div>
      </div>

      {/* Why Q-Bench Section */}
      <section className="bg-slate-900/40 border border-slate-800 rounded-2xl p-8 backdrop-blur-sm">
        <div className="max-w-3xl">
          <h3 className="text-2xl font-bold text-white mb-3">Why Q-Bench?</h3>
          <p className="text-slate-300 text-base leading-relaxed mb-6">
            Q-Bench provides a standardized environment for reproducible comparison between Quantum Machine Learning
            and Classical Machine Learning. In typical academic literature, quantum algorithms are tested with unique
            subsamplings, non-standard feature scalers, or disparate validation splits that make comparison with classical
            baselines biased or misleading.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <h4 className="font-semibold text-cyan-300 text-sm mb-1 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                The Problem
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Researchers frequently report quantum results without identical baseline splits, using different
                dimensionality reductions or selective subsets that obscure true algorithmic efficiency.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <h4 className="font-semibold text-indigo-300 text-sm mb-1 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                The Solution
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Q-Bench guarantees that both Quantum VQC and Classical SVM/LR/RF receive the exact same train/test split,
                identical PCA components, and microsecond-calibrated timing metrics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Experiments Preview */}
      {experiments.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <History className="w-5 h-5 text-cyan-400" />
              Recent Experiments
            </h3>
            <button
              onClick={onViewHistory}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono"
            >
              View All ({experiments.length}) <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-mono">
                  <tr>
                    <th className="p-3.5">Timestamp</th>
                    <th className="p-3.5">Dataset</th>
                    <th className="p-3.5">Models Evaluated</th>
                    <th className="p-3.5">Best Accuracy</th>
                    <th className="p-3.5">Fastest Training</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {experiments.slice(0, 4).map((exp) => (
                    <tr key={exp.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5 text-slate-300 whitespace-nowrap">{exp.timestamp}</td>
                      <td className="p-3.5 text-cyan-300 font-bold capitalize">{exp.dataset_name}</td>
                      <td className="p-3.5 text-slate-300">{exp.models_evaluated.length} Models</td>
                      <td className="p-3.5 text-emerald-400">{exp.best_accuracy_model}</td>
                      <td className="p-3.5 text-indigo-400">{exp.fastest_train_model}</td>
                      <td className="p-3.5 text-right whitespace-nowrap">
                        <button
                          onClick={() => onSelectExperiment(exp)}
                          className="px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/40 font-semibold"
                        >
                          View Results
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
