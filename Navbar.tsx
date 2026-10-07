import React from 'react';
import { Cpu, Atom, History, BarChart3, Info, Play } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  systemHealth: {
    status: string;
    qiskit_available: boolean;
    quantum_engine: string;
  } | null;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, systemHealth }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'setup', label: 'New Benchmark', icon: Play },
    { id: 'results', label: 'Results', icon: Cpu },
    { id: 'history', label: 'Experiment History', icon: History },
    { id: 'about', label: 'About Q-Bench', icon: Info },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-cyan-500/20 shadow-lg shadow-cyan-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Branding */}
          <div 
            onClick={() => setActiveTab('dashboard')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-purple-600 p-[1px] shadow-md shadow-cyan-500/30 group-hover:shadow-cyan-400/50 transition-all duration-300">
              <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center">
                <Atom className="w-6 h-6 text-cyan-400 animate-[spin_12s_linear_infinite]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 font-mono">
                  Q-BENCH
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-widest px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-500/30">
                  v1.0 RESEARCH
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Quantum vs Classical Machine Learning Platform
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span className="hidden md:inline">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Engine Health Status Badge */}
          <div className="hidden lg:flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  systemHealth?.status === 'healthy' ? 'bg-cyan-400' : 'bg-amber-400'
                }`} />
                <span className={`relative inline-flex rounded-full h-2 w-2 ${
                  systemHealth?.status === 'healthy' ? 'bg-cyan-500' : 'bg-amber-500'
                }`} />
              </span>
              <span className="font-mono text-[11px] text-slate-300">
                {systemHealth?.qiskit_available ? 'Qiskit Simulator' : 'Quantum State Sim'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
