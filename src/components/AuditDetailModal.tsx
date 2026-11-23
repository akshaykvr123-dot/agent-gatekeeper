import React from 'react';
import { AuditLogEntry } from '../types';
import { X, Copy, Check, ShieldAlert } from 'lucide-react';
import { DecisionBadge } from './DecisionBadge';

interface AuditDetailModalProps {
  entry: AuditLogEntry | null;
  onClose: () => void;
}

export const AuditDetailModal: React.FC<AuditDetailModalProps> = ({ entry, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!entry) return null;

  const copyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(entry, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-2xl rounded-2xl bg-[#111827] border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-800 text-slate-300">
              <ShieldAlert className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-mono">{entry.id}</h3>
                <DecisionBadge decision={entry.decision} size="sm" />
              </div>
              <p className="text-xs text-slate-400">Airline Security Decision Audit Record</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Key metadata grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block mb-1">Timestamp</span>
              <span className="font-mono text-slate-200">
                {new Date(entry.timestamp).toLocaleString()}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block mb-1">Passenger ID</span>
              <span className="font-mono font-bold text-white">{entry.customerId}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block mb-1">AI Agent</span>
              <span className="font-mono font-bold text-sky-400 truncate block">
                {entry.agentId}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block mb-1">Fare Amount</span>
              <span className="font-mono font-bold text-amber-400">
                {entry.amount > 0 ? `${entry.currency} ${entry.amount.toLocaleString()}` : '0 (Read-Only)'}
              </span>
            </div>
          </div>

          {/* Rule Details */}
          <div className="p-4 rounded-xl bg-sky-950/20 border border-sky-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400">
                Rule Responsible
              </span>
              <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 font-mono text-[11px] border border-sky-500/20">
                Rule #{entry.ruleNumber}
              </span>
            </div>
            <div className="text-sm font-semibold text-white">{entry.ruleName}</div>
            <p className="text-xs text-slate-300 leading-relaxed">{entry.reason}</p>
          </div>

          {/* Request Description */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block mb-1">Flight Operation Description / Itinerary</span>
            <div className="text-slate-200 font-mono text-xs">
              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-sky-300 mr-2 uppercase text-[10px]">
                {entry.action}
              </span>
              {entry.description}
            </div>
          </div>

          {/* Full JSON Payload */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Audit Record JSON Payload
              </span>
              <button
                onClick={copyJson}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied' : 'Copy JSON'}
              </button>
            </div>
            <pre className="p-3.5 rounded-xl bg-[#0A0E17] border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-48">
              {JSON.stringify(entry, null, 2)}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 px-6 py-3.5 bg-slate-900/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
