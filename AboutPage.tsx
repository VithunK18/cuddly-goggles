import React from 'react';
import { 
  ShieldCheck, Atom, Cpu, CheckCircle2, AlertTriangle, 
  Layers, GitCompare, BookOpen 
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-10 pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono">
          <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
          <span>METHODOLOGY & SCIENTIFIC PRINCIPLES</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          About Q-Bench Platform
        </h2>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
          Standardizing the empirical evaluation of Quantum Machine Learning against Classical Baselines.
        </p>
      </div>

      {/* The Core Problem & Solution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-rose-400">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-bold text-base text-white">The Problem</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            In modern literature, comparing Quantum Machine Learning (QML) and Classical Machine Learning (CML) is
            plagued by inconsistent evaluation protocols. Researchers frequently:
          </p>
          <ul className="space-y-1.5 text-xs text-slate-400 list-disc list-inside">
            <li>Subsample datasets arbitrarily for quantum simulators without applying identical subsets to classical baselines.</li>
            <li>Apply non-standard normalization or angle scalers exclusively to quantum circuits.</li>
            <li>Use different train/test splits, different random seeds, or disparate performance metrics.</li>
            <li>Compare un-optimized classical baselines against heavily tuned quantum circuits, producing biased conclusions.</li>
          </ul>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-cyan-400">
            <CheckCircle2 className="w-5 h-5" />
            <h3 className="font-bold text-base text-white">The Q-Bench Solution</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Q-Bench establishes an automated, deterministic benchmarking harness enforcing strict experimental parity:
          </p>
          <ul className="space-y-1.5 text-xs text-slate-400 list-disc list-inside">
            <li><strong className="text-slate-200">Same Dataset:</strong> Standardized multi-domain tabular benchmarks (Iris, Cancer, Wine, Digits, Custom).</li>
            <li><strong className="text-slate-200">Same Preprocessing:</strong> StandardScaler and aligned PCA reduction.</li>
            <li><strong className="text-slate-200">Same Split:</strong> Stratified sampling with locked random seed across all models.</li>
            <li><strong className="text-slate-200">Unified Metrics:</strong> Accuracy, Weighted F1, Precision, Recall, and microsecond-level timing.</li>
          </ul>
        </div>
      </div>

      {/* Core Principle Banner */}
      <div className="bg-gradient-to-r from-cyan-950/60 via-slate-900 to-purple-950/60 border-2 border-cyan-500/40 rounded-2xl p-6 text-center space-y-2 shadow-xl">
        <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold block">
          Foundational Axiom
        </span>
        <div className="text-base sm:text-lg font-bold text-white font-mono">
          Same Dataset + Same Preprocessing + Same Train/Test Split + Same Evaluation Metrics = Fair Comparison
        </div>
        <p className="text-xs text-slate-400 max-w-xl mx-auto">
          Q-Bench does not artificially claim Quantum Advantage. We report the authentic, empirical measurements of the algorithms under test.
        </p>
      </div>

      {/* Key Benefits Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
          Key Platform Capabilities & Benefits
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: 'Fair Comparison',
              desc: 'Enforces exact identical boundary conditions, eliminating data leakage and bias.',
              icon: GitCompare,
              color: 'text-cyan-400',
            },
            {
              title: '100% Reproducibility',
              desc: 'Every run records seeds, splits, library versions, and quantum backend states in SQLite.',
              icon: ShieldCheck,
              color: 'text-emerald-400',
            },
            {
              title: 'Automated Benchmarking',
              desc: 'One-click execution of entire classical ML suites and parameterized quantum circuits.',
              icon: Cpu,
              color: 'text-indigo-400',
            },
            {
              title: 'Transparent Metrics',
              desc: 'Microsecond training and inference timers alongside multi-class classification scores.',
              icon: Layers,
              color: 'text-purple-400',
            },
            {
              title: 'Quantum Circuit Analysis',
              desc: 'Inspects qubit counts, circuit depths, gate breakdowns (H, CX, RZ, RY), and ASCII layout.',
              icon: Atom,
              color: 'text-pink-400',
            },
            {
              title: 'Experiment Archive',
              desc: 'Persists all historic runs with instant CSV and JSON export capabilities for reporting.',
              icon: BookOpen,
              color: 'text-teal-400',
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-2">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${item.color}`} />
                  <h4 className="font-semibold text-slate-200 text-xs">{item.title}</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Technical Foundations: QML vs CML */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Atom className="w-5 h-5 text-purple-400" />
          Technical Foundations of Variational Quantum Classification (VQC)
        </h3>

        <div className="text-xs sm:text-sm text-slate-300 space-y-3 leading-relaxed">
          <p>
            A <strong>Variational Quantum Classifier (VQC)</strong> operates as a hybrid quantum-classical algorithm:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-slate-400 pl-2">
            <li>
              <strong className="text-slate-200">Quantum Feature Mapping (ZZFeatureMap):</strong> Classical feature vectors{' '}
              <code className="text-cyan-300 font-mono text-[11px] bg-slate-950 px-1 py-0.5 rounded">x</code> are encoded into a{' '}
              <span className="text-cyan-300">2^n</span>-dimensional Hilbert space through parameterized single-qubit rotations{' '}
              <code className="text-cyan-300 font-mono text-[11px] bg-slate-950 px-1 py-0.5 rounded">H, RZ</code> and two-qubit entangling gates{' '}
              <code className="text-cyan-300 font-mono text-[11px] bg-slate-950 px-1 py-0.5 rounded">CX</code>.
            </li>
            <li>
              <strong className="text-slate-200">Parameterized Ansatz (RealAmplitudes):</strong> A variational circuit parameterized by{' '}
              <code className="text-purple-300 font-mono text-[11px] bg-slate-950 px-1 py-0.5 rounded">θ</code> applies trainable unitary transformations{' '}
              <code className="text-purple-300 font-mono text-[11px] bg-slate-950 px-1 py-0.5 rounded">U(θ)</code> to explore the Hilbert space.
            </li>
            <li>
              <strong className="text-slate-200">Expectation Measurement:</strong> Parity observables{' '}
              <code className="text-indigo-300 font-mono text-[11px] bg-slate-950 px-1 py-0.5 rounded">⟨Z_0 ⊗ ... ⊗ Z_{'{'}n-1{'}'}⟩</code> are measured from statevectors.
            </li>
            <li>
              <strong className="text-slate-200">Classical Optimization (COBYLA):</strong> A classical gradient-free optimizer updates{' '}
              <code className="text-purple-300 font-mono text-[11px] bg-slate-950 px-1 py-0.5 rounded">θ</code> iteratively to minimize classification loss.
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};
