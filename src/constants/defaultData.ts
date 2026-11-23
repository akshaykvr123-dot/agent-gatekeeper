import { AIAgent, AuditLogEntry, Industry, PendingApproval, SecurityRule, StudentConfig } from '../types';

export const INDUSTRY_ACTIONS: Record<Industry, { code: string; label: string; isReadOnly: boolean; defaultDescription: string }[]> = {
  AIRLINE: [
    { code: 'view_fares', label: 'View Flight Fares', isReadOnly: true, defaultDescription: 'Query live flight schedules, available cabin classes, and fare comparisons' },
    { code: 'book_flight', label: 'Book Flight', isReadOnly: false, defaultDescription: 'Reserve passenger seat and issue airline e-ticket reservation' },
    { code: 'change_booking', label: 'Change Flight Booking', isReadOnly: false, defaultDescription: 'Reschedule travel dates or alter passenger itinerary sectors' },
    { code: 'request_refund', label: 'Request Flight Refund', isReadOnly: false, defaultDescription: 'Initiate flight fare reimbursement for cancelled or adjusted journey' },
  ],
  BANK: [
    { code: 'view_fares', label: 'View Flight Fares', isReadOnly: true, defaultDescription: 'Query flight schedules and fare classes' },
    { code: 'book_flight', label: 'Book Flight', isReadOnly: false, defaultDescription: 'Reserve flight ticket' },
    { code: 'change_booking', label: 'Change Flight Booking', isReadOnly: false, defaultDescription: 'Reschedule flight booking' },
    { code: 'request_refund', label: 'Request Flight Refund', isReadOnly: false, defaultDescription: 'Initiate flight refund' },
  ],
  ONLINE_STORE: [
    { code: 'view_fares', label: 'View Flight Fares', isReadOnly: true, defaultDescription: 'Query flight schedules' },
    { code: 'book_flight', label: 'Book Flight', isReadOnly: false, defaultDescription: 'Book airline ticket' },
    { code: 'change_booking', label: 'Change Flight Booking', isReadOnly: false, defaultDescription: 'Modify flight dates' },
    { code: 'request_refund', label: 'Request Flight Refund', isReadOnly: false, defaultDescription: 'Request fare refund' },
  ],
};

export const AIRLINE_ROUTES = [
  'DEL -> BOM (Flight AI-802)',
  'DEL -> BLR (Flight AI-506)',
  'BOM -> GOI (Flight 6E-241)',
  'BLR -> DEL (Flight AI-507)',
  'DEL -> LHR (Flight AI-161)',
  'BOM -> DXB (Flight AI-983)',
];

export const DEFAULT_RULES: Record<Industry, SecurityRule[]> = {
  AIRLINE: [
    {
      id: 1,
      code: 'RULE-A01',
      name: 'Unregistered Agent Block',
      description: 'Unregistered or unknown AI agents attempting any flight booking or query are immediately blocked.',
      industry: 'AIRLINE',
      severity: 'HIGH',
      isActive: true,
    },
    {
      id: 2,
      code: 'RULE-A02',
      name: 'Revoked Agent Block',
      description: 'Revoked AI agents are permanently blocked and cannot perform any airline customer operations.',
      industry: 'AIRLINE',
      severity: 'HIGH',
      isActive: true,
    },
    {
      id: 3,
      code: 'RULE-A03',
      name: 'Permitted Read-Only Fare Search Allowed',
      description: 'Registered active agents may access permitted read-only actions, such as viewing flight schedules and fares, subject to granted permissions.',
      industry: 'AIRLINE',
      severity: 'INFO',
      isActive: true,
    },
    {
      id: 4,
      code: 'RULE-A04',
      name: 'Flight Booking Below Booking Limit Allowed',
      description: 'Flight bookings below the configured booking limit may be allowed autonomously if the agent is authorized and all conditions are satisfied.',
      industry: 'AIRLINE',
      severity: 'MEDIUM',
      isActive: true,
    },
    {
      id: 5,
      code: 'RULE-A05',
      name: 'Booking Above Booking Limit Requires Customer Approval',
      description: 'Flight bookings exceeding the configured booking limit must require explicit passenger confirmation (Ask Customer).',
      industry: 'AIRLINE',
      severity: 'HIGH',
      isActive: true,
    },
    {
      id: 6,
      code: 'RULE-A06',
      name: 'Flight Change Restrictions & Verification',
      description: 'Flight changes must be checked against agent permissions and configured change restrictions; itinerary rescheduling escalates to customer confirmation.',
      industry: 'AIRLINE',
      severity: 'HIGH',
      isActive: true,
    },
    {
      id: 7,
      code: 'RULE-A07',
      name: 'Refund Request Requires Customer Approval',
      description: 'Refund requests must require customer approval (Ask Customer) to prevent unauthorized cancellations, unless a stricter rule blocks them.',
      industry: 'AIRLINE',
      severity: 'HIGH',
      isActive: true,
    },
    {
      id: 8,
      code: 'RULE-A08',
      name: 'Unauthorized Action or Invalid Request Block',
      description: 'Unauthorized actions outside agent registered permissions, missing passenger IDs, or invalid request payloads must be blocked.',
      industry: 'AIRLINE',
      severity: 'HIGH',
      isActive: true,
    },
  ],
  BANK: [], // Fallback if switched
  ONLINE_STORE: []
};
// Make BANK and ONLINE_STORE inherit AIRLINE rules
DEFAULT_RULES.BANK = DEFAULT_RULES.AIRLINE;
DEFAULT_RULES.ONLINE_STORE = DEFAULT_RULES.AIRLINE;

