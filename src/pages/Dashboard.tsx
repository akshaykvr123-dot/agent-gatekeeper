import React from 'react';
import { AIAgent, AuditLogEntry, PendingApproval, StudentConfig } from '../types';
import { StatsCard } from '../components/StatsCard';
import { DecisionBadge } from '../components/DecisionBadge';
import { 
  Users, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  GraduationCap, 
  Plane, 
  ArrowUpRight, 
  Clock 
} from 'lucide-react';

interface DashboardProps {
  config: StudentConfig;
  agents: AIAgent[];
  auditLogs: AuditLogEntry[];
  pendingApprovals: PendingApproval[];
  onNavigate: (tab: any) => void;
  onOpenSettings: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  config,
  agents,
  auditLogs,
  pendingApprovals,
  onNavigate,
  onOpenSettings,
}) => {
  // Compute real metrics
  const totalAgents = agents.length;
  const activeAgents = agents.filter(a => a.status === 'ACTIVE').length;
  const revokedAgents = agents.filter(a => a.status === 'REVOKED').length;

  const requestLogs = auditLogs.filter(l => l.eventType === 'REQUEST_EVALUATION');
  const totalRequests = requestLogs.length;

  const allowCount = requestLogs.filter(l => l.decision === 'ALLOW').length;
  const askCount = requestLogs.filter(l => l.decision === 'ASK_CUSTOMER').length;
  const blockCount = requestLogs.filter(l => l.decision === 'BLOCK').length;

  const allowPct = totalRequests > 0 ? Math.round((allowCount / totalRequests) * 100) : 0;
  const askPct = totalRequests > 0 ? Math.round((askCount / totalRequests) * 100) : 0;
  const blockPct = totalRequests > 0 ? Math.round((blockCount / totalRequests) * 100) : 0;

  const unresolvedApprovals = pendingApprovals.filter(a => a.status === 'PENDING');

  return (
    <div className="space-y-6">
      {/* Top Banner: Academic Context & Student Enrolment Badge */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-950/40 via-slate-900 to-blue-950/40 border border-sky-900/40 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-[11px] font-semibold uppercase tracking-wider border border-sky-500/30">
                Academic Security Project
              </span>
              <span className="text-xs text-slate-400">Airline Industry Implementation</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Plane className="w-6 h-6 text-sky-400" />
              Airline Agent Gatekeeper Dashboard
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Evaluating third-party travel AI agents in real-time. Enforcing autonomous flight booking limits,
              itinerary change restrictions, and zero-tolerance revocation boundaries for <strong className="text-white">{config.companyName}</strong>.
            </p>
          </div>

          {/* Student Identification Card */}
          <div 
            onClick={onOpenSettings}
            className="cursor-pointer shrink-0 rounded-xl bg-slate-900/90 border border-slate-700/80 p-4 hover:border-sky-500/80 transition-all shadow-lg group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 group-hover:bg-indigo-600/30 transition-colors">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  Student Enrolment
                  <span className="text-[10px] text-sky-400">Edit ⚙️</span>
                </div>
                <div className="text-sm font-bold font-mono text-white group-hover:text-sky-300">
                  {config.enrolmentNumber}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Carrier: <span className="font-semibold text-sky-400">{config.companyName}</span> ({config.industry})
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Approval Alert Banner (if any) */}
      {unresolvedApprovals.length > 0 && (
        <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-300">
                Action Required: {unresolvedApprovals.length} Pending Passenger Confirmation{unresolvedApprovals.length > 1 ? 's' : ''}
              </div>
              <div className="text-xs text-amber-200/80">
                Flight bookings exceeding the autonomous limit of {config.currency} {config.transactionThreshold.toLocaleString()} or refund requests require passenger authorization.
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigate('approvals')}
            className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors shrink-0 flex items-center gap-1.5 self-start sm:self-auto"
          >
            Review Approvals Queue
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Primary Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total AI Travel Agents"
          value={totalAgents}
          subtitle={`${activeAgents} Active · ${revokedAgents} Revoked`}
          icon={Users}
          variant="primary"
          onClick={() => onNavigate('registry')}
        />
        <StatsCard
          title="Flight Requests Processed"
          value={totalRequests}
          subtitle="Evaluated by Airline Engine"
          icon={Activity}
          variant="default"
          onClick={() => onNavigate('audit')}
        />
        <StatsCard
          title="Autonomous Allowed"
          value={allowCount}
          subtitle={`${allowPct}% permitted by policy`}
          icon={CheckCircle2}
          variant="allow"
          badge={`${allowPct}%`}
          onClick={() => onNavigate('audit')}
        />
        <StatsCard
          title="Unauthorized Blocked"
          value={blockCount}
          subtitle={`${blockPct}% blocked by rules`}
          icon={XCircle}
          variant="block"
          badge={`${blockPct}%`}
          onClick={() => onNavigate('audit')}
        />
      </div>

      {/* Decision Distribution & Security Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Decision Breakdown Visualizer */}
        <div className="rounded-2xl bg-[#111827] border border-slate-800 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white tracking-wide">
                Decision Distribution
              </h3>
              <span className="text-[11px] font-mono text-slate-400">
                {totalRequests} Total Evaluated
              </span>
            </div>

            {/* Custom Visual Distribution Bar */}
            <div className="space-y-4">
              <div className="h-4 w-full rounded-full bg-slate-900 overflow-hidden flex p-0.5 border border-slate-800">
                {allowCount > 0 && (
                  <div
                    style={{ width: `${allowPct}%` }}
                    className="bg-emerald-500 rounded-l-full transition-all duration-500 hover:opacity-90"
                    title={`ALLOW: ${allowCount} (${allowPct}%)`}
                  />
                )}
                {askCount > 0 && (
                  <div
                    style={{ width: `${askPct}%` }}
                    className="bg-amber-500 transition-all duration-500 hover:opacity-90"
                    title={`ASK CUSTOMER: ${askCount} (${askPct}%)`}
                  />
                )}
                {blockCount > 0 && (
                  <div
                    style={{ width: `${blockPct}%` }}
                    className="bg-rose-500 rounded-r-full transition-all duration-500 hover:opacity-90"
                    title={`BLOCK: ${blockCount} (${blockPct}%)`}
                  />
                )}
                {totalRequests === 0 && (
                  <div className="w-full bg-slate-800 rounded-full" />
                )}
              </div>

              {/* Legend with exact counts */}
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                    <span className="font-semibold text-emerald-400">ALLOW</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-slate-300">{allowCount}</span>
                    <span className="text-slate-500 w-10 text-right">{allowPct}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
                    <span className="font-semibold text-amber-400">ASK CUSTOMER</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-slate-300">{askCount}</span>
                    <span className="text-slate-500 w-10 text-right">{askPct}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50" />
                    <span className="font-semibold text-rose-400">BLOCK</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-slate-300">{blockCount}</span>
                    <span className="text-slate-500 w-10 text-right">{blockPct}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('gatekeeper')}
            className="mt-6 w-full py-2.5 rounded-xl bg-sky-600/10 hover:bg-sky-600/20 text-sky-400 border border-sky-500/30 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            Launch Flight Request Evaluation
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Security Parameters & Industry Rules Card */}
        <div className="rounded-2xl bg-[#111827] border border-slate-800 p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white tracking-wide">
                Airline Security Parameters
              </h3>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                ACTIVE
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[11px]">Airline Carrier</span>
                <div className="font-bold text-white flex items-center gap-1.5 text-sm">
                  <Plane className="w-4 h-4 text-sky-400" />
                  {config.companyName}
                  <span className="text-xs font-mono text-slate-400">({config.industry})</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 block text-[11px]">Flight Booking Spending Limit</span>
                  <span className="text-[10px] text-amber-400 cursor-pointer" onClick={onOpenSettings}>Change</span>
                </div>
                <div className="font-mono text-base font-bold text-amber-400">
                  {config.currency} {config.transactionThreshold.toLocaleString()}
                </div>
                <p className="text-[10px] text-slate-400 italic">
                  Bookings above this limit escalate to passenger confirmation (Rule 5).
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[11px]">Airline Rules Engine</span>
                  <span className="font-semibold text-slate-200">8 Deterministic Rules Loaded</span>
                </div>
                <button
                  onClick={() => onNavigate('rules')}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
                >
                  View Rules
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('testlab')}
            className="mt-6 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
            Open Airline Test Lab (6 Tests)
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Testing & Agent Overview */}
        <div className="rounded-2xl bg-[#111827] border border-slate-800 p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white tracking-wide">
                Agent Registry Status
              </h3>
              <span className="text-[11px] font-mono text-slate-400">
                {activeAgents} Active / {totalAgents} Total
              </span>
            </div>

            <div className="space-y-2">
              {agents.slice(0, 3).map((agt) => (
                <div
                  key={agt.id}
                  className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-semibold text-white flex items-center gap-1.5">
                      {agt.name}
                    </div>
                    <div className="font-mono text-[10px] text-slate-400">
                      {agt.id} · {agt.permissions.length} perms
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      agt.status === 'ACTIVE'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    }`}
                  >
                    {agt.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate('registry')}
            className="mt-6 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
            Manage AI Travel Agents
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Recent Security Activity Feed */}
      <div className="rounded-2xl bg-[#111827] border border-slate-800 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div>
            <h3 className="text-sm font-bold text-white">Recent Flight Security Activity Feed</h3>
            <p className="text-xs text-slate-400">Live evaluation log of incoming AI agent flight requests</p>
          </div>
          <button
            onClick={() => onNavigate('audit')}
            className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1"
          >
            View Full Audit Log ({auditLogs.length})
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-800/80">
          {auditLogs.slice(0, 5).map((log) => (
            <div
              key={log.id}
              className="px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-850/50 transition-colors"
            >
              <div className="flex items-start sm:items-center gap-3">
                <DecisionBadge decision={log.decision} size="sm" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white">
                      {log.agentName}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">
                      ({log.agentId})
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-sky-300 uppercase font-mono">
                      {log.action}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                    {log.reason}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 text-xs font-mono shrink-0">
                <span className="font-bold text-slate-300">
                  {log.amount > 0 ? `${log.currency} ${log.amount.toLocaleString()}` : '0 (Read-Only)'}
                </span>
                <span className="text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}

          {auditLogs.length === 0 && (
            <div className="p-8 text-center text-xs text-slate-500">
              No audit records yet. Submit a flight request in the Request Gatekeeper.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
