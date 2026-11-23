import React, { useState } from 'react';
import { AIAgent, Industry } from '../types';
import { INDUSTRY_ACTIONS } from '../constants/defaultData';
import { X, Plane, Plus } from 'lucide-react';

interface RegisterAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (agent: AIAgent) => void;
  industry: Industry;
}

export const RegisterAgentModal: React.FC<RegisterAgentModalProps> = ({
  isOpen,
  onClose,
  onRegister,
  industry,
}) => {
  const generateAgentId = () => {
    const rand = Math.floor(100 + Math.random() * 900);
    return `AGT-${rand}-SKY`;
  };

  const [agentName, setAgentName] = useState('');
  const [agentId, setAgentId] = useState(generateAgentId());
  const [customerId, setCustomerId] = useState('PAX-90412');
  const [provider, setProvider] = useState('');
  const [description, setDescription] = useState('');
  const [permissions, setPermissions] = useState<string[]>(['view_fares', 'book_flight']);
  const [maxLimit, setMaxLimit] = useState(50000);

  if (!isOpen) return null;

  const actions = INDUSTRY_ACTIONS[industry] || INDUSTRY_ACTIONS.AIRLINE;

  const handleTogglePermission = (actionCode: string) => {
    if (permissions.includes(actionCode)) {
      setPermissions(permissions.filter(p => p !== actionCode));
    } else {
      setPermissions([...permissions, actionCode]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAgent: AIAgent = {
      id: agentId.trim().toUpperCase(),
      name: agentName.trim(),
      customerId: customerId.trim(),
      provider: provider.trim() || 'Independent AI Travel Assistant',
      description: description.trim() || 'Autonomous flight booking and travel concierge agent',
      permissions,
      status: 'ACTIVE',
      maxDailyLimit: maxLimit,
      registeredAt: new Date().toISOString(),
    };

    onRegister(newAgent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-xl rounded-2xl bg-[#111827] border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
              <Plane className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Register Airline AI Agent</h3>
              <p className="text-xs text-slate-400">Authorize third-party travel agent credentials and booking scopes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto text-xs">
          {/* Agent Name & ID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                AI Travel Agent Name
              </label>
              <input
                type="text"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                placeholder="e.g. AeroFly Booking Copilot"
                className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Generated Agent ID
              </label>
              <input
                type="text"
                value={agentId}
                onChange={(e) => setAgentId(e.target.value)}
                className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 font-mono text-white focus:outline-none focus:border-sky-500"
                required
              />
            </div>
          </div>

          {/* Passenger ID & Provider */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Passenger / Customer ID
              </label>
              <input
                type="text"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                placeholder="e.g. PAX-90412"
                className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Agent Provider / Developer
              </label>
              <input
                type="text"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                placeholder="e.g. Amadeus, Navitaire, or TripActions AI"
                className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Purpose & Flight Service Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Automated flight booking and schedule re-timing on behalf of passenger"
              className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-white focus:outline-none focus:border-sky-500"
              required
            />
          </div>

          {/* Permissions Multiselect */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Authorized Flight Actions
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {actions.map((act) => {
                const isChecked = permissions.includes(act.code);
                return (
                  <label
                    key={act.code}
                    className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                      isChecked
                        ? 'bg-sky-600/15 border-sky-500/40 text-sky-200'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleTogglePermission(act.code)}
                      className="mt-0.5 rounded border-slate-700 text-sky-600 focus:ring-0"
                    />
                    <div>
                      <div className="font-semibold text-white flex items-center gap-1.5">
                        {act.label}
                        {act.isReadOnly && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-normal">
                            Read-Only
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 line-clamp-1">{act.defaultDescription}</div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Daily Limit */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Max Daily Flight Spending Limit (INR)
            </label>
            <input
              type="number"
              value={maxLimit}
              onChange={(e) => setMaxLimit(Number(e.target.value))}
              className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 font-mono text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Footer Actions */}
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
              className="px-5 py-2 rounded-lg text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-lg shadow-sky-600/20 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Register Agent
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
