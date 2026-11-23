import React, { useState } from 'react';
import { AIAgent } from '../types';
import { UserX, ShieldAlert, Search, ArrowRight, Plane } from 'lucide-react';

interface RevocationHubProps {
  agents: AIAgent[];
  onOpenRevokeModal: (agent: AIAgent) => void;
  onNavigate: (tab: any) => void;
}

export const RevocationHub: React.FC<RevocationHubProps> = ({
  agents,
  onOpenRevokeModal,
  onNavigate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const activeAgents = agents.filter(a => a.status === 'ACTIVE');
  const revokedAgents = agents.filter(a => a.status === 'REVOKED');

  const filteredActive = activeAgents.filter(
    a => a.name.toLowerCase().includes(searchTerm.toLowerCase()) || a.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <UserX className="w-6 h-6 text-rose-400" />
          Airline AI Agent Revocation Center
        </h2>
        <p className="text-xs text-slate-400">
          Enforce immediate and permanent access termination for compromised, suspicious, or deprecated flight booking agents.
        </p>
      </div>

      {/* Security Guarantee Notice */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/30 to-slate-900 border border-rose-900/40 flex items-start gap-3.5">
        <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 shrink-0 mt-0.5">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div className="space-y-1 text-xs">
          <h4 className="font-bold text-white text-sm">
            Zero-Tolerance Revocation Enforcement (Rule 2)
          </h4>
          <p className="text-slate-300 leading-relaxed">
            When access is revoked, the agent's flight reservation authorization is terminated immediately.
            Any subsequent request from this agent is deterministically blocked by <strong>Rule 2 (Revoked Agent Block)</strong>,
            recorded with an immutable security audit event, and cannot be silently reactivated.
          </p>
        </div>
      </div>

      {/* Two columns: Active agents ready to revoke | Revoked agents history */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Active Agents (Eligible for Revocation) */}
        <div className="rounded-2xl bg-[#111827] border border-slate-800 p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white">Active Authorized Travel Agents</h3>
              <p className="text-xs text-slate-400">Select an agent to initiate the flight access revocation protocol</p>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/30">
              {activeAgents.length} Active
            </span>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Filter active travel agents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* List */}
          <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
            {filteredActive.map((agent) => (
              <div
                key={agent.id}
                className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="font-bold text-white flex items-center gap-2">
                    {agent.name}
                    <span className="text-[10px] font-mono text-sky-400">{agent.id}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{agent.description}</p>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Provider: {agent.provider} · Passenger: {agent.customerId}
                  </div>
                </div>

                <button
                  onClick={() => onOpenRevokeModal(agent)}
                  className="px-3 py-1.5 rounded-lg bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 border border-rose-500/30 font-bold text-xs transition-colors shrink-0 flex items-center gap-1.5 shadow-sm"
                >
                  <UserX className="w-3.5 h-3.5" />
                  Revoke Access
                </button>
              </div>
            ))}

            {filteredActive.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-500">
                No active travel agents match your search.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Revoked Agents Audit History */}
        <div className="rounded-2xl bg-[#111827] border border-slate-800 p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white">Revoked Travel Agents History</h3>
              <p className="text-xs text-slate-400">Permanent record of invalidated agent booking identities</p>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 text-xs font-mono font-bold border border-rose-500/30">
              {revokedAgents.length} Revoked
            </span>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {revokedAgents.map((agent) => (
              <div
                key={agent.id}
                className="p-4 rounded-xl bg-slate-900/90 border border-rose-950/40 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-200 flex items-center gap-2">
                    <span className="line-through text-slate-400">{agent.name}</span>
                    <span className="font-mono text-[10px] text-rose-400 bg-rose-950/40 px-1.5 py-0.5 rounded border border-rose-900/50">
                      {agent.id}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30">
                    BLOCKED
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-900/30 text-[11px] space-y-1 text-slate-300">
                  <div className="flex items-center justify-between text-rose-300">
                    <span className="font-semibold">Revocation Timestamp:</span>
                    <span className="font-mono">
                      {agent.revokedAt ? new Date(agent.revokedAt).toLocaleString() : 'Recorded'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Initiator:</span>{' '}
                    <span className="font-semibold text-white">{agent.revokedBy || 'Passenger'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Reason:</span>{' '}
                    <span className="italic text-slate-300">{agent.revocationReason || 'Manual passenger termination'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Enforcement: Rule #2</span>
                  <button
                    onClick={() => onNavigate('gatekeeper')}
                    className="text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1"
                  >
                    Test Block in Gatekeeper <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}

            {revokedAgents.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-500">
                No revoked agents yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
