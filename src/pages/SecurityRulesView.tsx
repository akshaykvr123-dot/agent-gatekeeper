import React, { useState } from 'react';
import { SecurityRule, StudentConfig } from '../types';
import { SlidersHorizontal, CreditCard, AlertCircle, Edit3, Check, Save, Plane } from 'lucide-react';

interface SecurityRulesViewProps {
  rules: SecurityRule[];
  config: StudentConfig;
  onUpdateRules: (rules: SecurityRule[]) => void;
  onUpdateThreshold: (threshold: number) => void;
}

export const SecurityRulesView: React.FC<SecurityRulesViewProps> = ({
  rules,
  config,
  onUpdateRules,
  onUpdateThreshold,
}) => {
  const [localThreshold, setLocalThreshold] = useState(config.transactionThreshold);
  const [editingRuleId, setEditingRuleId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleStartEdit = (rule: SecurityRule) => {
    setEditingRuleId(rule.id);
    setEditName(rule.name);
    setEditDesc(rule.description);
  };

  const handleSaveRule = (id: number) => {
    const updated = rules.map(r => r.id === id ? { ...r, name: editName, description: editDesc } : r);
    onUpdateRules(updated);
    setEditingRuleId(null);
  };

  const handleApplyThreshold = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateThreshold(localThreshold);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <SlidersHorizontal className="w-6 h-6 text-sky-400" />
          Airline Security Rules Matrix & Booking Policy
        </h2>
        <p className="text-xs text-slate-400">
          Deterministic 8-rule priority hierarchy governing autonomous travel AI agents, flight booking limits, and passenger safety.
        </p>
      </div>

      {/* Threshold Configuration Card */}
      <div className="p-6 rounded-2xl bg-[#111827] border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4" />
              Autonomous Flight Booking Spending Limit (Rule #5 Parameter)
            </span>
            <h3 className="text-base font-bold text-white">
              Current Booking Limit: {config.currency} {config.transactionThreshold.toLocaleString()}
            </h3>
          </div>

          <form onSubmit={handleApplyThreshold} className="flex items-center gap-2">
            <div className="relative">
              <input
                type="number"
                min="500"
                step="500"
                value={localThreshold}
                onChange={(e) => setLocalThreshold(Number(e.target.value))}
                className="w-40 rounded-lg bg-slate-900 border border-slate-700 px-3 py-1.5 text-xs font-mono font-bold text-white focus:outline-none focus:border-amber-500"
              />
              <span className="absolute right-2.5 top-2 text-[10px] text-slate-400 font-mono">
                {config.currency}
              </span>
            </div>
            <button
              type="submit"
              className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1 shadow-sm"
            >
              {savedSuccess ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
              {savedSuccess ? 'Updated' : 'Update'}
            </button>
          </form>
        </div>

        {/* Academic Rationale Quote */}
        <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-900/40 text-xs text-amber-200/90 italic flex items-center gap-3">
          <div className="p-1.5 rounded bg-amber-500/20 text-amber-400 shrink-0">
            <AlertCircle className="w-4 h-4" />
          </div>
          <p>
            "The booking limit balances convenience for routine automated flight reservations with additional customer protection for high-value flights and premium seats."
          </p>
        </div>
      </div>

      {/* Rules Hierarchy Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Airline Gatekeeper Rules Hierarchy
          </span>
          <span className="text-xs text-slate-400 font-mono">Strict Priority 1 → 8</span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {rules.map((rule) => {
            const isEditing = editingRuleId === rule.id;

            return (
              <div
                key={rule.id}
                className="p-4 rounded-xl bg-[#111827] border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-4 text-xs"
              >
                <div className="flex items-start gap-3.5 flex-1">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-sky-600/10 text-sky-400 border border-sky-500/30 font-mono font-bold text-xs mt-0.5">
                    #{rule.id}
                  </div>

                  <div className="space-y-1.5 flex-1">
                    {isEditing ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full rounded bg-slate-900 border border-slate-700 px-2 py-1 text-xs text-white"
                        />
                        <textarea
                          rows={2}
                          value={editDesc}
                          onChange={(e) => setEditDesc(e.target.value)}
                          className="w-full rounded bg-slate-900 border border-slate-700 px-2 py-1 text-xs text-white resize-none"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveRule(rule.id)}
                            className="px-2.5 py-1 rounded bg-sky-600 text-white font-bold text-[11px]"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingRuleId(null)}
                            className="px-2.5 py-1 rounded bg-slate-800 text-slate-400 text-[11px]"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-sm">
                            {rule.name}
                          </h4>
                          <span className="font-mono text-[10px] text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                            {rule.code}
                          </span>
                        </div>
                        <p className="text-slate-300 leading-relaxed max-w-3xl">
                          {rule.description}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-start">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold border font-mono ${
                      rule.severity === 'HIGH'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        : rule.severity === 'MEDIUM'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                    }`}
                  >
                    {rule.severity} RISK
                  </span>

                  {!isEditing && (
                    <button
                      onClick={() => handleStartEdit(rule)}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                      title="Edit rule text"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
