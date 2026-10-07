import React, { useState, useRef } from 'react';
import { 
  Play, Upload, Sliders, Atom, Sparkles, CheckSquare, 
  Square, RefreshCw, AlertCircle, CheckCircle2 
} from 'lucide-react';
import type { BenchmarkRequest, DatasetOption } from '../types';
import { JudgeConfigBadge } from '../components/JudgeConfigBadge';
import { uploadDataset } from '../services/api';

interface SetupPageProps {
  onRunBenchmark: (request: BenchmarkRequest) => void;
  isRunning: boolean;
  benchmarkStep: string;
  availableDatasets: DatasetOption[];
  onRefreshDatasets: () => void;
}

export const SetupPage: React.FC<SetupPageProps> = ({
  onRunBenchmark,
  isRunning,
  benchmarkStep,
  availableDatasets,
  onRefreshDatasets,
}) => {
  const [selectedDataset, setSelectedDataset] = useState<string>('iris');
  const [testSize, setTestSize] = useState<number>(0.2);
  const [randomSeed, setRandomSeed] = useState<number>(42);
  const [selectedClassical, setSelectedClassical] = useState<string[]>([
    'logistic_regression',
    'svm',
    'random_forest',
  ]);
  const [quantumModel] = useState<string>('vqc');
  const [nQubits, setNQubits] = useState<number>(4);
  const [usePca, setUsePca] = useState<boolean>(true);
  const [maxQuantumSamples, setMaxQuantumSamples] = useState<number>(70);

  // Upload state
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const predefinedDatasets = [
    {
      id: 'iris',
      name: 'Iris Flower',
      samples: 150,
      features: 4,
      classes: '3 Classes',
      desc: 'Classic benchmark measuring Sepal & Petal dimensions. Fast & clean.',
    },
    {
      id: 'breast_cancer',
      name: 'Breast Cancer Wisconsin',
      samples: 569,
      features: 30,
      classes: '2 Classes (Binary)',
      desc: 'High-dimensional cellular features. Ideal for evaluating PCA reduction.',
    },
    {
      id: 'wine',
      name: 'Wine Recognition',
      samples: 178,
      features: 13,
      classes: '3 Cultivars',
      desc: 'Chemical analysis of Italian wines with rich non-linear boundaries.',
    },
    {
      id: 'digits',
      name: 'Optical Digits (0 vs 1)',
      samples: 360,
      features: 64,
      classes: '2 Classes (Binary)',
      desc: 'High-dimensional pixel intensities. Tested with 4-qubit feature mapping.',
    },
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const res = await uploadDataset(file);
      setUploadSuccess(`Uploaded "${res.filename}" with ${res.columns.length} columns.`);
      onRefreshDatasets();
      setSelectedDataset(res.filename);
    } catch (err: any) {
      setUploadError(err.message || 'File upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const toggleClassicalModel = (modelKey: string) => {
    if (selectedClassical.includes(modelKey)) {
      if (selectedClassical.length === 1) return; // Keep at least one
      setSelectedClassical(selectedClassical.filter((m) => m !== modelKey));
    } else {
      setSelectedClassical([...selectedClassical, modelKey]);
    }
  };

  const handleRun = () => {
    onRunBenchmark({
      dataset: selectedDataset,
      test_size: testSize,
      random_seed: randomSeed,
      classical_models: selectedClassical,
      quantum_model: quantumModel,
      n_qubits: nQubits,
      use_pca: usePca,
      max_quantum_samples: maxQuantumSamples,
    });
  };

  const handleDemoPreset = () => {
    setSelectedDataset('iris');
    setTestSize(0.2);
    setRandomSeed(42);
    setSelectedClassical(['logistic_regression', 'svm', 'random_forest']);
    setNQubits(4);
    setUsePca(true);
    setMaxQuantumSamples(70);

    onRunBenchmark({
      dataset: 'iris',
      test_size: 0.2,
      random_seed: 42,
      classical_models: ['logistic_regression', 'svm', 'random_forest'],
      quantum_model: 'vqc',
      n_qubits: 4,
      use_pca: true,
      max_quantum_samples: 70,
    });
  };

  const getSplitLabel = (val: number) => {
    const train = Math.round((1 - val) * 100);
    const test = Math.round(val * 100);
    return `${train}% / ${test}%`;
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
            <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
              <Sliders className="w-6 h-6" />
            </span>
            Benchmark Setup & Configuration
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Configure standardized dataset preprocessing, feature mappings, and model candidates
          </p>
        </div>

        {/* Demo Benchmark Quick Button */}
        <button
          onClick={handleDemoPreset}
          disabled={isRunning}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-500/50 text-purple-200 text-xs sm:text-sm font-semibold transition-all shadow-md shadow-purple-950/40 hover:scale-[1.02] disabled:opacity-50 self-start md:self-auto"
        >
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>Demo Benchmark (Instant Iris)</span>
        </button>
      </div>

      {/* Judge-Friendly Live Configuration Card */}
      <JudgeConfigBadge
        dataset={selectedDataset}
        trainTestSplit={getSplitLabel(testSize)}
        randomSeed={randomSeed}
        preprocessing={usePca ? `StandardScaler + PCA (${nQubits}Q)` : 'StandardScaler (Direct)'}
        classicalModels={selectedClassical}
        quantumModel="VQC"
        quantumBackend="Statevector Simulator"
        qubitCount={nQubits}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Dataset Selection & Upload */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Dataset Selection */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                1. Select Benchmark Dataset
              </h3>
              <span className="text-xs text-slate-400 font-mono">Standardized Input</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {predefinedDatasets.map((ds) => {
                const isSelected = selectedDataset === ds.id;
                return (
                  <div
                    key={ds.id}
                    onClick={() => setSelectedDataset(ds.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 relative ${
                      isSelected
                        ? 'bg-gradient-to-br from-cyan-950/70 to-slate-900 border-cyan-500/70 shadow-md shadow-cyan-950/40 ring-1 ring-cyan-500/50'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/40'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <h4 className="font-semibold text-slate-100 text-sm">{ds.name}</h4>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-2 font-mono text-[11px] text-cyan-300">
                      <span>{ds.samples} samples</span>
                      <span>•</span>
                      <span>{ds.features} features</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {ds.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Custom Uploaded Datasets List */}
            {availableDatasets.filter((d) => d.id.endsWith('.csv')).length > 0 && (
              <div className="pt-2">
                <span className="text-xs uppercase font-mono text-slate-400 block mb-2">
                  Uploaded Datasets
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {availableDatasets
                    .filter((d) => d.id.endsWith('.csv'))
                    .map((d) => {
                      const isSelected = selectedDataset === d.id;
                      return (
                        <div
                          key={d.id}
                          onClick={() => setSelectedDataset(d.id)}
                          className={`p-3 rounded-xl border cursor-pointer font-mono text-xs flex items-center justify-between ${
                            isSelected
                              ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200'
                              : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <span className="truncate">{d.name}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400 ml-2" />}
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* CSV File Upload Box */}
            <div className="pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-300">Upload Custom CSV</span>
                <span className="text-[11px] text-slate-400 font-mono">Last column = Label</span>
              </div>

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-700 hover:border-cyan-500/50 rounded-xl p-4 text-center cursor-pointer transition-all bg-slate-950/40 hover:bg-slate-900/40"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".csv"
                  className="hidden"
                />
                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                <p className="text-xs text-slate-300 font-medium">
                  {isUploading ? 'Uploading file...' : 'Click or drag a CSV file to upload'}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Supports numeric features and binary or multiclass labels
                </p>
              </div>

              {uploadSuccess && (
                <div className="mt-2 text-xs text-emerald-400 bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-500/30 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{uploadSuccess}</span>
                </div>
              )}

              {uploadError && (
                <div className="mt-2 text-xs text-rose-400 bg-rose-950/40 p-2.5 rounded-lg border border-rose-500/30 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{uploadError}</span>
                </div>
              )}
            </div>
          </div>

          {/* Card 2: Experimental Boundary & Fairness Controls */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm shadow-xl space-y-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
              2. Experimental Controls & Fairness Conditions
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Test Size Split */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2 font-mono">
                  Train / Test Split Ratio
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[0.2, 0.25, 0.3].map((val) => (
                    <button
                      key={val}
                      onClick={() => setTestSize(val)}
                      className={`py-2 px-3 rounded-xl text-xs font-mono font-semibold border transition-all ${
                        testSize === val
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 shadow-sm shadow-cyan-950'
                          : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {getSplitLabel(val)}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5">
                  Stratified sampling guarantees identical class balance across both models.
                </p>
              </div>

              {/* Random Seed */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-300 font-mono">
                    Random Seed (Reproducibility)
                  </label>
                  <button
                    onClick={() => setRandomSeed(Math.floor(Math.random() * 900) + 100)}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono"
                  >
                    <RefreshCw className="w-3 h-3" /> Randomize
                  </button>
                </div>
                <input
                  type="number"
                  value={randomSeed}
                  onChange={(e) => setRandomSeed(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2 text-sm text-white font-mono outline-none transition-colors"
                />
                <p className="text-[11px] text-slate-500 mt-1.5">
                  Locked seed ensures 100% deterministic reproducibility.
                </p>
              </div>
            </div>

            {/* PCA & Qubit Match Toggle */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-200 text-xs flex items-center gap-2">
                  <span>PCA Feature Alignment for Quantum Parity</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                    Recommended
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Applies Principal Component Analysis so classical and quantum models evaluate identical dimensions.
                </p>
              </div>
              <input
                type="checkbox"
                checked={usePca}
                onChange={(e) => setUsePca(e.target.checked)}
                className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-400 bg-slate-900 border-slate-700 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Model Selection & Execution Center */}
        <div className="space-y-6">
          {/* Card 3: Model Selection */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm shadow-xl space-y-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400"></span>
              3. Model Selection
            </h3>

            {/* Quantum Model */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-mono text-slate-400">Quantum ML Model</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30">
                  Simulation
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-gradient-to-r from-purple-950/40 to-slate-950 border border-purple-500/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Atom className="w-5 h-5 text-purple-400" />
                    <div>
                      <h4 className="font-semibold text-white text-xs">Variational Quantum Classifier</h4>
                      <p className="text-[11px] text-slate-400">ZZFeatureMap + RealAmplitudes</p>
                    </div>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-purple-400" />
                </div>
              </div>

              {/* Qubit Count Selector */}
              <div className="pt-2">
                <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
                  <span className="text-slate-300">Quantum Qubits / Features:</span>
                  <span className="text-cyan-400 font-bold">{nQubits} Qubits ({Math.pow(2, nQubits)} Hilbert states)</span>
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {[2, 3, 4, 5, 6].map((q) => (
                    <button
                      key={q}
                      onClick={() => setNQubits(q)}
                      className={`py-1.5 rounded-lg text-xs font-mono font-bold border transition-all ${
                        nQubits === q
                          ? 'bg-purple-600/30 border-purple-500 text-purple-200'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {q}Q
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5">
                  Quantum statevector simulation complexity scales as O(2^n).
                </p>
              </div>

              {/* Sample Subsampling for Quantum Responsiveness */}
              <div className="pt-2">
                <div className="flex items-center justify-between text-xs mb-1 font-mono">
                  <span className="text-slate-300">Quantum Sample Budget:</span>
                  <span className="text-indigo-400 font-bold">{maxQuantumSamples} Samples</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="120"
                  step="10"
                  value={maxQuantumSamples}
                  onChange={(e) => setMaxQuantumSamples(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Balanced training budget ensures rapid simulation response (~5-10s).
                </p>
              </div>
            </div>

            {/* Classical ML Suite */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <span className="text-xs uppercase font-mono text-slate-400 block">
                Classical ML Models (scikit-learn)
              </span>

              <div className="space-y-2">
                {[
                  { id: 'logistic_regression', label: 'Logistic Regression', desc: 'Linear baseline' },
                  { id: 'svm', label: 'Support Vector Machine (SVM)', desc: 'RBF kernel maximum margin' },
                  { id: 'random_forest', label: 'Random Forest', desc: '100-tree ensemble' },
                ].map((item) => {
                  const isChecked = selectedClassical.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleClassicalModel(item.id)}
                      className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                        isChecked
                          ? 'bg-blue-950/40 border-blue-500/50 text-white'
                          : 'bg-slate-950/40 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-xs">{item.label}</div>
                        <div className="text-[11px] text-slate-400">{item.desc}</div>
                      </div>
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-blue-400" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-600" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action Execution Center */}
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-cyan-500/30 rounded-2xl p-6 shadow-xl space-y-4">
            <h4 className="text-xs uppercase font-mono tracking-wider text-slate-400">
              Execution Control
            </h4>

            {isRunning ? (
              <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm font-semibold text-cyan-300 font-mono">
                    {benchmarkStep || 'Running benchmark pipeline...'}
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-cyan-400 to-indigo-500 h-1.5 rounded-full animate-pulse w-3/4" />
                </div>
                <p className="text-[11px] text-slate-400">
                  Executing exact quantum circuit statevector evolution and scikit-learn models...
                </p>
              </div>
            ) : (
              <button
                onClick={handleRun}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-base shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:scale-[1.02]"
              >
                <Play className="w-5 h-5 fill-white" />
                RUN BENCHMARK
              </button>
            )}

            <p className="text-[11px] text-center text-slate-400">
              Fairness enforced: Same Data, Preprocessing, Seed & Metrics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
