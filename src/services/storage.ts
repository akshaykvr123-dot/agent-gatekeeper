import { AIAgent, AuditLogEntry, Industry, PendingApproval, SecurityRule, StudentConfig } from '../types';
import { 
  DEFAULT_RULES, 
  DEFAULT_STUDENT_CONFIG, 
  INITIAL_DEMO_AGENTS, 
  INITIAL_DEMO_AUDIT_LOGS, 
  INITIAL_PENDING_APPROVALS 
} from '../constants/defaultData';

const STORAGE_KEYS = {
  CONFIG: 'gatekeeper_airline_config_v2',
  AGENTS: 'gatekeeper_airline_agents_v2',
  RULES: 'gatekeeper_airline_rules_v2',
  AUDIT_LOGS: 'gatekeeper_airline_audit_logs_v2',
  PENDING_APPROVALS: 'gatekeeper_airline_pending_approvals_v2',
};

export const storage = {
  // Config
  getConfig(): StudentConfig {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CONFIG);
      return data ? JSON.parse(data) : DEFAULT_STUDENT_CONFIG;
    } catch {
      return DEFAULT_STUDENT_CONFIG;
    }
  },

  saveConfig(config: StudentConfig): void {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
  },

  // Agents
  getAgents(): AIAgent[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AGENTS);
      return data ? JSON.parse(data) : INITIAL_DEMO_AGENTS;
    } catch {
      return INITIAL_DEMO_AGENTS;
    }
  },

  saveAgents(agents: AIAgent[]): void {
    localStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(agents));
  },

  getAgentById(id: string): AIAgent | undefined {
    const agents = this.getAgents();
    return agents.find(a => a.id.toLowerCase() === id.trim().toLowerCase());
  },

  addAgent(agent: AIAgent): void {
    const agents = this.getAgents();
    this.saveAgents([agent, ...agents]);
  },

  updateAgent(agent: AIAgent): void {
    const agents = this.getAgents();
    const index = agents.findIndex(a => a.id === agent.id);
    if (index !== -1) {
      agents[index] = agent;
      this.saveAgents(agents);
    }
  },

  revokeAgent(agentId: string, revokedBy: string, reason: string): AIAgent | null {
    const agents = this.getAgents();
    const agent = agents.find(a => a.id === agentId);
    if (!agent) return null;

    const updatedAgent: AIAgent = {
      ...agent,
      status: 'REVOKED',
      revokedAt: new Date().toISOString(),
      revokedBy: revokedBy || 'Passenger Security Console',
      revocationReason: reason || 'Access manually revoked by passenger'
    };

    const index = agents.findIndex(a => a.id === agentId);
    agents[index] = updatedAgent;
    this.saveAgents(agents);

    // Record revocation event in audit log
    this.addAuditLog({
      id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      eventType: 'AGENT_REVOKED',
      customerId: agent.customerId,
      agentId: agent.id,
      agentName: agent.name,
      action: 'revoke_agent',
      amount: 0,
      currency: this.getConfig().currency,
      decision: 'BLOCK',
      ruleNumber: 2,
      ruleName: 'Revoked Agent Block',
      reason: `Agent credentials revoked by ${revokedBy}. Reason: ${reason}`,
      description: `Flight security revocation enforced for agent ${agent.name} (${agent.id})`,
      status: 'COMPLETED',
    });

    return updatedAgent;
  },

  // Security Rules
  getRules(industry?: Industry): SecurityRule[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RULES);
      const allRules: Record<Industry, SecurityRule[]> = data ? JSON.parse(data) : DEFAULT_RULES;
      const targetIndustry = industry || this.getConfig().industry;
      return allRules[targetIndustry] || DEFAULT_RULES.AIRLINE;
    } catch {
      return DEFAULT_RULES.AIRLINE;
    }
  },

  saveRules(rules: SecurityRule[], industry?: Industry): void {
    const targetIndustry = industry || this.getConfig().industry;
    let allRules: Record<Industry, SecurityRule[]>;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RULES);
      allRules = data ? JSON.parse(data) : { ...DEFAULT_RULES };
    } catch {
      allRules = { ...DEFAULT_RULES };
    }
    allRules[targetIndustry] = rules;
    localStorage.setItem(STORAGE_KEYS.RULES, JSON.stringify(allRules));
  },

  // Audit Logs
  getAuditLogs(): AuditLogEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      return data ? JSON.parse(data) : INITIAL_DEMO_AUDIT_LOGS;
    } catch {
      return INITIAL_DEMO_AUDIT_LOGS;
    }
  },

  saveAuditLogs(logs: AuditLogEntry[]): void {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs));
  },

  addAuditLog(entry: AuditLogEntry): void {
    const logs = this.getAuditLogs();
    this.saveAuditLogs([entry, ...logs]);
  },

  // Pending Approvals
  getPendingApprovals(): PendingApproval[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PENDING_APPROVALS);
      return data ? JSON.parse(data) : INITIAL_PENDING_APPROVALS;
    } catch {
      return INITIAL_PENDING_APPROVALS;
    }
  },

  savePendingApprovals(approvals: PendingApproval[]): void {
    localStorage.setItem(STORAGE_KEYS.PENDING_APPROVALS, JSON.stringify(approvals));
  },

  addPendingApproval(approval: PendingApproval): void {
    const list = this.getPendingApprovals();
    this.savePendingApprovals([approval, ...list]);
  },

  resolvePendingApproval(id: string, status: 'APPROVED' | 'REJECTED', resolvedBy: string, notes?: string): PendingApproval | null {
    const list = this.getPendingApprovals();
    const item = list.find(a => a.id === id);
    if (!item) return null;

    item.status = status;
    item.resolvedAt = new Date().toISOString();
    item.resolvedBy = resolvedBy;
    item.notes = notes;
    this.savePendingApprovals(list);

    // Update corresponding audit log
    const logs = this.getAuditLogs();
    const logIndex = logs.findIndex(l => l.id === item.auditLogId);
    if (logIndex !== -1) {
      logs[logIndex].status = status;
      this.saveAuditLogs(logs);
    }

    // Add a new audit event for Customer Approval / Rejection
    this.addAuditLog({
      id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      eventType: status === 'APPROVED' ? 'CUSTOMER_APPROVAL' : 'CUSTOMER_REJECTION',
      customerId: item.request.customerId,
      agentId: item.agent.id,
      agentName: item.agent.name,
      action: item.request.action,
      amount: item.request.amount,
      currency: item.request.currency,
      decision: status === 'APPROVED' ? 'ALLOW' : 'BLOCK',
      ruleNumber: item.decisionResult.ruleNumber,
      ruleName: status === 'APPROVED' ? 'Passenger Authorization Confirmed' : 'Passenger Authorization Declined',
      reason: `Passenger explicitly ${status.toLowerCase()} flight request ${item.request.id}. ${notes ? `Notes: ${notes}` : ''}`,
      description: `Simulated passenger approval resolved: ${status} for ${item.request.flightNumber || item.request.action}`,
      status: status,
      metadata: { originalAuditId: item.auditLogId, requestId: item.request.id, flightNumber: item.request.flightNumber }
    });

    return item;
  },

  // Reset to Demo Data
  resetToDemoData(): void {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(DEFAULT_STUDENT_CONFIG));
    localStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(INITIAL_DEMO_AGENTS));
    localStorage.setItem(STORAGE_KEYS.RULES, JSON.stringify(DEFAULT_RULES));
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_DEMO_AUDIT_LOGS));
    localStorage.setItem(STORAGE_KEYS.PENDING_APPROVALS, JSON.stringify(INITIAL_PENDING_APPROVALS));
  },

  // Clear all data
  clearAllData(): void {
    localStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.PENDING_APPROVALS, JSON.stringify([]));
  }
};
