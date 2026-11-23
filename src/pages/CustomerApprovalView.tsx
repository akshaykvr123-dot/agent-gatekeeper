import React, { useState } from 'react';
import { PendingApproval, StudentConfig } from '../types';
import { 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  ShieldAlert, 
  Check, 
  Ban,
  Plane
} from 'lucide-react';

interface CustomerApprovalViewProps {
  approvals: PendingApproval[];
  config: StudentConfig;
  onResolve: (id: string, status: 'APPROVED' | 'REJECTED', resolvedBy: string, notes?: string) => void;
}

export const CustomerApprovalView: React.FC<CustomerApprovalViewProps> = ({
  approvals,
  config,
  onResolve,
}) => {
  const [activeTab, setActiveTab] = useState<'PENDING' | 'RESOLVED'>('PENDING');
  const [resolutionNotes, setResolutionNotes] = useState<Record<string, string>>({});

  const pendingList = approvals.filter(a => a.status === 'PENDING');
  const resolvedList = approvals.filter(a => a.status !== 'PENDING');

  const handleApprove = (id: string) => {
    const notes = resolutionNotes[id] || 'Passenger authorized flight operation via airline security verification';
    onResolve(id, 'APPROVED', 'Passenger (Simulated Verification)', notes);
  };

  const handleReject = (id: string) => {
    const notes = resolutionNotes[id] || 'Passenger declined flight operation authorization';
    onResolve(id, 'REJECTED', 'Passenger (Simulated Verification)', notes);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <CheckCircle className="w-6 h-6 text-amber-400" />
          Passenger Authorization Queue (Simulated)
        </h2>
        <p className="text-xs text-slate-400">
          Manual customer sign-off workflow triggered when flight bookings exceed autonomous limits (Rule 5) or refund claims are initiated (Rule 7).
        </p>
      </div>

      {/* Mandatory Academic Disclaimer */}
      <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-900/40 flex items-start gap-3.5">
        <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div className="space-y-1 text-xs">
          <h4 className="font-bold text-white text-sm">
            Academic Simulation Environment Notice
          </h4>
          <p className="text-amber-200/90 leading-relaxed">
            This interface simulates an out-of-band passenger authorization step (such as an airline mobile app push alert, SMS OTP, or email confirmation).
            <strong> This is a local simulation; no real airline flight booking, ticket issuance, or monetary refund is executed.</strong>
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('PENDING')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
            activeTab === 'PENDING'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
          }`}
        >
          <span>Pending Authorizations</span>
          <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 text-[10px] font-extrabold">
            {pendingList.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('RESOLVED')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
            activeTab === 'RESOLVED'
              ? 'bg-sky-600/20 text-sky-300 border border-sky-500/40'
              : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
          }`}
        >
          <span>Resolved History</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300 text-[10px] font-mono">
            {resolvedList.length}
          </span>
        </button>
      </div>

      {/* Content depending on tab */}
      {activeTab === 'PENDING' ? (
        <div className="space-y-4">
          {pendingList.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-[#111827] border border-amber-500/30 p-6 shadow-xl space-y-4 animate-in fade-in"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">
                        Passenger Authorization Escalation
                      </h3>
                      <span className="text-[10px] font-mono text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-900/50">
                        {item.id}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Rule #{item.decisionResult.ruleNumber} triggered: {item.decisionResult.ruleName}
                    </p>
                  </div>
                </div>

                <div className="text-right font-mono text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5 inline mr-1" />
                  {new Date(item.createdAt).toLocaleTimeString()}
                </div>
              </div>

              {/* Request Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block mb-0.5">Requesting Agent</span>
                  <div className="font-bold text-sky-400">{item.agent.name}</div>
                  <div className="font-mono text-[10px] text-slate-400">{item.agent.id}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block mb-0.5">Passenger ID</span>
                  <div className="font-mono font-bold text-white">{item.request.customerId}</div>
                  <div className="text-[10px] text-slate-400">{config.companyName}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block mb-0.5">Flight Sector / Action</span>
                  <div className="font-mono font-bold text-slate-200 uppercase">{item.request.action}</div>
                  <div className="text-[10px] text-sky-300 truncate">{item.request.route || item.request.flightNumber || 'Scheduled Route'}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block mb-0.5">Fare / Amount</span>
                  <div className="font-mono text-base font-bold text-amber-400">
                    {item.request.currency} {item.request.amount.toLocaleString()}
                  </div>
                  {item.request.action === 'book_flight' && item.request.amount > config.transactionThreshold && (
                    <div className="text-[10px] text-rose-400 font-mono">
                      +{(item.request.amount - config.transactionThreshold).toLocaleString()} over booking limit
                    </div>
                  )}
                </div>
              </div>

              {/* Decision Explanation */}
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
                <strong className="text-white">Airline Policy Evaluation:</strong> {item.decisionResult.explanation}
              </div>

              {/* Optional verification notes input */}
              <div>
                <input
                  type="text"
                  placeholder="Optional passenger verification notes (e.g. Passenger confirmed itinerary change via app)..."
                  value={resolutionNotes[item.id] || ''}
                  onChange={(e) => setResolutionNotes({ ...resolutionNotes, [item.id]: e.target.value })}
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => handleReject(item.id)}
                  className="px-4 py-2 rounded-xl bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Ban className="w-4 h-4" />
                  REJECT Flight Operation
                </button>
                <button
                  onClick={() => handleApprove(item.id)}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  APPROVE & Authorize Flight Action
                </button>
              </div>
            </div>
          ))}

          {pendingList.length === 0 && (
            <div className="p-12 text-center rounded-2xl bg-[#111827] border border-slate-800 space-y-2 text-xs">
              <CheckCircle className="w-10 h-10 mx-auto text-emerald-500 stroke-[1.5]" />
              <div className="font-bold text-white text-sm">All Clear! No Pending Passenger Authorizations</div>
              <p className="text-slate-400">
                Flight bookings exceeding the {config.currency} {config.transactionThreshold.toLocaleString()} limit or refund requests will appear here for customer authorization.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Resolved List */
        <div className="rounded-2xl bg-[#111827] border border-slate-800 overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="px-6 py-3.5">Resolved At</th>
                <th className="px-6 py-3.5">Verdict</th>
                <th className="px-6 py-3.5">AI Agent & Passenger</th>
                <th className="px-6 py-3.5">Fare Amount</th>
                <th className="px-6 py-3.5">Resolved By & Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {resolvedList.map((item) => (
                <tr key={item.id} className="hover:bg-slate-850/50">
                  <td className="px-6 py-4 font-mono text-[11px] text-slate-400">
                    {item.resolvedAt ? new Date(item.resolvedAt).toLocaleString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        item.status === 'APPROVED'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-white">{item.agent.name}</div>
                    <div className="font-mono text-[10px] text-slate-400">
                      {item.agent.id} · {item.request.customerId}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-amber-400">
                    {item.request.currency} {item.request.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-slate-300">
                    <div>{item.resolvedBy}</div>
                    {item.notes && <p className="text-[11px] text-slate-400 italic mt-0.5">{item.notes}</p>}
                  </td>
                </tr>
              ))}

              {resolvedList.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    No resolved authorizations recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
