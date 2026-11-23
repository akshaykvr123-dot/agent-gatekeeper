export type Industry = 'AIRLINE' | 'BANK' | 'ONLINE_STORE';

export type Decision = 'ALLOW' | 'ASK_CUSTOMER' | 'BLOCK';

export type AgentStatus = 'ACTIVE' | 'REVOKED';

export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface StudentConfig {
  studentName: string;
  enrolmentNumber: string; // e.g. "ENR-2024-0321" (0-3 = Airline)
  companyName: string; // e.g. "Air India" or "Delta Air Lines"
  industry: Industry;
  currency: string; // e.g. "INR"
  transactionThreshold: number; // Flight booking spending limit e.g. INR 15,000
  projectTitle: string;
  isCustomEnrolment: boolean;
}

export interface SecurityRule {
  id: number;
  code: string;
  name: string;
  description: string;
  industry: Industry | 'ALL';
  severity: 'HIGH' | 'MEDIUM' | 'INFO';
  isActive: boolean;
}

export interface AIAgent {
  id: string; // e.g. "AGT-101-SKY"
  name: string;
  customerId: string; // Passenger or account ID e.g. "PAX-90412"
  provider: string; // e.g. "Amadeus AI Travel Corp"
  description: string;
  permissions: string[]; // List of permitted airline actions: view_fares, book_flight, change_booking, request_refund
  status: AgentStatus;
  maxDailyLimit?: number;
  registeredAt: string;
  revokedAt?: string;
  revokedBy?: string;
  revocationReason?: string;
}

export interface AgentRequest {
  id: string;
  customerId: string; // Passenger / Customer ID
  agentId: string;
  agentName?: string;
  action: string; // 'view_fares' | 'book_flight' | 'change_booking' | 'request_refund'
  amount: number; // Flight booking or fare amount
  currency: string;
  description: string;
  flightNumber?: string;
  route?: string; // e.g. "DEL -> BOM" or "JFK -> LHR"
  recipient?: string;
  merchant?: string;
  timestamp: string;
}

export interface DecisionResult {
  decision: Decision;
  ruleNumber: number;
  ruleCode: string;
  ruleName: string;
  explanation: string;
  timestamp: string;
  requestId: string;
  request: AgentRequest;
  agent?: AIAgent;
  requiresApproval?: boolean;
}

export type AuditEventType = 
  | 'REQUEST_EVALUATION' 
  | 'AGENT_REGISTERED' 
  | 'AGENT_REVOKED' 
  | 'CUSTOMER_APPROVAL' 
  | 'CUSTOMER_REJECTION'
  | 'RULES_UPDATED';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  eventType: AuditEventType;
  customerId: string;
  agentId: string;
  agentName: string;
  action: string;
  amount: number;
  currency: string;
  decision: Decision;
  ruleNumber: number;
  ruleName: string;
  reason: string;
  description: string;
  status: 'COMPLETED' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';
  metadata?: Record<string, unknown>;
}

export interface PendingApproval {
  id: string;
  auditLogId: string;
  request: AgentRequest;
  agent: AIAgent;
  decisionResult: DecisionResult;
  status: ApprovalStatus;
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
  notes?: string;
}

export interface TestCase {
  id: number;
  title: string;
  category: string;
  description: string;
  setup: {
    agentId: string;
    agentStatus: AgentStatus;
    action: string;
    amount: number;
    flightNumber?: string;
    route?: string;
    customerNotes?: string;
  };
  expectedDecision: Decision;
  expectedRuleNumber: number;
  expectedRuleName: string;
  explanation: string;
}

export interface TestResult {
  testCaseId: number;
  passed: boolean;
  actualDecision: Decision;
  actualRuleNumber: number;
  actualRuleName: string;
  actualExplanation: string;
  executionTimeMs: number;
  timestamp: string;
}
