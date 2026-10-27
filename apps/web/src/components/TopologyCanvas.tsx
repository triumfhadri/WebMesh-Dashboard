'use client';

import React, { useState } from 'react';
import { Globe, Server, ArrowRight, Shield, Activity, Database } from 'lucide-react';

interface PeerNode {
  id: string;
  name: string;
  location: string;
  code: string;
  ip: string;
  latency: string;
  role: string;
  status: 'active' | 'syncing';
}

export default function TopologyCanvas() {
  const [selectedPeer, setSelectedPeer] = useState<string>('node-us');

  const nodes: PeerNode[] = [
    { id: 'node-local', name: 'Local Client', location: 'Localhost', code: '🏠', ip: '127.0.0.1', latency: '0ms', role: 'Coordinator', status: 'active' },
    { id: 'node-us', name: 'Peer Alpha', location: 'US-East (Virginia)', code: '🇺🇸', ip: '198.51.100.24', latency: '38ms', role: 'Edge Relay', status: 'active' },
    { id: 'node-eu', name: 'Peer Beta', location: 'EU-Central (Frankfurt)', code: '🇩🇪', ip: '203.0.113.42', latency: '14ms', role: 'Storage Shard', status: 'active' },
    { id: 'node-ap', name: 'Peer Gamma', location: 'AP-South (Singapore)', code: '🇸🇬', ip: '192.0.2.88', latency: '182ms', role: 'Gateway', status: 'syncing' },
  ];

  return (
    <div className="bg-white dark:bg-[#0c0a09] border border-stone-200 dark:border-stone-800 rounded-2xl p-6 space-y-6 shadow-sm">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 dark:border-stone-900 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-600 dark:text-amber-400 mb-1">
            <Activity className="w-3.5 h-3.5" />
            <span>P2P MESH TOPOLOGY</span>
          </div>
          <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100 tracking-tight">
            Cluster Infrastructure & Regional Nodes
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-stone-500 bg-stone-50 dark:bg-stone-900 px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-800">
          <Shield className="w-3.5 h-3.5 text-emerald-500" />
          <span>Encrypted Mesh Active</span>
        </div>
      </div>

      {/* Nodes Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {nodes.map((node) => {
          const isSelected = selectedPeer === node.id;
          return (
            <div
              key={node.id}
              onClick={() => setSelectedPeer(node.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                isSelected
                  ? 'border-amber-500/50 bg-amber-50/30 dark:bg-amber-950/10 shadow-sm'
                  : 'border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50 hover:border-stone-300 dark:hover:border-stone-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{node.code}</span>
                  <div>
                    <h3 className="text-xs font-semibold text-stone-900 dark:text-stone-100">{node.name}</h3>
                    <p className="text-[11px] text-stone-500">{node.location}</p>
                  </div>
                </div>
                <span
                  className={`w-2 h-2 rounded-full ${
                    node.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
                  }`}
                />
              </div>

              <div className="space-y-1.5 pt-2 border-t border-stone-200/60 dark:border-stone-800 text-[11px] font-mono text-stone-600 dark:text-stone-400">
                <div className="flex justify-between">
                  <span>IP:</span>
                  <span className="text-stone-900 dark:text-stone-200">{node.ip}</span>
                </div>
                <div className="flex justify-between">
                  <span>Latency:</span>
                  <span className="text-stone-900 dark:text-stone-200">{node.latency}</span>
                </div>
                <div className="flex justify-between">
                  <span>Role:</span>
                  <span className="text-amber-600 dark:text-amber-400">{node.role}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}