export const DEFAULT_STUDENT_CONFIG: StudentConfig = {
  studentName: 'Candidate / Student',
  enrolmentNumber: 'ENR-2024-0182', // 0-3 defaults to Airline (Air India / Delta Air Lines)
  companyName: 'Air India',
  industry: 'AIRLINE',
  currency: 'INR',
  transactionThreshold: 15000, // INR 15,000 flight booking spending limit
  projectTitle: 'Agent Gatekeeper: Airline AI Agent Permission & Flight Booking Security Gateway',
  isCustomEnrolment: false,
};

export const INITIAL_DEMO_AGENTS: AIAgent[] = [
  {
    id: 'AGT-101-SKY',
    name: 'SkyTravel Personal Concierge',
    customerId: 'PAX-90412',
    provider: 'Amadeus AI Travel Corp',
    description: 'Autonomous travel assistant authorized for fare inquiries, routine ticket booking, itinerary changes, and refund requests.',
    permissions: ['view_fares', 'book_flight', 'change_booking', 'request_refund'],
    status: 'ACTIVE',
    maxDailyLimit: 50000,
    registeredAt: '2026-11-15T09:30:00.000Z',
  },
  {
    id: 'AGT-102-FAR',
    name: 'AeroFare Low-Fare Tracker',
    customerId: 'PAX-90412',
    provider: 'Skyscanner Intelligence Labs',
    description: 'Flight fare comparison bot with strictly read-only access to fare matrices, schedules, and seat maps.',
    permissions: ['view_fares'],
    status: 'ACTIVE',
    maxDailyLimit: 0,
    registeredAt: '2026-11-16T11:15:00.000Z',
  },
  {
    id: 'AGT-103-REV',
    name: 'Legacy TravelBot v1 (Revoked)',
    customerId: 'PAX-90412',
    provider: 'Deprecated FlySmart Services',
    description: 'Previous automated flight booking agent. Revoked following repeated unauthorized itinerary changes.',
    permissions: ['view_fares', 'book_flight'],
    status: 'REVOKED',
    maxDailyLimit: 20000,
    registeredAt: '2026-10-01T08:00:00.000Z',
    revokedAt: '2026-11-18T14:22:10.000Z',
    revokedBy: 'Passenger (via Airline Security Console)',
    revocationReason: 'Detected unauthorized route alteration attempt on international reservation.',
  },
  {
    id: 'AGT-104-EXP',
    name: 'Corporate Desk AutoBooker',
    customerId: 'PAX-33108',
    provider: 'TripActions Enterprise AI',
    description: 'Corporate travel assistant authorized for domestic sector bookings and fare checks for employee travel.',
    permissions: ['view_fares', 'book_flight'],
    status: 'ACTIVE',
    maxDailyLimit: 30000,
    registeredAt: '2026-11-19T16:45:00.000Z',
  }
];

