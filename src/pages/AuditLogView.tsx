import React, { useState } from 'react';
import { AuditLogEntry, Decision } from '../types';
import { DecisionBadge } from '../components/DecisionBadge';
import { 
  FileText, 
  Search, 
  Download, 
  Eye, 
  Plane 
} from 'lucide-react';

interface AuditLogViewProps {
  logs: AuditLogEntry[];
  onSelectEntry: (entry: AuditLogEntry) => void;
  onClearLogs?: () => void;
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({
  logs,
  onSelectEntry,
  onClearLogs: _onClearLogs,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [decisionFilter, setDecisionFilter] = useState<'ALL' | Decision>('ALL');
  const [actionFilter, setActionFilter] = useState<string>('ALL');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'amount_desc'>('newest');

  // Extract unique actions for filter dropdown
  const uniqueActions = Array.from(new Set(logs.map(l => l.action))).filter(Boolean);

  // Filter & Sort
  const filteredLogs = logs
    .filter((log) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        log.id.toLowerCase().includes(q) ||
        log.agentName.toLowerCase().includes(q) ||
        log.agentId.toLowerCase().includes(q) ||
        log.customerId.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.ruleName.toLowerCase().includes(q) ||
        log.reason.toLowerCase().includes(q);

      const matchesDecision = decisionFilter === 'ALL' || log.decision === decisionFilter;
      const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;

      return matchesSearch && matchesDecision && matchesAction;
    })
    .sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      } else if (sortOrder === 'oldest') {
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      } else if (sortOrder === 'amount_desc') {
        return (b.amount || 0) - (a.amount || 0);
      }
      return 0;
    });

  // Export CSV
  const exportCsv = () => {
    const headers = ['AuditID', 'Timestamp', 'EventType', 'PassengerID', 'AgentID', 'AgentName', 'FlightAction', 'FareAmount', 'Currency', 'Decision', 'RuleNumber', 'RuleName', 'Reason', 'Status'];
    const rows = filteredLogs.map(l => [
      l.id,
      `"${l.timestamp}"`,
      l.eventType,
      l.customerId,
      l.agentId,
      `"${l.agentName.replace(/"/g, '""')}"`,
      l.action,
      l.amount,
      l.currency,
      l.decision,
      l.ruleNumber,
      `"${l.ruleName.replace(/"/g, '""')}"`,
      `"${l.reason.replace(/"/g, '""')}"`,
      l.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `airline_gatekeeper_audit_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export JSON
  const exportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filteredLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `airline_gatekeeper_audit_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-sky-400" />
            Airline Security Audit Trail & Evaluation Log
          </h2>
          <p className="text-xs text-slate-400">
            Immutable, persistent record of all incoming travel agent requests, airline rules fired, and customer approvals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCsv}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
          <button
            onClick={exportJson}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            Export JSON
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#111827] border border-slate-800 p-4 rounded-xl space-y-3">
        <div className="flex flex-col lg:flex-row gap-3 items-center justify-between">
          {/* Search box */}
          <div className="relative w-full lg:w-96">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ID, travel agent, action, passenger..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Decision Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full lg:w-auto">
            <button
              onClick={() => setDecisionFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                decisionFilter === 'ALL'
                  ? 'bg-sky-600/20 text-sky-400 border border-sky-500/40'
                  : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setDecisionFilter('ALLOW')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                decisionFilter === 'ALLOW'
                  ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
              }`}
            >
              ALLOW
            </button>
            <button
              onClick={() => setDecisionFilter('ASK_CUSTOMER')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                decisionFilter === 'ASK_CUSTOMER'
                  ? 'bg-amber-600/20 text-amber-400 border border-amber-500/40'
                  : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
              }`}
            >
              ASK CUSTOMER
            </button>
            <button
              onClick={() => setDecisionFilter('BLOCK')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                decisionFilter === 'BLOCK'
                  ? 'bg-rose-600/20 text-rose-400 border border-rose-500/40'
                  : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
              }`}
            >
              BLOCK
            </button>
          </div>

          {/* Sort Order & Action Filter */}
          <div className="flex items-center gap-2 w-full lg:w-auto">
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-300 focus:outline-none"
            >
              <option value="ALL">All Flight Actions</option>
              {uniqueActions.map(act => (
                <option key={act} value={act}>{act}</option>
              ))}
            </select>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-300 focus:outline-none"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="amount_desc">Sort: Fare (High to Low)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Audit Table */}
      <div className="rounded-2xl bg-[#111827] border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="px-6 py-3.5">Timestamp</th>
                <th className="px-6 py-3.5">Verdict</th>
                <th className="px-6 py-3.5">AI Agent & Passenger</th>
                <th className="px-6 py-3.5">Flight Action & Fare</th>
                <th className="px-6 py-3.5">Rule Responsible</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  onClick={() => onSelectEntry(log)}
                  className="hover:bg-slate-850/60 cursor-pointer transition-colors group"
                >
                  {/* Timestamp */}
                  <td className="px-6 py-3.5 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                    <div>{new Date(log.timestamp).toLocaleDateString()}</div>
                    <div className="text-slate-300 font-semibold">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </div>
                  </td>

                  {/* Decision */}
                  <td className="px-6 py-3.5">
                    <DecisionBadge decision={log.decision} size="sm" />
                  </td>

                  {/* Agent & Passenger */}
                  <td className="px-6 py-3.5">
                    <div>
                      <div className="font-bold text-white group-hover:text-sky-400 transition-colors">
                        {log.agentName}
                      </div>
                      <div className="font-mono text-[10px] text-slate-400">
                        {log.agentId} · <span className="text-slate-400 font-medium">Pax: {log.customerId}</span>
                      </div>
                    </div>
                  </td>

                  {/* Action & Amount */}
                  <td className="px-6 py-3.5">
                    <div>
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-sky-300 font-mono text-[10px] uppercase font-bold">
                        {log.action}
                      </span>
                      <div className="font-mono font-bold text-slate-200 mt-1">
                        {log.amount > 0 ? `${log.currency} ${log.amount.toLocaleString()}` : <span className="text-slate-400 font-normal">Read-Only</span>}
                      </div>
                    </div>
                  </td>

                  {/* Rule */}
                  <td className="px-6 py-3.5 max-w-xs">
                    <div>
                      <span className="font-semibold text-slate-200 block truncate">
                        Rule #{log.ruleNumber}: {log.ruleName}
                      </span>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {log.reason}
                      </p>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-3.5 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        log.status === 'COMPLETED'
                          ? 'bg-slate-800 text-slate-300 border-slate-700'
                          : log.status === 'PENDING_APPROVAL'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 animate-pulse'
                          : log.status === 'APPROVED'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>

                  {/* Details button */}
                  <td className="px-6 py-3.5 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectEntry(log);
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    No flight audit records match your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
