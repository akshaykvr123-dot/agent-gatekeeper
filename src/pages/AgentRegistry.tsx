import React, { useState } from 'react';
import { AIAgent, Industry } from '../types';
import { 
  Users, 
  UserPlus, 
  Search, 
  UserX, 
  Edit2,
  Eye,
  Plane
} from 'lucide-react';

interface AgentRegistryProps {
  agents: AIAgent[];
  industry: Industry;
  onOpenRegisterModal: () => void;
  onOpenRevokeModal: (agent: AIAgent) => void;
  onUpdateAgent: (agent: AIAgent) => void;
}

export const AgentRegistry: React.FC<AgentRegistryProps> = ({
  agents,
  industry: _industry,
  onOpenRegisterModal,
  onOpenRevokeModal,
  onUpdateAgent,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'REVOKED'>('ALL');
  const [selectedAgentDetails, setSelectedAgentDetails] = useState<AIAgent | null>(null);
  const [editingAgent, setEditingAgent] = useState<AIAgent | null>(null);

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch = 
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.customerId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || agent.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCount = agents.filter(a => a.status === 'ACTIVE').length;
  const revokedCount = agents.filter(a => a.status === 'REVOKED').length;

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAgent) {
      onUpdateAgent(editingAgent);
      setEditingAgent(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Plane className="w-6 h-6 text-sky-400" />
            Airline AI Agent Registry
          </h2>
          <p className="text-xs text-slate-400">
            Registered third-party autonomous travel agents authorized to execute flight booking and fare queries.
          </p>
        </div>

        <button
          onClick={onOpenRegisterModal}
          className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-lg shadow-sky-600/30 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          Register New Travel Agent
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-[#111827] border border-slate-800 p-4 rounded-xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, agent ID, or passenger ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              statusFilter === 'ALL'
                ? 'bg-sky-600/20 text-sky-400 border border-sky-500/40'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            All ({agents.length})
          </button>
          <button
            onClick={() => setStatusFilter('ACTIVE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              statusFilter === 'ACTIVE'
                ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/40'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            Active ({activeCount})
          </button>
          <button
            onClick={() => setStatusFilter('REVOKED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              statusFilter === 'REVOKED'
                ? 'bg-rose-600/20 text-rose-400 border border-rose-500/40'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            Revoked ({revokedCount})
          </button>
        </div>
      </div>

      {/* Agents Table */}
      <div className="rounded-2xl bg-[#111827] border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="px-6 py-3.5">Agent Identity</th>
                <th className="px-6 py-3.5">Passenger ID</th>
                <th className="px-6 py-3.5">Provider / Owner</th>
                <th className="px-6 py-3.5">Permissions Scope</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredAgents.map((agent) => {
                const isActive = agent.status === 'ACTIVE';

                return (
                  <tr key={agent.id} className="hover:bg-slate-850/50 transition-colors">
                    {/* Identity */}
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-bold text-white flex items-center gap-2">
                          {agent.name}
                        </div>
                        <div className="font-mono text-[11px] text-sky-400 flex items-center gap-1 mt-0.5">
                          {agent.id}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-1 max-w-xs">
                          {agent.description}
                        </p>
                      </div>
                    </td>

                    {/* Passenger */}
                    <td className="px-6 py-4 font-mono font-medium text-slate-300">
                      {agent.customerId}
                    </td>

                    {/* Provider */}
                    <td className="px-6 py-4 text-slate-300">
                      {agent.provider}
                    </td>

                    {/* Permissions */}
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {agent.permissions.map((p) => (
                          <span
                            key={p}
                            className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono text-[10px]"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          isActive
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        }`}
                      >
                        {isActive ? (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            ACTIVE
                          </>
                        ) : (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                            REVOKED
                          </>
                        )}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Details button */}
                        <button
                          onClick={() => setSelectedAgentDetails(agent)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Edit permitted attributes */}
                        <button
                          onClick={() => setEditingAgent({ ...agent })}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="Edit Agent Attributes"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Revoke button if active */}
                        {isActive ? (
                          <button
                            onClick={() => onOpenRevokeModal(agent)}
                            className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold text-[11px] transition-colors flex items-center gap-1"
                          >
                            <UserX className="w-3 h-3" />
                            Revoke
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">
                            Revoked
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredAgents.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No travel agents matched your search or filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Agent Details Modal */}
      {selectedAgentDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-[#111827] border border-slate-700 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">{selectedAgentDetails.name}</h3>
                <span className="font-mono text-xs text-sky-400">{selectedAgentDetails.id}</span>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                  selectedAgentDetails.status === 'ACTIVE'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                }`}
              >
                {selectedAgentDetails.status}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block mb-0.5">Description</span>
                <p className="text-slate-200">{selectedAgentDetails.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block mb-0.5">Passenger ID</span>
                  <span className="font-mono text-white font-bold">{selectedAgentDetails.customerId}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block mb-0.5">Provider / Owner</span>
                  <span className="text-white font-medium">{selectedAgentDetails.provider}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block mb-1">Granted Flight Permissions</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedAgentDetails.permissions.map(p => (
                    <span key={p} className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20 font-mono text-[11px]">
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block mb-0.5">Registration Timestamp</span>
                <span className="font-mono text-slate-300">
                  {new Date(selectedAgentDetails.registeredAt).toLocaleString()}
                </span>
              </div>

              {selectedAgentDetails.status === 'REVOKED' && (
                <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-900/40 space-y-1">
                  <span className="text-rose-400 font-bold block text-[11px]">Revocation Record</span>
                  <div className="text-slate-300">
                    Revoked on: <span className="font-mono text-white">{new Date(selectedAgentDetails.revokedAt || '').toLocaleString()}</span>
                  </div>
                  <div className="text-slate-300">
                    Revoked by: <span className="text-white font-semibold">{selectedAgentDetails.revokedBy}</span>
                  </div>
                  <div className="text-slate-400 text-[11px] pt-1">
                    Reason: {selectedAgentDetails.revocationReason}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedAgentDetails(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Agent Modal */}
      {editingAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-[#111827] border border-slate-700 p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Edit Agent Attributes</h3>
            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Agent Name</label>
                <input
                  type="text"
                  value={editingAgent.name}
                  onChange={(e) => setEditingAgent({ ...editingAgent, name: e.target.value })}
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Description</label>
                <input
                  type="text"
                  value={editingAgent.description}
                  onChange={(e) => setEditingAgent({ ...editingAgent, description: e.target.value })}
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Provider / Owner</label>
                <input
                  type="text"
                  value={editingAgent.provider}
                  onChange={(e) => setEditingAgent({ ...editingAgent, provider: e.target.value })}
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-white"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingAgent(null)}
                  className="px-3 py-1.5 rounded-lg text-slate-400 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