export const INITIAL_DEMO_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'AUD-8001',
    timestamp: '2026-11-20T10:15:22.000Z',
    eventType: 'REQUEST_EVALUATION',
    customerId: 'PAX-90412',
    agentId: 'AGT-101-SKY',
    agentName: 'SkyTravel Personal Concierge',
    action: 'view_fares',
    amount: 0,
    currency: 'INR',
    decision: 'ALLOW',
    ruleNumber: 3,
    ruleName: 'Permitted Read-Only Fare Search Allowed',
    reason: 'Agent is registered, active, and holds authorized view_fares permission. Non-financial fare query.',
    description: 'Search available economy and business fares for DEL -> BOM (Flight AI-802)',
    status: 'COMPLETED'
  },
  {
    id: 'AUD-8002',
    timestamp: '2026-11-20T11:42:00.000Z',
    eventType: 'REQUEST_EVALUATION',
    customerId: 'PAX-90412',
    agentId: 'AGT-101-SKY',
    agentName: 'SkyTravel Personal Concierge',
    action: 'book_flight',
    amount: 6850,
    currency: 'INR',
    decision: 'ALLOW',
    ruleNumber: 4,
    ruleName: 'Flight Booking Below Booking Limit Allowed',
    reason: 'Flight booking of ₹6,850 is within the autonomous booking limit of ₹15,000 and agent holds valid booking permission.',
    description: 'Domestic ticket booking for DEL -> BLR (Flight AI-506) - Economy Class',
    status: 'COMPLETED'
  },
  {
    id: 'AUD-8003',
    timestamp: '2026-11-21T09:12:45.000Z',
    eventType: 'REQUEST_EVALUATION',
    customerId: 'PAX-90412',
    agentId: 'AGT-101-SKY',
    agentName: 'SkyTravel Personal Concierge',
    action: 'book_flight',
    amount: 32500,
    currency: 'INR',
    decision: 'ASK_CUSTOMER',
    ruleNumber: 5,
    ruleName: 'Booking Above Booking Limit Requires Customer Approval',
    reason: 'Flight booking of ₹32,500 exceeds the autonomous booking limit of ₹15,000. Customer authorization required.',
    description: 'International flight ticket booking for DEL -> LHR (Flight AI-161) - Premium Economy',
    status: 'PENDING_APPROVAL'
  },
  {
    id: 'AUD-8004',
    timestamp: '2026-11-21T14:05:11.000Z',
    eventType: 'REQUEST_EVALUATION',
    customerId: 'PAX-90412',
    agentId: 'AGT-999-ROGUE',
    agentName: 'Unknown Web Scraper Bot',
    action: 'book_flight',
    amount: 8500,
    currency: 'INR',
    decision: 'BLOCK',
    ruleNumber: 1,
    ruleName: 'Unregistered Agent Block',
    reason: 'Agent ID AGT-999-ROGUE is not recognized in the Airline Agent Registry. Unregistered bots cannot access booking engines.',
    description: 'Unauthorized automated seat reservation attempt',
    status: 'COMPLETED'
  },
  {
    id: 'AUD-8005',
    timestamp: '2026-11-21T16:20:30.000Z',
    eventType: 'AGENT_REVOKED',
    customerId: 'PAX-90412',
    agentId: 'AGT-103-REV',
    agentName: 'Legacy TravelBot v1 (Revoked)',
    action: 'revoke_agent',
    amount: 0,
    currency: 'INR',
    decision: 'BLOCK',
    ruleNumber: 2,
    ruleName: 'Revoked Agent Block',
    reason: 'Agent credentials revoked by passenger. Reason: Unauthorized route alteration detected.',
    description: 'Security access revoked by Passenger (via Airline Security Console)',
    status: 'COMPLETED'
  }
];

export const INITIAL_PENDING_APPROVALS: PendingApproval[] = [
  {
    id: 'APV-801',
    auditLogId: 'AUD-8003',
    request: {
      id: 'REQ-8003',
      customerId: 'PAX-90412',
      agentId: 'AGT-101-SKY',
      agentName: 'SkyTravel Personal Concierge',
      action: 'book_flight',
      amount: 32500,
      currency: 'INR',
      description: 'International flight ticket booking for DEL -> LHR (Flight AI-161) - Premium Economy',
      flightNumber: 'AI-161',
      route: 'DEL -> LHR',
      timestamp: '2026-11-21T09:12:45.000Z',
    },
    agent: INITIAL_DEMO_AGENTS[0],
    decisionResult: {
      decision: 'ASK_CUSTOMER',
      ruleNumber: 5,
      ruleCode: 'RULE-A05',
      ruleName: 'Booking Above Booking Limit Requires Customer Approval',
      explanation: 'Flight booking of ₹32,500 exceeds the configured autonomous booking limit of ₹15,000. Explicit passenger confirmation is required to authorize ticket issuance.',
      timestamp: '2026-11-21T09:12:45.000Z',
      requestId: 'REQ-8003',
      request: {
        id: 'REQ-8003',
        customerId: 'PAX-90412',
        agentId: 'AGT-101-SKY',
        agentName: 'SkyTravel Personal Concierge',
        action: 'book_flight',
        amount: 32500,
        currency: 'INR',
        description: 'International flight ticket booking for DEL -> LHR (Flight AI-161) - Premium Economy',
        flightNumber: 'AI-161',
        route: 'DEL -> LHR',
        timestamp: '2026-11-21T09:12:45.000Z',
      },
      requiresApproval: true
    },
    status: 'PENDING',
    createdAt: '2026-11-21T09:12:45.000Z',
  }
];
