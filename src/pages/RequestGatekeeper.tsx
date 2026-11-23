import React, { useState } from 'react';
import { AIAgent, AgentRequest, DecisionResult, StudentConfig } from '../types';
import { INDUSTRY_ACTIONS, AIRLINE_ROUTES } from '../constants/defaultData';
import { processAndRecordRequest } from '../services/decisionEngine';
import { DecisionBadge } from '../components/DecisionBadge';
import { 
  Plane, 
  Send, 
  Sparkles, 
  Clock, 
  HelpCircle,
  ArrowRight
} from 'lucide-react';

interface RequestGatekeeperProps {
  config: StudentConfig;
  agents: AIAgent[];
  onRequestProcessed: () => void;
  onNavigate: (tab: any) => void;
}

export const RequestGatekeeper: React.FC<RequestGatekeeperProps> = ({
  config,
  agents,
  onRequestProcessed,
  onNavigate,
}) => {
  const actions = INDUSTRY_ACTIONS.AIRLINE;
  const defaultAgent = agents.find(a => a.status === 'ACTIVE') || agents[0];

  const [customerId, setCustomerId] = useState('PAX-90412');
  const [selectedAgentId, setSelectedAgentId] = useState(defaultAgent ? defaultAgent.id : 'AGT-101-SKY');
  const [customAgentName, setCustomAgentName] = useState(defaultAgent ? defaultAgent.name : '');
  const [action, setAction] = useState('view_fares');
  const [amount, setAmount] = useState<number>(0);
  const [currency] = useState(config.currency || 'INR');
  const [description, setDescription] = useState('Query flight fares and schedules for DEL -> BOM');
  const [route, setRoute] = useState(AIRLINE_ROUTES[0]);
  const [flightNumber, setFlightNumber] = useState('AI-802');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [latestResult, setLatestResult] = useState<DecisionResult | null>(null);

  // When agent dropdown changes
  const handleAgentSelect = (id: string) => {
    setSelectedAgentId(id);
    const found = agents.find(a => a.id === id);
    if (found) {
      setCustomAgentName(found.name);
      setCustomerId(found.customerId || customerId);
    }
  };

  // When action changes, adjust default description & amount
  const handleActionChange = (newAction: string) => {
    setAction(newAction);
    const act = actions.find(a => a.code === newAction);
    if (act?.isReadOnly) {
      setAmount(0);
      setDescription(`View available fare tiers and schedule for ${route}`);
    } else if (newAction === 'book_flight') {
      if (amount === 0) setAmount(6800);
      setDescription(`Reserve seat and issue ticket for ${route} (${flightNumber})`);
    } else if (newAction === 'change_booking') {
      setAmount(2500);
      setDescription(`Reschedule departure date for ${route}`);
    } else if (newAction === 'request_refund') {
      setAmount(12000);
      setDescription(`Request fare refund for cancelled reservation on ${route}`);
    }
  };

  // Quick Airline Scenario Loader
  const loadPreset = (presetType: 'routine' | 'large' | 'readonly' | 'refund' | 'change' | 'revoked' | 'unknown') => {
    const active = agents.find(a => a.status === 'ACTIVE' && a.permissions.includes('book_flight'));
    const revoked = agents.find(a => a.status === 'REVOKED');

    switch (presetType) {
      case 'routine':
        setSelectedAgentId(active ? active.id : 'AGT-101-SKY');
        setCustomAgentName(active ? active.name : 'SkyTravel Personal Concierge');
        setAction('book_flight');
        setAmount(6800); // strictly below 15,000 threshold
        setRoute('DEL -> BLR (Flight AI-506)');
        setFlightNumber('AI-506');
        setDescription('Domestic economy flight booking below booking limit');
        break;

      case 'large':
        setSelectedAgentId(active ? active.id : 'AGT-101-SKY');
        setCustomAgentName(active ? active.name : 'SkyTravel Personal Concierge');
        setAction('book_flight');
        setAmount(28500); // strictly above 15,000 threshold
        setRoute('DEL -> LHR (Flight AI-161)');
        setFlightNumber('AI-161');
        setDescription('International flight booking exceeding autonomous limit (requires approval)');
        break;

      case 'readonly':
        setSelectedAgentId(active ? active.id : 'AGT-101-SKY');
        setCustomAgentName(active ? active.name : 'SkyTravel Personal Concierge');
        setAction('view_fares');
        setAmount(0);
        setRoute('DEL -> BOM (Flight AI-802)');
        setFlightNumber('AI-802');
        setDescription('Read-only query of flight fare classes and seat availability');
        break;

      case 'refund':
        setSelectedAgentId(active ? active.id : 'AGT-101-SKY');
        setCustomAgentName(active ? active.name : 'SkyTravel Personal Concierge');
        setAction('request_refund');
        setAmount(12000);
        setRoute('DEL -> LHR (Flight AI-161)');
        setFlightNumber('AI-161');
        setDescription('Fare refund claim for cancelled travel itinerary');
        break;

      case 'change':
        setSelectedAgentId(active ? active.id : 'AGT-101-SKY');
        setCustomAgentName(active ? active.name : 'SkyTravel Personal Concierge');
        setAction('change_booking');
        setAmount(2500);
        setRoute('DEL -> BOM (Flight AI-802)');
        setFlightNumber('AI-802');
        setDescription('Flight reschedule request to alter departure sector');
        break;

      case 'revoked':
        if (revoked) {
          setSelectedAgentId(revoked.id);
          setCustomAgentName(revoked.name);
        } else {
          setSelectedAgentId('AGT-103-REV');
          setCustomAgentName('Legacy TravelBot v1 (Revoked)');
        }
        setAction('book_flight');
        setAmount(5500);
        setDescription('Revoked agent attempting flight reservation');
        break;

      case 'unknown':
        setSelectedAgentId('UNKNOWN-AIRLINE-BOT-99');
        setCustomAgentName('Unregistered Web Scraper');
        setAction('book_flight');
        setAmount(7500);
        setDescription('Unregistered bot attempting automated seat reservation');
        break;
    }
  };

  const handleEvaluate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const agentObj = agents.find(a => a.id === selectedAgentId);

    const req: AgentRequest = {
      id: `REQ-${Date.now()}`,
      customerId: customerId.trim(),
      agentId: selectedAgentId.trim(),
      agentName: agentObj?.name || customAgentName || 'External Travel AI Agent',
      action: action.trim(),
      amount: Number(amount) || 0,
      currency: currency || config.currency,
      description: description.trim(),
      flightNumber: flightNumber.trim(),
      route: route.trim(),
      timestamp: new Date().toISOString(),
    };

    // Process through real airline decision engine & record to storage
    const result = processAndRecordRequest(req);
    setLatestResult(result);
    setIsSubmitting(false);
    onRequestProcessed();
  };

  const selectedActionDef = actions.find(a => a.code === action);
  const isReadOnly = selectedActionDef?.isReadOnly ?? false;

  return (
    <div className="space-y-6">
      {/* Title & Presets Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Plane className="w-6 h-6 text-sky-400" />
            Airline Request Gatekeeper
          </h2>
          <p className="text-xs text-slate-400">
            Submit simulated AI travel agent requests to evaluate airline booking limits, fare queries, and revocation rules.
          </p>
        </div>

        {/* Quick Airline Scenarios */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold text-slate-400 mr-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" /> Airline Scenarios:
          </span>
          <button
            onClick={() => loadPreset('routine')}
            className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold transition-colors"
          >
            Booking (≤ Limit)
          </button>
          <button
            onClick={() => loadPreset('large')}
            className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[11px] font-semibold transition-colors"
          >
            Booking (&gt; Limit)
          </button>
          <button
            onClick={() => loadPreset('readonly')}
            className="px-2.5 py-1 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 text-[11px] font-semibold transition-colors"
          >
            View Fares
          </button>
          <button
            onClick={() => loadPreset('change')}
            className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[11px] font-semibold transition-colors"
          >
            Change Booking
          </button>
          <button
            onClick={() => loadPreset('refund')}
            className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[11px] font-semibold transition-colors"
          >
            Refund
          </button>
          <button
            onClick={() => loadPreset('revoked')}
            className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[11px] font-semibold transition-colors"
          >
            Revoked Agent
          </button>
          <button
            onClick={() => loadPreset('unknown')}
            className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[11px] font-semibold transition-colors"
          >
            Unknown Agent
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Panel (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-[#111827] border border-slate-800 p-6 shadow-xl">
          <form onSubmit={handleEvaluate} className="space-y-4">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Flight Operation Request Parameters
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Carrier: {config.companyName} ({config.industry})
              </span>
            </div>

            {/* Passenger ID & Agent ID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Passenger ID / Account
                </label>
                <input
                  type="text"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  placeholder="e.g. PAX-90412"
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center justify-between">
                  <span>AI Travel Agent</span>
                  <span className="text-[10px] text-sky-400">Select or Enter ID</span>
                </label>
                <select
                  value={selectedAgentId}
                  onChange={(e) => handleAgentSelect(e.target.value)}
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                >
                  {agents.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.id}) - [{a.status}]
                    </option>
                  ))}
                  <option value="UNKNOWN-AIRLINE-BOT-99">Unknown / Rogue Agent (UNKNOWN-AIRLINE-BOT-99)</option>
                  <option value="NEW-CUSTOM-AGENT">Other (Custom Input)</option>
                </select>
              </div>
            </div>

            {/* Custom Agent Override if selected */}
            {selectedAgentId === 'NEW-CUSTOM-AGENT' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Custom Agent Name
                  </label>
                  <input
                    type="text"
                    value={customAgentName}
                    onChange={(e) => setCustomAgentName(e.target.value)}
                    placeholder="e.g. TravelCopilot"
                    className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Custom Agent ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. AGT-CUSTOM-AIR"
                    onChange={(e) => setSelectedAgentId(e.target.value)}
                    className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>
            )}

            {/* Airline Action & Fare Amount */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Airline Action
                </label>
                <select
                  value={action}
                  onChange={(e) => handleActionChange(e.target.value)}
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                >
                  {actions.map((act) => (
                    <option key={act.code} value={act.code}>
                      {act.label} {act.isReadOnly ? '(Read-Only)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center justify-between">
                  <span>Fare / Booking Amount</span>
                  <span className="text-[10px] text-slate-400">
                    Booking Limit: {currency} {config.transactionThreshold.toLocaleString()}
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    disabled={isReadOnly}
                    value={isReadOnly ? 0 : amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    min="0"
                    step="100"
                    className={`w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-sky-500 ${
                      isReadOnly ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    required={!isReadOnly}
                  />
                  <span className="absolute right-3 top-2 text-xs font-mono text-slate-400">
                    {currency}
                  </span>
                </div>
              </div>
            </div>

            {/* Flight Route & Flight Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Flight Sector / Route
                </label>
                <select
                  value={route}
                  onChange={(e) => setRoute(e.target.value)}
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                >
                  {AIRLINE_ROUTES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Flight Number
                </label>
                <input
                  type="text"
                  value={flightNumber}
                  onChange={(e) => setFlightNumber(e.target.value)}
                  placeholder="e.g. AI-802"
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-sky-500"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Operation Purpose / Passenger Itinerary Notes
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="State itinerary purpose or booking details"
                className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-lg shadow-sky-600/30 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Evaluating Airline Rules...' : 'Evaluate Flight Request with Security Rules'}
              </button>
            </div>
          </form>
        </div>

        {/* Real-Time Result Panel (5 cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="rounded-2xl bg-[#111827] border border-slate-800 p-6 h-full flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-sky-400" />
                  Airline Gatekeeper Verdict
                </span>
                <span className="text-[10px] font-mono text-emerald-400">100% Deterministic</span>
              </div>

              {latestResult ? (
                <div className="space-y-4 animate-in fade-in duration-200">
                  {/* Decision Banner */}
                  <div className={`p-4 rounded-xl border text-center space-y-1.5 ${
                    latestResult.decision === 'ALLOW' 
                      ? 'bg-emerald-950/30 border-emerald-500/40 glow-allow' 
                      : latestResult.decision === 'ASK_CUSTOMER'
                      ? 'bg-amber-950/30 border-amber-500/40 glow-ask'
                      : 'bg-rose-950/30 border-rose-500/40 glow-block'
                  }`}>
                    <div className="text-[11px] font-bold uppercase tracking-wider opacity-80 text-slate-300">
                      System Verdict
                    </div>
                    <div className="flex justify-center">
                      <DecisionBadge decision={latestResult.decision} size="lg" />
                    </div>
                    <div className="text-xs font-mono font-bold text-white pt-1">
                      Rule #{latestResult.ruleNumber}: {latestResult.ruleName}
                    </div>
                  </div>

                  {/* Explanation Card */}
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Rule Evaluation Explanation
                    </span>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      {latestResult.explanation}
                    </p>
                  </div>

                  {/* Request Breakdown */}
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-2">
                    <div className="flex justify-between text-slate-400">
                      <span>Request ID:</span>
                      <span className="font-mono text-slate-200">{latestResult.requestId}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Agent:</span>
                      <span className="font-mono text-sky-400">{latestResult.request.agentId}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Action:</span>
                      <span className="font-mono text-slate-200 uppercase">{latestResult.request.action}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Fare Amount:</span>
                      <span className="font-mono text-amber-400 font-bold">
                        {latestResult.request.amount > 0 ? `${latestResult.request.currency} ${latestResult.request.amount.toLocaleString()}` : '0 (Read-Only Fares)'}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Timestamp:</span>
                      <span className="font-mono text-slate-400">
                        {new Date(latestResult.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>

                  {/* Ask Customer Escalation CTA */}
                  {latestResult.decision === 'ASK_CUSTOMER' && (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs">
                      <span className="text-amber-300 font-semibold">
                        Escalated to Passenger Confirmation Queue
                      </span>
                      <button
                        onClick={() => onNavigate('approvals')}
                        className="px-2.5 py-1 rounded bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-colors"
                      >
                        Authorize Now
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-16 text-center space-y-3 text-slate-500">
                  <HelpCircle className="w-12 h-12 mx-auto text-slate-600 stroke-[1.5]" />
                  <div className="text-xs text-slate-400">
                    No flight request evaluated yet in this session.
                  </div>
                  <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                    Fill the form or click one of the quick airline scenarios above to execute the real decision engine.
                  </p>
                </div>
              )}
            </div>

            {/* Persistent Log Note */}
            <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>All flight evaluations recorded in persistent audit log.</span>
              <button
                onClick={() => onNavigate('audit')}
                className="text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-0.5"
              >
                Audit Log <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
