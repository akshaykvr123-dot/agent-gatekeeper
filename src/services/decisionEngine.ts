import { AIAgent, AgentRequest, DecisionResult, StudentConfig, SecurityRule } from '../types';
import { storage } from './storage';

export interface DecisionEngineOptions {
  agents?: AIAgent[];
  rules?: SecurityRule[];
  config?: StudentConfig;
}

/**
 * Airline Customer Service & Flight Booking Decision Engine
 * Evaluates third-party AI agent requests in strict priority order against Airline Gatekeeper Rules.
 */
export function evaluateRequest(
  request: AgentRequest,
  options?: DecisionEngineOptions
): DecisionResult {
  const config = options?.config || storage.getConfig();
  const agents = options?.agents || storage.getAgents();
  const rules = options?.rules || storage.getRules(config.industry);
  const threshold = config.transactionThreshold ?? 15000;
  const currency = request.currency || config.currency || 'INR';

  const timestamp = new Date().toISOString();
  const requestId = request.id || `REQ-${Date.now()}`;

  // Helper to fetch rule metadata
  const getRuleMeta = (ruleId: number, fallbackCode: string, fallbackName: string) => {
    const found = rules.find(r => r.id === ruleId);
    return {
      ruleNumber: ruleId,
      ruleCode: found?.code || fallbackCode,
      ruleName: found?.name || fallbackName,
    };
  };

  // =========================================================================
  // PRIORITY 1: RULE 8 - Request Validation & Schema Integrity
  // =========================================================================
  if (
    !request.customerId || 
    !request.customerId.trim() ||
    !request.agentId || 
    !request.agentId.trim() ||
    !request.action || 
    !request.action.trim()
  ) {
    const meta = getRuleMeta(8, 'RULE-A08', 'Unauthorized Action or Invalid Request Block');
    return {
      decision: 'BLOCK',
      ...meta,
      explanation: 'Flight request rejected: Missing essential passenger identification, agent identity, or flight action code.',
      timestamp,
      requestId,
      request,
    };
  }

  const isReadOnly = request.action === 'view_fares';

  // Negative or invalid amounts for monetary flight actions
  if (!isReadOnly && (typeof request.amount !== 'number' || isNaN(request.amount) || request.amount < 0)) {
    const meta = getRuleMeta(8, 'RULE-A08', 'Unauthorized Action or Invalid Request Block');
    return {
      decision: 'BLOCK',
      ...meta,
      explanation: `Flight request rejected: Action '${request.action}' requires a valid non-negative numeric fare amount. Received: ${request.amount}.`,
      timestamp,
      requestId,
      request,
    };
  }

  // =========================================================================
  // PRIORITY 2: RULE 1 - Unregistered AI Agents Must Be Blocked
  // =========================================================================
  const agent = agents.find(
    a => a.id.trim().toLowerCase() === request.agentId.trim().toLowerCase()
  );

  if (!agent) {
    const meta = getRuleMeta(1, 'RULE-A01', 'Unregistered Agent Block');
    return {
      decision: 'BLOCK',
      ...meta,
      explanation: `Agent '${request.agentId}' is not registered in the Airline Agent Registry. Unregistered AI agents must be blocked from accessing flight reservation systems.`,
      timestamp,
      requestId,
      request,
    };
  }

  // =========================================================================
  // PRIORITY 3: RULE 2 - Revoked AI Agents Must Always Be Blocked
  // =========================================================================
  if (agent.status === 'REVOKED') {
    const meta = getRuleMeta(2, 'RULE-A02', 'Revoked Agent Block');
    const revocationDate = agent.revokedAt ? new Date(agent.revokedAt).toLocaleString() : 'previously';
    const revokedBy = agent.revokedBy || 'Passenger';
    return {
      decision: 'BLOCK',
      ...meta,
      explanation: `Agent '${agent.name}' (${agent.id}) was permanently REVOKED on ${revocationDate} by ${revokedBy}. Revoked AI agents must always be blocked from all flight booking and ticketing operations.`,
      timestamp,
      requestId,
      request,
      agent,
    };
  }

  // =========================================================================
  // PRIORITY 4: RULE 8 - Unauthorized Actions Must Be Blocked
  // =========================================================================
  const hasPermission = agent.permissions.some(
    p => p.trim().toLowerCase() === request.action.trim().toLowerCase()
  );

  if (!hasPermission) {
    const meta = getRuleMeta(8, 'RULE-A08', 'Unauthorized Action or Invalid Request Block');
    return {
      decision: 'BLOCK',
      ...meta,
      explanation: `Action '${request.action}' is unauthorized for agent '${agent.name}'. Agent registered permissions: [${agent.permissions.join(', ') || 'None'}]. Unauthorized actions must be blocked.`,
      timestamp,
      requestId,
      request,
      agent,
    };
  }

  // =========================================================================
  // PRIORITY 5: RULE 3 - Registered Agents May Allow Permitted Read-Only Fares
  // =========================================================================
  if (request.action === 'view_fares') {
    const meta = getRuleMeta(3, 'RULE-A03', 'Permitted Read-Only Fare Search Allowed');
    return {
      decision: 'ALLOW',
      ...meta,
      explanation: `Registered active agent '${agent.name}' is authorized to view flight schedules and fare classes. Read-only fare inquiries are permitted.`,
      timestamp,
      requestId,
      request,
      agent,
    };
  }

  // =========================================================================
  // PRIORITY 6: RULE 7 - Refund Requests Must Require Customer Approval
  // =========================================================================
  if (request.action === 'request_refund') {
    const meta = getRuleMeta(7, 'RULE-A07', 'Refund Request Requires Customer Approval');
    return {
      decision: 'ASK_CUSTOMER',
      ...meta,
      explanation: `Flight fare refund request of ${currency} ${request.amount.toLocaleString()} requires explicit customer approval (Ask Customer) to safeguard against unauthorized ticket cancellations.`,
      timestamp,
      requestId,
      request,
      agent,
      requiresApproval: true,
    };
  }

  // =========================================================================
  // PRIORITY 7: RULE 6 - Flight Changes Checked Against Change Restrictions
  // =========================================================================
  if (request.action === 'change_booking') {
    const meta = getRuleMeta(6, 'RULE-A06', 'Flight Change Restrictions & Verification');
    return {
      decision: 'ASK_CUSTOMER',
      ...meta,
      explanation: `Flight booking change request for sector '${request.route || request.description || 'Itinerary'}' alters scheduled passenger travel. Escalated for customer approval under flight change verification policies.`,
      timestamp,
      requestId,
      request,
      agent,
      requiresApproval: true,
    };
  }

  // =========================================================================
  // PRIORITY 8: RULE 5 & RULE 4 - Flight Bookings vs Booking Limit
  // =========================================================================
  if (request.action === 'book_flight') {
    if (request.amount > threshold) {
      const meta = getRuleMeta(5, 'RULE-A05', 'Booking Above Booking Limit Requires Customer Approval');
      return {
        decision: 'ASK_CUSTOMER',
        ...meta,
        explanation: `Flight booking of ${currency} ${request.amount.toLocaleString()} exceeds the configured booking limit of ${currency} ${threshold.toLocaleString()}. Bookings above the booking limit must require customer approval (Ask Customer).`,
        timestamp,
        requestId,
        request,
        agent,
        requiresApproval: true,
      };
    }

    // Booking below or equal to booking limit
    const meta = getRuleMeta(4, 'RULE-A04', 'Flight Booking Below Booking Limit Allowed');
    return {
      decision: 'ALLOW',
      ...meta,
      explanation: `Flight booking of ${currency} ${request.amount.toLocaleString()} is within the authorized booking limit of ${currency} ${threshold.toLocaleString()} and agent holds valid booking permissions.`,
      timestamp,
      requestId,
      request,
      agent,
    };
  }

  // =========================================================================
  // FALLBACK: RULE 8 - Unrecognized Action Blocked
  // =========================================================================
  const fallbackMeta = getRuleMeta(8, 'RULE-A08', 'Unauthorized Action or Invalid Request Block');
  return {
    decision: 'BLOCK',
    ...fallbackMeta,
    explanation: `Unrecognized flight operation '${request.action}'. Request blocked under Rule 8.`,
    timestamp,
    requestId,
    request,
    agent,
  };
}

