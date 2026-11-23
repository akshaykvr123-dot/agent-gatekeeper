import { AIAgent, AgentRequest, TestCase, TestResult } from '../types';
import { evaluateRequest } from './decisionEngine';
import { storage } from './storage';

// Dedicated Airline Test Fixtures for deterministic testing
export const TEST_FIXTURE_AGENTS: AIAgent[] = [
  {
    id: 'TEST-AGT-ACTIVE-01',
    name: 'Verified SkyAssistant Pro',
    customerId: 'PAX-TEST-001',
    provider: 'Amadeus Airline Solutions',
    description: 'Active test agent with view_fares, book_flight, change_booking, and request_refund permissions',
    permissions: ['view_fares', 'book_flight', 'change_booking', 'request_refund'],
    status: 'ACTIVE',
    maxDailyLimit: 100000,
    registeredAt: '2026-11-01T00:00:00.000Z',
  },
  {
    id: 'TEST-AGT-REVOKED-02',
    name: 'Compromised Travel Bot (Revoked)',
    customerId: 'PAX-TEST-001',
    provider: 'FlySmart Corp',
    description: 'Revoked test agent whose ticketing credentials were permanently terminated',
    permissions: ['view_fares', 'book_flight'],
    status: 'REVOKED',
    maxDailyLimit: 0,
    registeredAt: '2026-10-15T00:00:00.000Z',
    revokedAt: '2026-11-10T12:00:00.000Z',
    revokedBy: 'Airline Security Operations',
    revocationReason: 'Credential leak detected on third-party aggregation portal',
  },
  {
    id: 'TEST-AGT-RESTRICTED-03',
    name: 'Strict Fare-Search Only Bot',
    customerId: 'PAX-TEST-001',
    provider: 'Skyscanner Intelligence',
    description: 'Agent with strictly view_fares permission only',
    permissions: ['view_fares'],
    status: 'ACTIVE',
    maxDailyLimit: 0,
    registeredAt: '2026-11-05T00:00:00.000Z',
  }
];

