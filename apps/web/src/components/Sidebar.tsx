'use client';

import React from 'react';
import { Layers, Radio, Shield, Activity, Terminal, BookOpen, Network, Sun, Moon, Image as ImageIcon, Cpu } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
}

export default function Sidebar({ activeTab, setActiveTab, theme, setTheme }: SidebarProps) {
  const menuItems = [
    { id: 'swarm', label: '64-Block Swarm Matrix', icon: Layers },
    { id: 'topology', label: 'Interactive Topology', icon: Network },
    { id: 'assets', label: 'Architecture Gallery', icon: ImageIcon },
    { id: 'wireshark', label: 'Wireshark Packet Log', icon: Radio },
    { id: 'security', label: 'WebCrypto AES-GCM', icon: Shield },
    { id: 'impairment', label: 'Impairments & Bench', icon: Activity },
    { id: 'cli', label: 'Cyber CLI Terminal', icon: Terminal },
    { id: 'specs', label: 'STAR Portfolio Specs', icon: BookOpen },
  ];

  return (
    <aside className="w-72 bg-[var(--bg-surface)] border-r border-[var(--border-color)] p-6 flex flex-col justify-between select-none">
      {/* Top Brand & Theme Toggle */}
      <div>
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[var(--accent)] flex items-center justify-center text-white font-bold shadow-sm">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h1 className="font-bold tracking-tight text-[var(--text-main)] text-sm leading-none">WebMesh</h1>
              <span className="text-[10px] text-[var(--text-muted)] font-mono tracking-wider mt-1 block">Example</span>
            </div>
          </div>
          
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-600" />}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[var(--accent)] text-white shadow-sm font-semibold'
                    : 'text-[var(--text-muted)] hover:bg-[var(--bg-primary)] hover:text-[var(--text-main)]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[var(--text-muted)]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer System Status Widget */}
      <div className="pt-4 border-t border-[var(--border-color)]">
        <div className="p-3.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-[var(--text-muted)] uppercase tracking-wider">Node Security</span>
            <span className="flex items-center gap-1 text-emerald-500 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Secure
            </span>
          </div>
          <div className="w-full bg-[var(--border-color)] rounded-full h-1 overflow-hidden">
            <div className="bg-[var(--accent)] h-full w-[85%]" />
          </div>
        </div>
      </div>
    </aside>
  );
}