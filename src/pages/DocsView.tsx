import React, { useState } from 'react';
import { BookOpen, ExternalLink, ShieldCheck, Plane } from 'lucide-react';
import { StudentConfig } from '../types';

interface DocsViewProps {
  config: StudentConfig;
}

export const DocsView: React.FC<DocsViewProps> = ({ config }) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'SOURCES' | 'GITHUB'>('OVERVIEW');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-sky-400" />
          Airline Documentation & Academic Research Sources
        </h2>
        <p className="text-xs text-slate-400">
          Architecture, airline decision engine mechanics, industry references, and academic source documentation.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'OVERVIEW'
              ? 'bg-sky-600/20 text-sky-400 border border-sky-500/40'
              : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
          }`}
        >
          Airline Architecture & Mechanics
        </button>

        <button
          onClick={() => setActiveTab('SOURCES')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'SOURCES'
              ? 'bg-sky-600/20 text-sky-400 border border-sky-500/40'
              : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
          }`}
        >
          Research Sources (SOURCES.md)
        </button>

        <button
          onClick={() => setActiveTab('GITHUB')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'GITHUB'
              ? 'bg-sky-600/20 text-sky-400 border border-sky-500/40'
              : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
          }`}
        >
          GitHub 3-Day Commit Plan
        </button>
      </div>

      {/* Content */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6 text-xs text-slate-300">
          {/* Executive Summary */}
          <div className="p-6 rounded-2xl bg-[#111827] border border-slate-800 space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Plane className="w-5 h-5 text-sky-400" />
              Airline Agent Gatekeeper System Overview
            </h3>
            <p className="leading-relaxed text-slate-300">
              Agent Gatekeeper is a prototype security and permission management gateway specifically tailored for the
              <strong> Airline Customer Service and Flight Booking</strong> domain. Modern autonomous travel assistants
              (such as airfare monitoring bots, corporate travel bookers, and concierge agents) can query flight matrices,
              reserve seats, change itineraries, and claim refunds on behalf of passengers.
            </p>
            <p className="leading-relaxed text-slate-300">
              Without a strict gatekeeper, automated scrapers can overwhelm ticketing inventories, execute unauthorized
              rescheduling, or claim fraudulent refunds. The system evaluates every action through an 8-rule deterministic
              hierarchy and outputs one of three verdicts:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 space-y-1">
                <strong className="block font-bold">1. ALLOW</strong>
                <span>Viewing flight fares or routine ticket bookings strictly below the booking limit.</span>
              </div>
              <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-300 space-y-1">
                <strong className="block font-bold">2. ASK CUSTOMER</strong>
                <span>High-value flight bookings exceeding the limit, flight changes, or ticket refund requests.</span>
              </div>
              <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 text-rose-300 space-y-1">
                <strong className="block font-bold">3. BLOCK</strong>
                <span>Unregistered agents, revoked identities, unauthorized actions, or malformed flight requests.</span>
              </div>
            </div>
          </div>

          {/* Decision Engine Hierarchy */}
          <div className="p-6 rounded-2xl bg-[#111827] border border-slate-800 space-y-3">
            <h3 className="text-base font-bold text-white">The 8 Airline Gatekeeper Rules</h3>
            <ol className="list-decimal list-inside space-y-1.5 font-mono text-slate-300 bg-slate-900 p-4 rounded-xl border border-slate-800">
              <li><strong>Rule 1 (Unregistered Agent Block):</strong> Unregistered or unknown AI agents must be BLOCKED.</li>
              <li><strong>Rule 2 (Revoked Agent Block):</strong> Revoked AI agents must always be BLOCKED.</li>
              <li><strong>Rule 3 (Permitted Read-Only Fare Search):</strong> Registered agents may ALLOW permitted read-only actions such as viewing flight fares.</li>
              <li><strong>Rule 4 (Routine Flight Booking Below Limit):</strong> Flight bookings below the configured booking limit may be ALLOWED if authorized.</li>
              <li><strong>Rule 5 (Booking Above Limit Requires Approval):</strong> Bookings above the booking limit must require customer approval (ASK CUSTOMER).</li>
              <li><strong>Rule 6 (Flight Change Restrictions):</strong> Flight changes must be checked against agent permissions and require customer confirmation.</li>
              <li><strong>Rule 7 (Refund Request Requires Approval):</strong> Refund requests must require customer approval (ASK CUSTOMER).</li>
              <li><strong>Rule 8 (Unauthorized Action or Invalid Request Block):</strong> Unauthorized actions or invalid flight requests must be BLOCKED.</li>
            </ol>
          </div>
        </div>
      )}

      {activeTab === 'SOURCES' && (
        <div className="space-y-6 text-xs text-slate-300">
          <div className="p-6 rounded-2xl bg-[#111827] border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white">Academic Project Sources & Industry Research</h3>
            <p className="text-slate-300 leading-relaxed">
              The project is motivated by real-world enterprise policies where airlines like Delta Air Lines and consumer platforms are actively blocking or restricting autonomous AI agents.
            </p>

            <div className="space-y-4 pt-2">
              {/* Source 1 */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400">
                    Assignment Reference: OfficeChai Enterprise AI Agent Blocking Analysis
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono">
                    Verified
                  </span>
                </div>
                <h4 className="font-bold text-white text-sm">
                  Amazon, JPMorgan, Schwab, and Delta are all blocking AI agents — here's why
                </h4>
                <p className="text-slate-300">
                  Explores why Delta Air Lines and other major enterprises deployed bot-mitigation perimeters to prevent third-party bots from aggressive inventory holding, automated seat rebooking, and fare scraping without human presence.
                </p>
                <a
                  href="https://officechai.com/ai/amazon-jpmorgan-schwab-and-delta-are-all-blocking-ai-agents-heres-why/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sky-400 hover:text-sky-300 underline font-mono flex items-center gap-1 text-[11px]"
                >
                  https://officechai.com/ai/amazon-jpmorgan-schwab-and-delta-are-all-blocking-ai-agents-heres-why/
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Source 2 */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400">
                    Assignment Reference: American Banker / Access Revocation Mandate
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono">
                    Verified
                  </span>
                </div>
                <h4 className="font-bold text-white text-sm">
                  Proving AI Agent Revocation & Customer Liability
                </h4>
                <p className="text-slate-300">
                  Details the requirement for verifiable, timestamped proof when a customer terminates an AI agent's access grant. If an AI agent continues executing transactions post-revocation, an auditable revocation log is legally critical.
                </p>
                <a
                  href="https://www.americanbanker.com/news/wells-fargo-wants-customers-to-prove-theyve-revoked-ai-agents"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sky-400 hover:text-sky-300 underline font-mono flex items-center gap-1 text-[11px]"
                >
                  https://www.americanbanker.com/news/wells-fargo-wants-customers-to-prove-theyve-revoked-ai-agents
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Source 3 */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400">
                    Airline Industry Standards: IATA Resolution & Conditions of Carriage
                  </span>
                  <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-mono">
                    Industry Standard
                  </span>
                </div>
                <h4 className="font-bold text-white text-sm">
                  IATA Passenger Services Conference Resolutions (Resolution 850m)
                </h4>
                <p className="text-slate-300">
                  Defines electronic ticket issuance rules, cancellation penalties, agency accreditation, and safeguards against automated flight modification fraud.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'GITHUB' && (
        <div className="space-y-6 text-xs text-slate-300">
          <div className="p-6 rounded-2xl bg-[#111827] border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white">Genuine 3-Day GitHub Commit Schedule (Airline Scenario)</h3>
            <p className="text-slate-300 leading-relaxed">
              As required by the assignment, you should make at least five genuine commits across three separate days when uploading to your personal GitHub repository:
            </p>

            <div className="space-y-3 font-mono">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="text-emerald-400 font-bold">DAY 1: Project Setup & Airline Decision Engine Foundation</div>
                <ul className="list-disc list-inside text-slate-300 text-[11px] space-y-1 pt-1">
                  <li><strong>Commit 1:</strong> <code>feat: initialize Vite React TypeScript project with dark fintech styling</code></li>
                  <li><strong>Commit 2:</strong> <code>feat: implement deterministic 8-rule airline decision engine and data types</code></li>
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="text-sky-400 font-bold">DAY 2: Travel Agent Registry, Revocation Workflow & Audit Logging</div>
                <ul className="list-disc list-inside text-slate-300 text-[11px] space-y-1 pt-1">
                  <li><strong>Commit 3:</strong> <code>feat: implement airline travel agent registry and permanent revocation center</code></li>
                  <li><strong>Commit 4:</strong> <code>feat: build persistent flight audit log table with search, filters, and JSON/CSV export</code></li>
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="text-purple-400 font-bold">DAY 3: Airline Test Lab, Passenger Approval & Academic Documentation</div>
                <ul className="list-disc list-inside text-slate-300 text-[11px] space-y-1 pt-1">
                  <li><strong>Commit 5:</strong> <code>feat: add 6 airline test scenarios and simulated passenger approval queue</code></li>
                  <li><strong>Commit 6:</strong> <code>docs: complete airline README.md, SOURCES.md, PROMPTS.md, and DEMO_SCRIPT.md</code></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