/**
 * Executes evaluation, records audit log, and manages pending customer approvals.
 */
export function processAndRecordRequest(request: AgentRequest): DecisionResult {
  const result = evaluateRequest(request);
  const config = storage.getConfig();

  const auditId = `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  // Create audit log entry
  storage.addAuditLog({
    id: auditId,
    timestamp: result.timestamp,
    eventType: 'REQUEST_EVALUATION',
    customerId: request.customerId,
    agentId: request.agentId,
    agentName: result.agent?.name || request.agentName || 'Unknown Agent',
    action: request.action,
    amount: request.amount || 0,
    currency: request.currency || config.currency || 'INR',
    decision: result.decision,
    ruleNumber: result.ruleNumber,
    ruleName: result.ruleName,
    reason: result.explanation,
    description: request.description || `Flight Action: ${request.action}`,
    status: result.decision === 'ASK_CUSTOMER' ? 'PENDING_APPROVAL' : 'COMPLETED',
    metadata: {
      flightNumber: request.flightNumber,
      route: request.route,
      ruleCode: result.ruleCode,
      bookingLimit: config.transactionThreshold,
    }
  });

  // If ASK_CUSTOMER, add to Pending Approvals queue
  if (result.decision === 'ASK_CUSTOMER' && result.agent) {
    storage.addPendingApproval({
      id: `APV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      auditLogId: auditId,
      request,
      agent: result.agent,
      decisionResult: result,
      status: 'PENDING',
      createdAt: result.timestamp,
    });
  }

  return result;
}
