'use client';

import React from 'react';
import { Play, ArrowUpRight, Layers } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  isTransferring: boolean;
  executionMode: 'loopback' | 'crosstab';
  setExecutionMode: (mode: 'loopback' | 'crosstab') => void;
  onRunTransfer: () => void;
}

export default function Header({ activeTab, isTransferring, executionMode, setExecutionMode, onRunTransfer }: HeaderProps) {
  return (
    <header className="h-16 border-b border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-[#0c0a09]/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-20">
      {/* Left Title & Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <h1 className="text-sm font-semibold tracking-tight text-stone-900 dark:text-stone-100 capitalize">
            {activeTab} Workspace
          </h1>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-800">
          <Layers className="w-3 h-3 text-amber-500" />
          Swarm Cluster v2.4 (3 Peers)
        </span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Segmented Control */}
        <div className="flex items-center p-0.5 rounded-lg bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs font-medium">
          <button
            onClick={() => setExecutionMode('loopback')}
            className={`px-3 py-1 rounded-md transition-all ${
              executionMode === 'loopback'
                ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-sm font-semibold'
                : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            Loopback
          </button>
          <button
            onClick={() => setExecutionMode('crosstab')}
            className={`px-3 py-1 rounded-md transition-all ${
              executionMode === 'crosstab'
                ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-sm font-semibold'
                : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            Crosstab
          </button>
        </div>

        {/* Action Button */}
        <button
          onClick={onRunTransfer}
          disabled={isTransferring}
          className="px-4 py-1.5 rounded-lg text-xs font-medium bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-stone-200 transition-all flex items-center gap-2 disabled:opacity-50 shadow-sm"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{isTransferring ? 'Broadcasting...' : 'Run Transfer'}</span>
        </button>
      </div>
    </header>
  );
}