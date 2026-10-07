import React, { useState } from 'react';
import { 
  History, Trash2, Eye, Download, FileText, Search, 
  Layers, RefreshCw 
} from 'lucide-react';
import type { ExperimentSummary } from '../types';
import { deleteExperiment, getExportCsvUrl, getExportJsonUrl } from '../services/api';

interface HistoryPageProps {
  experiments: ExperimentSummary[];
  onSelectExperiment: (exp: ExperimentSummary) => void;
  onRefresh: () => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  experiments,
  onSelectExperiment,
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = experiments.filter((e) =>
    e.dataset_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.best_accuracy_model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this benchmark record?')) return;
    setDeletingId(id);
    try {
      await deleteExperiment(id);
      onRefresh();
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
              <History className="w-6 h-6" />
            </span>
            Experiment History & Benchmarking Archive
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Persisted SQLite database of all previous Quantum vs Classical benchmark runs
          </p>
        </div>

        <button
          onClick={onRefresh}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Database</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex items-center gap-3 bg-slate-900/60 border border-slate-800 p-3 rounded-2xl">
        <Search className="w-4 h-4 text-slate-400 ml-2" />
        <input
          type="text"
          placeholder="Filter experiments by dataset or top model..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent text-sm text-white placeholder-slate-500 outline-none font-mono"
        />
        <span className="text-xs font-mono text-slate-400 px-3 py-1 rounded bg-slate-950 border border-slate-800 whitespace-nowrap">
          {filtered.length} of {experiments.length} Runs
        </span>
      </div>

      {/* Experiments Table or Empty State */}
      {experiments.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-3xl p-8 space-y-4">
          <Layers className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-200">No experiments recorded yet</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Run a benchmark from the "New Benchmark" page to automatically archive your results and track comparative metrics.
          </p>
        </div>
      ) : (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Experiment ID / Time</th>
                  <th className="p-3.5">Dataset</th>
                  <th className="p-3.5">Train / Test</th>
                  <th className="p-3.5">Models Evaluated</th>
                  <th className="p-3.5">Best Accuracy</th>
                  <th className="p-3.5">Fastest Train</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((exp) => (
                  <tr
                    key={exp.id}
                    onClick={() => onSelectExperiment(exp)}
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                  >
                    <td className="p-3.5">
                      <div className="font-bold text-slate-200">{exp.id.slice(0, 8)}...</div>
                      <div className="text-[10px] text-slate-500">{exp.timestamp}</div>
                    </td>
                    <td className="p-3.5">
                      <span className="font-bold text-cyan-300 capitalize">
                        {exp.dataset_name}
                      </span>
                      <div className="text-[10px] text-slate-400">
                        Seed: {exp.random_seed} • {exp.n_features} Feat
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-300">
                      {exp.train_samples} / {exp.test_samples}
                    </td>
                    <td className="p-3.5 text-slate-300">
                      <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px]">
                        {exp.models_evaluated.length} Candidates
                      </span>
                    </td>
                    <td className="p-3.5 text-emerald-400 font-semibold">
                      {exp.best_accuracy_model}
                    </td>
                    <td className="p-3.5 text-indigo-300 font-semibold">
                      {exp.fastest_train_model}
                    </td>
                    <td className="p-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onSelectExperiment(exp)}
                          title="View Full Results"
                          className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/40 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <a
                          href={getExportCsvUrl(exp.id)}
                          download
                          title="Download CSV"
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>

                        <a
                          href={getExportJsonUrl(exp.id)}
                          download
                          title="Download JSON"
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </a>

                        <button
                          onClick={(e) => handleDelete(exp.id, e)}
                          disabled={deletingId === exp.id}
                          title="Delete Experiment"
                          className="p-1.5 rounded-lg bg-rose-950/40 text-rose-400 hover:bg-rose-900/50 border border-rose-500/40 transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
