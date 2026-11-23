import React, { useState } from 'react';
import { AIAgent } from '../types';
import { X, AlertTriangle, ShieldX } from 'lucide-react';

interface RevocationModalProps {
  agent: AIAgent | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (agentId: string, revokedBy: string, reason: string) => void;
}

export const RevocationModal: React.FC<RevocationModalProps> = ({
  agent,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [revokedBy, setRevokedBy] = useState('Passenger Security Console');
  const [reason, setReason] = useState('Passenger initiated access revocation via airline security console');

  if (!isOpen || !agent) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(agent.id, revokedBy, reason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg rounded-2xl bg-[#111827] border border-rose-500/40 shadow-2xl shadow-rose-950/40 overflow-hidden">
        {/* Warning Banner Header */}
        <div className="flex items-center justify-between border-b border-rose-900/30 px-6 py-4 bg-rose-950/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
              <ShieldX className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Revoke Airline AI Agent Permission</h3>
              <p className="text-xs text-rose-300">Permanent flight reservation access termination</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Target Agent Card */}
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">{agent.name}</span>
              <span className="font-mono text-[11px] text-sky-400">{agent.id}</span>
            </div>
            <p className="text-xs text-slate-400">{agent.description}</p>
            <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-800 flex items-center justify-between">
              <span>Passenger ID: {agent.customerId}</span>
              <span>Registered: {new Date(agent.registeredAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Security Alert */}
          <div className="rounded-xl p-3 bg-amber-950/20 border border-amber-800/40 text-xs text-amber-200/90 flex gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Notice:</strong> Once revoked, this AI agent will be permanently blocked by Rule 2.
              The agent cannot be reactivated silently, and an immutable audit log entry will be recorded immediately.
            </div>
          </div>

          {/* Revoked By */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Revocation Initiator / Authority
            </label>
            <input
              type="text"
              value={revokedBy}
              onChange={(e) => setRevokedBy(e.target.value)}
              placeholder="e.g. Passenger Security Console"
              className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              required
            />
          </div>

          {/* Revocation Reason */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Specific Revocation Reason
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Repeated unauthorized flight modification attempts detected"
              className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500 resize-none"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-900/30 transition-all flex items-center gap-1.5"
            >
              <ShieldX className="w-4 h-4" />
              Confirm Revocation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
