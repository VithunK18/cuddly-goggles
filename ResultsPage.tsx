import React from 'react';
import { 
  Award, Zap, Clock, ShieldCheck, Download, Printer, Cpu, 
  BarChart3, Atom, CheckCircle2, FileText, ArrowLeft, Database
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  Cell, CartesianGrid 
} from 'recharts';
import type { BenchmarkResponse } from '../types';
import { getExportCsvUrl, getExportJsonUrl } from '../services/api';

interface ResultsPageProps {
  benchmark: BenchmarkResponse;
  onBackToSetup: () => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({ benchmark, onBackToSetup }) => {
  const { dataset_info, quantum_circuit_info, results, comparison, reproducibility } = benchmark;

  // Chart data formatting
  const accuracyChartData = results.map((r) => ({
    name: r.model_name.replace('Classifier', '').replace('Classifier', '').trim(),
    accuracy: Number((r.accuracy * 100).toFixed(2)),
    f1: Number((r.f1_score * 100).toFixed(2)),
    type: r.model_type,
  }));

  const timeChartData = results.map((r) => ({
    name: r.model_name.replace('Classifier', '').trim(),
    trainTime: Number(r.train_time_sec.toFixed(4)),
    inferenceTime: Number((r.inference_time_sec * 1000).toFixed(3)), // in ms for visibility
    type: r.model_type,
  }));

  const handlePrint = () => {
    window.print();
  };

  const getAccuracyColor = (type: string) => (type === 'Quantum' ? '#c084fc' : '#38bdf8');

  return (
    <div className="space-y-8 pb-16 print:p-0">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={onBackToSetup}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-300 font-mono mb-2 transition-colors print:hidden"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Setup
          </button>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
              <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                <BarChart3 className="w-6 h-6" />
              </span>
              Benchmark Results & Scientific Evaluation
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span className="text-xs sm:text-sm text-slate-400">
              Dataset: <strong className="text-cyan-300 capitalize">{dataset_info.name}</strong> •{' '}
              Experiment ID: <span className="font-mono text-cyan-300">{benchmark.id.slice(0, 8)}</span> •{' '}
              {benchmark.timestamp}
            </span>
          </div>
        </div>

        {/* Export & Action Buttons */}
        <div className="flex items-center gap-2 print:hidden self-start sm:self-auto">
          <a
            href={getExportCsvUrl(benchmark.id)}
            download
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Download CSV</span>
          </a>

          <a
            href={getExportJsonUrl(benchmark.id)}
            download
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors shadow-sm"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            <span>Download JSON</span>
          </a>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-xs font-semibold text-cyan-300 transition-colors shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Best Accuracy */}
        <div className="bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/30 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-mono text-emerald-400 font-semibold tracking-wider">
              Best Accuracy
            </span>
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">
            {(comparison.best_accuracy_val * 100).toFixed(1)}%
          </div>
          <div className="text-xs text-slate-300 font-medium mt-1 truncate">
            {comparison.best_accuracy_model}
          </div>
        </div>

        {/* Best F1 Score */}
        <div className="bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-950 border border-cyan-500/30 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-mono text-cyan-400 font-semibold tracking-wider">
              Best F1 Score
            </span>
            <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">
            {comparison.best_f1_val.toFixed(4)}
          </div>
          <div className="text-xs text-slate-300 font-medium mt-1 truncate">
            {comparison.best_f1_model}
          </div>
        </div>

        {/* Fastest Training */}
        <div className="bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 border border-indigo-500/30 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-mono text-indigo-400 font-semibold tracking-wider">
              Fastest Training
            </span>
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">
            {comparison.fastest_train_sec < 0.001
              ? `${(comparison.fastest_train_sec * 1000).toFixed(2)} ms`
              : `${comparison.fastest_train_sec.toFixed(4)} s`}
          </div>
          <div className="text-xs text-slate-300 font-medium mt-1 truncate">
            {comparison.fastest_train_model}
          </div>
        </div>

        {/* Fastest Inference */}
        <div className="bg-gradient-to-br from-purple-950/40 via-slate-900 to-slate-950 border border-purple-500/30 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-mono text-purple-400 font-semibold tracking-wider">
              Fastest Inference
            </span>
            <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">
            {(comparison.fastest_inference_sec * 1000).toFixed(3)} ms
          </div>
          <div className="text-xs text-slate-300 font-medium mt-1 truncate">
            {comparison.fastest_inference_model}
          </div>
        </div>
      </div>

      {/* Dataset & Boundary Conditions Bar */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-400">Dataset Profile:</span>
          <span className="text-white font-bold capitalize">{dataset_info.name}</span>
          <span className="text-slate-500">({dataset_info.total_samples} samples, {dataset_info.n_features} features, {dataset_info.n_classes} classes)</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span>Split: <strong className="text-indigo-300">{dataset_info.train_samples} train / {dataset_info.test_samples} test</strong></span>
          <span>Seed: <strong className="text-purple-300">{dataset_info.random_seed}</strong></span>
          <span>Method: <strong className="text-teal-300">{dataset_info.preprocessing_method}</strong></span>
        </div>
      </div>

      {/* Scientific Analysis & Findings Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <h3 className="text-base font-bold text-white font-mono">
            Objective Scientific Analysis
          </h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
            Unbiased Empirical Assessment
          </span>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed font-sans">
          {comparison.quantum_vs_classical_analysis}
        </p>

        {comparison.key_findings.length > 0 && (
          <div className="pt-2 border-t border-slate-800/80">
            <span className="text-xs uppercase font-mono text-slate-400 block mb-2">
              Key Empirical Takeaways:
            </span>
            <ul className="space-y-1.5">
              {comparison.key_findings.map((f, i) => (
                <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Comparison Visualizations (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Accuracy & F1-Score Comparison */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              Classification Accuracy (%)
            </h4>
            <span className="text-xs font-mono text-slate-400">Higher is Better</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={accuracyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis 
                  dataKey="name" 
                  stroke="#94a3b8" 
                  fontSize={11} 
                  angle={-15} 
                  textAnchor="end" 
                  interval={0}
                />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                  formatter={(val: any) => [`${val}%`, 'Accuracy']}
                />
                <Bar dataKey="accuracy" radius={[6, 6, 0, 0]}>
                  {accuracyChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getAccuracyColor(entry.type)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 text-xs font-mono pt-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-purple-400" />
              <span className="text-slate-300">Quantum (VQC)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-cyan-400" />
              <span className="text-slate-300">Classical ML</span>
            </div>
          </div>
        </div>

        {/* Chart 2: Training Execution Time */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
              Training Duration (Seconds)
            </h4>
            <span className="text-xs font-mono text-slate-400">Lower is Faster</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeChartData} margin={{ top: 10, right: 10, left: -10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis 
                  dataKey="name" 
                  stroke="#94a3b8" 
                  fontSize={11} 
                  angle={-15} 
                  textAnchor="end" 
                  interval={0}
                />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                  formatter={(val: any) => [`${val}s`, 'Training Time']}
                />
                <Bar dataKey="trainTime" radius={[6, 6, 0, 0]}>
                  {timeChartData.map((entry, index) => (
                    <Cell key={`cell-time-${index}`} fill={entry.type === 'Quantum' ? '#a855f7' : '#6366f1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 text-xs font-mono pt-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-purple-500" />
              <span className="text-slate-300">Quantum Simulator Latency</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-indigo-500" />
              <span className="text-slate-300">Classical Optimized Compute</span>
            </div>
          </div>
        </div>
      </div>

      {/* Unified Comparison Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl space-y-0">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-cyan-400" />
              Full Experimental Metrics Comparison Table
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Direct comparison under equivalent feature dimensions and identical evaluation splits
            </p>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-cyan-300 border border-slate-700">
            {results.length} Candidates
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="p-3.5">Model</th>
                <th className="p-3.5">Type</th>
                <th className="p-3.5">Accuracy</th>
                <th className="p-3.5">Precision</th>
                <th className="p-3.5">Recall</th>
                <th className="p-3.5">F1 Score</th>
                <th className="p-3.5">Training Time</th>
                <th className="p-3.5">Inference Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {results.map((r, i) => {
                const isQuantum = r.model_type === 'Quantum';
                const isBestAcc = r.model_name === comparison.best_accuracy_model;
                return (
                  <tr
                    key={i}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      isBestAcc ? 'bg-cyan-950/20' : ''
                    }`}
                  >
                    <td className="p-3.5 font-bold text-slate-200">
                      <div className="flex items-center gap-2">
                        <span>{r.model_name}</span>
                        {isBestAcc && (
                          <span className="px-1.5 py-0.5 text-[9px] uppercase font-bold rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                            Top Acc
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                          isQuantum
                            ? 'bg-purple-950/80 text-purple-300 border border-purple-500/40'
                            : 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40'
                        }`}
                      >
                        {isQuantum ? <Atom className="w-3 h-3" /> : <Cpu className="w-3 h-3" />}
                        {r.model_type}
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-emerald-400">
                      {(r.accuracy * 100).toFixed(2)}%
                    </td>
                    <td className="p-3.5 text-slate-300">{(r.precision * 100).toFixed(2)}%</td>
                    <td className="p-3.5 text-slate-300">{(r.recall * 100).toFixed(2)}%</td>
                    <td className="p-3.5 font-bold text-cyan-300">{(r.f1_score).toFixed(4)}</td>
                    <td className="p-3.5 text-indigo-300">
                      {r.train_time_sec < 0.001
                        ? `${(r.train_time_sec * 1000).toFixed(2)} ms`
                        : `${r.train_time_sec.toFixed(4)} s`}
                    </td>
                    <td className="p-3.5 text-purple-300">
                      {(r.inference_time_sec * 1000).toFixed(3)} ms
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quantum Circuit Visualization Section */}
      {quantum_circuit_info && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/40">
                <Atom className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Quantum Circuit Architecture
                </h3>
                <p className="text-xs text-slate-400">
                  Physical parameterization and circuit topology generated by Qiskit
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="px-2.5 py-1 rounded bg-slate-950 text-cyan-300 border border-slate-800">
                Backend: {quantum_circuit_info.simulator}
              </span>
            </div>
          </div>

          {/* Circuit Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase text-slate-500 block mb-1">Qubit Count</span>
              <span className="text-purple-300 font-bold text-sm">
                {quantum_circuit_info.qubit_count} Qubits
              </span>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase text-slate-500 block mb-1">Circuit Depth</span>
              <span className="text-cyan-300 font-bold text-sm">
                {quantum_circuit_info.circuit_depth} Layers
              </span>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase text-slate-500 block mb-1">Feature Map</span>
              <span className="text-indigo-300 font-bold text-xs truncate block">
                {quantum_circuit_info.feature_map}
              </span>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase text-slate-500 block mb-1">Ansatz</span>
              <span className="text-pink-300 font-bold text-xs truncate block">
                {quantum_circuit_info.ansatz}
              </span>
            </div>
          </div>

          {/* Gate Breakdown */}
          {Object.keys(quantum_circuit_info.gate_count).length > 0 && (
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="text-slate-400">Gate Counts:</span>
              {Object.entries(quantum_circuit_info.gate_count).map(([gate, cnt]) => (
                <span
                  key={gate}
                  className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300"
                >
                  <span className="text-cyan-400 font-bold">{gate.toUpperCase()}</span>: {cnt}
                </span>
              ))}
            </div>
          )}

          {/* Formatted Circuit Representation */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
              <span>Formatted Circuit Topology (Qiskit ASCII Engine):</span>
              <span className="text-[10px] text-slate-500">Decomposed Gate Layout</span>
            </div>
            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-300/90 overflow-x-auto whitespace-pre leading-tight shadow-inner">
              {quantum_circuit_info.circuit_diagram_text}
            </pre>
          </div>
        </div>
      )}

      {/* Reproducibility Information Section */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="text-base font-bold text-white font-mono">
              Reproducibility Information
            </h3>
            <p className="text-xs text-slate-400">
              Deterministic parameters required to replicate this exact benchmarking run
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs font-mono">
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase text-slate-500 block mb-1">Dataset</span>
            <span className="text-slate-200 font-bold capitalize">{reproducibility.dataset}</span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase text-slate-500 block mb-1">Random Seed</span>
            <span className="text-purple-300 font-bold">{reproducibility.random_seed}</span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase text-slate-500 block mb-1">Train/Test Ratio</span>
            <span className="text-indigo-300 font-bold">{reproducibility.train_test_split}</span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase text-slate-500 block mb-1">Preprocessing</span>
            <span className="text-teal-300 font-bold truncate block">
              {reproducibility.preprocessing}
            </span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase text-slate-500 block mb-1">Quantum Backend</span>
            <span className="text-cyan-300 font-bold truncate block">
              {reproducibility.quantum_backend}
            </span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase text-slate-500 block mb-1">Timestamp</span>
            <span className="text-slate-400 font-bold truncate block">
              {reproducibility.timestamp.split(' ')[0]}
            </span>
          </div>
        </div>

        {/* Software Versions */}
        <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
          <span className="text-slate-500">Software Environment:</span>
          {Object.entries(reproducibility.software_versions).map(([k, v]) => (
            <span key={k}>
              <span className="text-slate-300 font-semibold">{k}:</span> {v}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
