import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { SetupPage } from './pages/SetupPage';
import { ResultsPage } from './pages/ResultsPage';
import { HistoryPage } from './pages/HistoryPage';
import { AboutPage } from './pages/AboutPage';
import type { 
  BenchmarkRequest, BenchmarkResponse, ExperimentSummary, DatasetOption 
} from './types';
import { 
  getHealth, getExperiments, getAvailableDatasets, runBenchmark 
} from './services/api';
import { AlertCircle, X } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [systemHealth, setSystemHealth] = useState<{
    status: string;
    python_version: string;
    qiskit_available: boolean;
    quantum_engine: string;
  } | null>(null);

  const [experiments, setExperiments] = useState<ExperimentSummary[]>([]);
  const [availableDatasets, setAvailableDatasets] = useState<DatasetOption[]>([]);
  const [currentBenchmark, setCurrentBenchmark] = useState<BenchmarkResponse | null>(null);

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [benchmarkStep, setBenchmarkStep] = useState<string>('');
  const [loadingDemo, setLoadingDemo] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchHealthAndData = async () => {
    try {
      const health = await getHealth();
      setSystemHealth(health);
    } catch {
      // Backend may be starting up
    }

    try {
      const exps = await getExperiments();
      setExperiments(exps);
    } catch {
      // Handled gracefully
    }

    try {
      const ds = await getAvailableDatasets();
      setAvailableDatasets(ds);
    } catch {
      // Handled gracefully
    }
  };

  useEffect(() => {
    fetchHealthAndData();
    const interval = setInterval(fetchHealthAndData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleRunBenchmark = async (request: BenchmarkRequest) => {
    setIsRunning(true);
    setErrorMessage(null);
    setBenchmarkStep('1/4: Standardizing Preprocessing & PCA Reduction...');

    try {
      const stepTimer1 = setTimeout(() => {
        setBenchmarkStep('2/4: Training Classical Suite (LR, SVM, RF)...');
      }, 1000);

      const stepTimer2 = setTimeout(() => {
        setBenchmarkStep('3/4: Simulating Variational Quantum Circuit (VQC)...');
      }, 2500);

      const stepTimer3 = setTimeout(() => {
        setBenchmarkStep('4/4: Computing Unified Evaluation & Fair Analysis...');
      }, 6000);

      const res = await runBenchmark(request);

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);

      setCurrentBenchmark(res);
      await fetchHealthAndData();
      setActiveTab('results');
    } catch (err: any) {
      setErrorMessage(err.message || 'Benchmark execution failed.');
    } finally {
      setIsRunning(false);
      setBenchmarkStep('');
    }
  };

  const handleRunDemo = async () => {
    setLoadingDemo(true);
    await handleRunBenchmark({
      dataset: 'iris',
      test_size: 0.2,
      random_seed: 42,
      classical_models: ['logistic_regression', 'svm', 'random_forest'],
      quantum_model: 'vqc',
      n_qubits: 4,
      use_pca: true,
      max_quantum_samples: 70,
    });
    setLoadingDemo(false);
  };

  const handleSelectExperiment = (exp: ExperimentSummary) => {
    setCurrentBenchmark(exp.full_results);
    setActiveTab('results');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        systemHealth={systemHealth}
      />

      {/* Global Error Banner */}
      {errorMessage && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-rose-950/80 border border-rose-500/50 text-rose-200 px-4 py-3 rounded-2xl flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="p-1 hover:bg-rose-900 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'dashboard' && (
          <LandingPage
            onStartBenchmark={() => setActiveTab('setup')}
            onViewHistory={() => setActiveTab('history')}
            onRunDemo={handleRunDemo}
            onSelectExperiment={handleSelectExperiment}
            experiments={experiments}
            loadingDemo={loadingDemo || isRunning}
          />
        )}

        {activeTab === 'setup' && (
          <SetupPage
            onRunBenchmark={handleRunBenchmark}
            isRunning={isRunning}
            benchmarkStep={benchmarkStep}
            availableDatasets={availableDatasets}
            onRefreshDatasets={fetchHealthAndData}
          />
        )}

        {activeTab === 'results' && (
          currentBenchmark ? (
            <ResultsPage
              benchmark={currentBenchmark}
              onBackToSetup={() => setActiveTab('setup')}
            />
          ) : (
            <div className="text-center py-20 bg-slate-900/40 border border-slate-800 rounded-3xl p-8 space-y-4">
              <p className="text-slate-400 text-sm">No benchmark results currently loaded.</p>
              <button
                onClick={() => setActiveTab('setup')}
                className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-all"
              >
                Configure New Benchmark
              </button>
            </div>
          )
        )}

        {activeTab === 'history' && (
          <HistoryPage
            experiments={experiments}
            onSelectExperiment={handleSelectExperiment}
            onRefresh={fetchHealthAndData}
          />
        )}

        {activeTab === 'about' && <AboutPage />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 mt-20 py-8 text-center text-xs text-slate-500 font-mono">
        <p>Q-Bench • Quantum vs Classical Machine Learning Fair Benchmarking Platform</p>
        <p className="mt-1 text-slate-600">Built with React, Vite, Tailwind CSS, FastAPI, scikit-learn & Qiskit Simulator</p>
      </footer>
    </div>
  );
}

export default App;
