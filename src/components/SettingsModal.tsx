import React, { useState } from 'react';
import { StudentConfig } from '../types';
import { X, Plane, User, CreditCard, ShieldAlert, Check } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: StudentConfig;
  onSave: (config: StudentConfig) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave,
}) => {
  const [formData, setFormData] = useState<StudentConfig>({ ...config });
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      industry: 'AIRLINE',
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-xl rounded-2xl bg-[#111827] border border-slate-700/80 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
              <Plane className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Airline Settings & Student Information</h2>
              <p className="text-xs text-slate-400">Configure airline carrier identity, student enrolment, and booking limits</p>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Academic Enrolment Rule Alert */}
          <div className="rounded-xl p-3.5 bg-sky-950/30 border border-sky-800/40 text-xs text-sky-300">
            <div className="font-semibold text-sky-200 mb-1 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-sky-400" />
              Academic Airline Scenario Configuration
            </div>
            Assigned Industry: <span className="font-bold text-white uppercase tracking-wider">AIRLINE</span> (Last digit: 0-3).
            Autonomous agent operations include flight fare lookup, ticket reservations, itinerary changes, and refunds.
          </div>

          {/* Student Name & Enrolment Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Student Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  placeholder="e.g. Candidate / Student"
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                  required
                />
                <User className="absolute right-3 top-2.5 w-4 h-4 text-slate-500" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Enrolment Number
              </label>
              <input
                type="text"
                value={formData.enrolmentNumber}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  enrolmentNumber: e.target.value,
                  isCustomEnrolment: e.target.value !== 'ENR-2024-0182' && e.target.value.length > 0 
                })}
                placeholder="e.g. ENR-2024-0182"
                className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-sky-500"
                required
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                {formData.isCustomEnrolment ? 'Custom enrolment saved' : 'Using editable academic placeholder (digit 0-3 for Airline)'}
              </span>
            </div>
          </div>

          {/* Airline Name & Currency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Configurable Airline Name
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="e.g. Air India, IndiGo, Delta Air Lines"
                className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                required
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Real airline carrier name
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Default Currency
              </label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
              >
                <option value="INR">INR (₹) - Indian Rupee (Default)</option>
                <option value="USD">USD ($) - US Dollar</option>
                <option value="EUR">EUR (€) - Euro</option>
                <option value="GBP">GBP (£) - British Pound</option>
              </select>
            </div>
          </div>

          {/* Flight Booking Spending Limit */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-slate-300">
                Autonomous Flight Booking Spending Limit (Rule #5)
              </label>
              <span className="text-xs font-mono font-bold text-amber-400">
                {formData.currency} {formData.transactionThreshold.toLocaleString()}
              </span>
            </div>
            <div className="relative">
              <input
                type="number"
                min="500"
                step="500"
                value={formData.transactionThreshold}
                onChange={(e) => setFormData({ ...formData, transactionThreshold: Number(e.target.value) })}
                className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-sky-500"
                required
              />
              <CreditCard className="absolute right-3 top-2.5 w-4 h-4 text-slate-500" />
            </div>
            <p className="mt-1.5 text-[11px] text-slate-400 italic">
              "The booking limit balances convenience for routine automated flight reservations with additional customer protection for high-value flights and premium seats."
            </p>
          </div>

          {/* Project Title */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Project Header Title
            </label>
            <input
              type="text"
              value={formData.projectTitle}
              onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
              className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-lg shadow-sky-600/20 transition-all flex items-center gap-1.5"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  Saved!
                </>
              ) : (
                'Save Airline Settings'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