export const REQUIRED_TEST_CASES: TestCase[] = [
  {
    id: 1,
    title: 'Test 1: Registered Active Agent → View Flight Fares',
    category: 'Read-Only Fare Search',
    description: 'Registered active agent attempting a permitted read-only action (view flight fares). Non-financial schedule inquiry.',
    setup: {
      agentId: 'TEST-AGT-ACTIVE-01',
      agentStatus: 'ACTIVE',
      action: 'view_fares',
      amount: 0,
      flightNumber: 'AI-802',
      route: 'DEL -> BOM',
      customerNotes: 'Query flight fare classes for DEL -> BOM'
    },
    expectedDecision: 'ALLOW',
    expectedRuleNumber: 3,
    expectedRuleName: 'Permitted Read-Only Fare Search Allowed',
    explanation: 'Viewing flight fares is a read-only action permitted under Rule 3 for authorized agents.',
  },
  {
    id: 2,
    title: 'Test 2: Unknown Agent → Book Flight',
    category: 'Identity Verification',
    description: 'Unregistered or rogue agent with unrecognized agent ID attempting to book a flight ticket.',
    setup: {
      agentId: 'UNKNOWN-ROGUE-BOT-99',
      agentStatus: 'ACTIVE', // not in registry
      action: 'book_flight',
      amount: 7500,
      flightNumber: 'AI-506',
      route: 'DEL -> BLR',
      customerNotes: 'Automated seat booking attempt by unregistered client'
    },
    expectedDecision: 'BLOCK',
    expectedRuleNumber: 1,
    expectedRuleName: 'Unregistered Agent Block',
    explanation: 'Airline gatekeeper perimeter must immediately block any agent not found in the registry (Rule 1).',
  },
  {
    id: 3,
    title: 'Test 3: Registered Active Agent → Book Flight Above Booking Limit',
    category: 'Booking Limit Escalation',
    description: 'Registered active agent attempting to book a flight where fare exceeds the configured booking limit (e.g. ₹28,500 > ₹15,000).',
    setup: {
      agentId: 'TEST-AGT-ACTIVE-01',
      agentStatus: 'ACTIVE',
      action: 'book_flight',
      amount: 28500,
      flightNumber: 'AI-161',
      route: 'DEL -> LHR',
      customerNotes: 'International ticket booking exceeding autonomous limit'
    },
    expectedDecision: 'ASK_CUSTOMER',
    expectedRuleNumber: 5,
    expectedRuleName: 'Booking Above Booking Limit Requires Customer Approval',
    explanation: 'Flight bookings exceeding the configured booking limit must require customer approval (Rule 5).',
  },
  {
    id: 4,
    title: 'Test 4: Registered Active Agent → Book Flight Below Booking Limit',
    category: 'Autonomous Booking',
    description: 'Registered active agent attempting a permitted flight booking strictly below the booking limit (e.g. ₹6,800 <= ₹15,000).',
    setup: {
      agentId: 'TEST-AGT-ACTIVE-01',
      agentStatus: 'ACTIVE',
      action: 'book_flight',
      amount: 6800,
      flightNumber: 'AI-506',
      route: 'DEL -> BLR',
      customerNotes: 'Routine domestic flight booking'
    },
    expectedDecision: 'ALLOW',
    expectedRuleNumber: 4,
    expectedRuleName: 'Flight Booking Below Booking Limit Allowed',
    explanation: 'Routine flight bookings below the booking limit are allowed for authorized agents (Rule 4).',
  },
  {
    id: 5,
    title: 'Test 5: Revoked Agent → Attempt Flight Booking',
    category: 'Revocation Enforcement',
    description: 'AI agent whose access was previously revoked attempting to book a flight on the customer reservation system.',
    setup: {
      agentId: 'TEST-AGT-REVOKED-02',
      agentStatus: 'REVOKED',
      action: 'book_flight',
      amount: 5500,
      flightNumber: 'AI-802',
      route: 'DEL -> BOM',
      customerNotes: 'Post-revocation booking attempt'
    },
    expectedDecision: 'BLOCK',
    expectedRuleNumber: 2,
    expectedRuleName: 'Revoked Agent Block',
    explanation: 'Revoked AI agents must always be blocked from performing any flight operations (Rule 2).',
  },
  {
    id: 6,
    title: 'Test 6: Registered Active Agent → Attempt Unauthorized Action',
    category: 'Privilege Boundary Enforcement',
    description: 'Registered agent with fare-search only permissions attempting to book a flight without authorization.',
    setup: {
      agentId: 'TEST-AGT-RESTRICTED-03',
      agentStatus: 'ACTIVE',
      action: 'book_flight',
      amount: 4500,
      flightNumber: 'AI-506',
      route: 'DEL -> BLR',
      customerNotes: 'Read-only agent attempting unauthorized ticket booking'
    },
    expectedDecision: 'BLOCK',
    expectedRuleNumber: 8,
    expectedRuleName: 'Unauthorized Action or Invalid Request Block',
    explanation: 'Unauthorized actions outside an agent registered permissions must be blocked (Rule 8).',
  },
  {
    id: 7,
    title: 'Test 7: Registered Active Agent → Request Flight Refund',
    category: 'Refund Protection',
    description: 'Registered active agent requesting a flight ticket refund for a cancelled reservation.',
    setup: {
      agentId: 'TEST-AGT-ACTIVE-01',
      agentStatus: 'ACTIVE',
      action: 'request_refund',
      amount: 12000,
      flightNumber: 'AI-161',
      route: 'DEL -> LHR',
      customerNotes: 'Refund claim for modified travel itinerary'
    },
    expectedDecision: 'ASK_CUSTOMER',
    expectedRuleNumber: 7,
    expectedRuleName: 'Refund Request Requires Customer Approval',
    explanation: 'Refund requests must require customer approval (Ask Customer) under Rule 7 to prevent unauthorized cancellations.',
  },
  {
    id: 8,
    title: 'Test 8: Registered Active Agent → Change Flight Booking',
    category: 'Itinerary Change Verification',
    description: 'Registered active agent attempting to reschedule departure dates for an existing flight booking.',
    setup: {
      agentId: 'TEST-AGT-ACTIVE-01',
      agentStatus: 'ACTIVE',
      action: 'change_booking',
      amount: 2500,
      flightNumber: 'AI-802',
      route: 'DEL -> BOM',
      customerNotes: 'Date change request from Nov 25 to Nov 28'
    },
    expectedDecision: 'ASK_CUSTOMER',
    expectedRuleNumber: 6,
    expectedRuleName: 'Flight Change Restrictions & Verification',
    explanation: 'Flight changes must be checked against change restrictions and require passenger confirmation (Rule 6).',
  }
];

/**
 * Runs a single test case against the real airline decision engine.
 */
export function runTestCase(testCase: TestCase): TestResult {
  const start = performance.now();
  const config = storage.getConfig();

  const request: AgentRequest = {
    id: `TEST-REQ-${testCase.id}-${Date.now()}`,
    customerId: 'PAX-TEST-001',
    agentId: testCase.setup.agentId,
    action: testCase.setup.action,
    amount: testCase.setup.amount,
    currency: config.currency,
    description: testCase.setup.customerNotes || testCase.description,
    flightNumber: testCase.setup.flightNumber,
    route: testCase.setup.route,
    timestamp: new Date().toISOString(),
  };

  // Evaluate using the test fixture agents
  const result = evaluateRequest(request, {
    agents: TEST_FIXTURE_AGENTS,
    config,
  });

  const end = performance.now();

  const decisionPassed = result.decision === testCase.expectedDecision;
  const rulePassed = result.ruleNumber === testCase.expectedRuleNumber;
  const passed = decisionPassed && rulePassed;

  return {
    testCaseId: testCase.id,
    passed,
    actualDecision: result.decision,
    actualRuleNumber: result.ruleNumber,
    actualRuleName: result.ruleName,
    actualExplanation: result.explanation,
    executionTimeMs: Math.round((end - start) * 100) / 100,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Runs all test cases and returns comprehensive test report.
 */
export function runAllTestCases(testCases: TestCase[] = REQUIRED_TEST_CASES): {
  results: TestResult[];
  total: number;
  passedCount: number;
  failedCount: number;
  allPassed: boolean;
} {
  const results = testCases.map(tc => runTestCase(tc));
  const passedCount = results.filter(r => r.passed).length;
  const failedCount = results.length - passedCount;

  return {
    results,
    total: results.length,
    passedCount,
    failedCount,
    allPassed: failedCount === 0,
  };
}
