import { describe, it, expect } from 'vitest';
import { runAllTestCases, REQUIRED_TEST_CASES, TEST_FIXTURE_AGENTS } from '../services/testSuite';
import { evaluateRequest } from '../services/decisionEngine';
import { AgentRequest, StudentConfig } from '../types';

describe('Airline Agent Gatekeeper Decision Engine', () => {
  const airlineConfig: StudentConfig = {
    studentName: 'Candidate / Student',
    enrolmentNumber: 'ENR-2024-0182',
    companyName: 'Air India',
    industry: 'AIRLINE',
    currency: 'INR',
    transactionThreshold: 15000,
    projectTitle: 'Agent Gatekeeper: Airline AI Agent Permission & Flight Booking Security Gateway',
    isCustomEnrolment: true,
  };

  it('runs all 8 airline test cases and all must pass', () => {
    const report = runAllTestCases(REQUIRED_TEST_CASES);
    expect(report.total).toBe(8);
    expect(report.failedCount).toBe(0);
    expect(report.passedCount).toBe(8);
    expect(report.allPassed).toBe(true);
  });

  describe('The Six Required Airline Test Cases', () => {
    it('Scenario 1: Registered active agent → View flight fares → Expected ALLOW (Rule 3)', () => {
      const request: AgentRequest = {
        id: 'REQ-T1',
        customerId: 'PAX-001',
        agentId: 'TEST-AGT-ACTIVE-01',
        action: 'view_fares',
        amount: 0,
        currency: 'INR',
        description: 'Query flight fares for DEL -> BOM',
        flightNumber: 'AI-802',
        route: 'DEL -> BOM',
        timestamp: new Date().toISOString(),
      };
      const result = evaluateRequest(request, { agents: TEST_FIXTURE_AGENTS, config: airlineConfig });
      expect(result.decision).toBe('ALLOW');
      expect(result.ruleNumber).toBe(3);
    });

    it('Scenario 2: Unknown agent → Book flight → Expected BLOCK (Rule 1)', () => {
      const request: AgentRequest = {
        id: 'REQ-T2',
        customerId: 'PAX-001',
        agentId: 'UNKNOWN-ROGUE-BOT-99',
        action: 'book_flight',
        amount: 7500,
        currency: 'INR',
        description: 'Automated seat reservation probe',
        flightNumber: 'AI-506',
        route: 'DEL -> BLR',
        timestamp: new Date().toISOString(),
      };
      const result = evaluateRequest(request, { agents: TEST_FIXTURE_AGENTS, config: airlineConfig });
      expect(result.decision).toBe('BLOCK');
      expect(result.ruleNumber).toBe(1);
    });

    it('Scenario 3: Registered active agent → Book flight above booking limit → Expected ASK CUSTOMER (Rule 5)', () => {
      const request: AgentRequest = {
        id: 'REQ-T3',
        customerId: 'PAX-001',
        agentId: 'TEST-AGT-ACTIVE-01',
        action: 'book_flight',
        amount: 28500, // exceeds 15,000 booking limit
        currency: 'INR',
        description: 'International premium economy booking',
        flightNumber: 'AI-161',
        route: 'DEL -> LHR',
        timestamp: new Date().toISOString(),
      };
      const result = evaluateRequest(request, { agents: TEST_FIXTURE_AGENTS, config: airlineConfig });
      expect(result.decision).toBe('ASK_CUSTOMER');
      expect(result.ruleNumber).toBe(5);
    });

    it('Scenario 4: Registered active agent → Book flight below booking limit → Expected ALLOW (Rule 4)', () => {
      const request: AgentRequest = {
        id: 'REQ-T4',
        customerId: 'PAX-001',
        agentId: 'TEST-AGT-ACTIVE-01',
        action: 'book_flight',
        amount: 6800, // below 15,000 booking limit
        currency: 'INR',
        description: 'Domestic economy ticket reservation',
        flightNumber: 'AI-506',
        route: 'DEL -> BLR',
        timestamp: new Date().toISOString(),
      };
      const result = evaluateRequest(request, { agents: TEST_FIXTURE_AGENTS, config: airlineConfig });
      expect(result.decision).toBe('ALLOW');
      expect(result.ruleNumber).toBe(4);
    });

    it('Scenario 5: Revoked agent → Attempt flight booking → Expected BLOCK (Rule 2)', () => {
      const request: AgentRequest = {
        id: 'REQ-T5',
        customerId: 'PAX-001',
        agentId: 'TEST-AGT-REVOKED-02',
        action: 'book_flight',
        amount: 5500,
        currency: 'INR',
        description: 'Revoked bot booking attempt',
        flightNumber: 'AI-802',
        route: 'DEL -> BOM',
        timestamp: new Date().toISOString(),
      };
      const result = evaluateRequest(request, { agents: TEST_FIXTURE_AGENTS, config: airlineConfig });
      expect(result.decision).toBe('BLOCK');
      expect(result.ruleNumber).toBe(2);
    });

    it('Scenario 6: Registered active agent → Attempt unauthorized action → Expected BLOCK (Rule 8)', () => {
      const request: AgentRequest = {
        id: 'REQ-T6',
        customerId: 'PAX-001',
        agentId: 'TEST-AGT-RESTRICTED-03', // only has view_fares
        action: 'book_flight', // unauthorized action for this agent
        amount: 4500,
        currency: 'INR',
        description: 'Read-only agent attempting unauthorized ticket booking',
        flightNumber: 'AI-506',
        route: 'DEL -> BLR',
        timestamp: new Date().toISOString(),
      };
      const result = evaluateRequest(request, { agents: TEST_FIXTURE_AGENTS, config: airlineConfig });
      expect(result.decision).toBe('BLOCK');
      expect(result.ruleNumber).toBe(8);
    });
  });

  describe('Additional Airline Rules (Rule 6 & Rule 7)', () => {
    it('Scenario 7: Registered active agent → Request flight refund → Expected ASK CUSTOMER (Rule 7)', () => {
      const request: AgentRequest = {
        id: 'REQ-T7',
        customerId: 'PAX-001',
        agentId: 'TEST-AGT-ACTIVE-01',
        action: 'request_refund',
        amount: 12000,
        currency: 'INR',
        description: 'Fare refund claim for cancelled flight',
        flightNumber: 'AI-161',
        route: 'DEL -> LHR',
        timestamp: new Date().toISOString(),
      };
      const result = evaluateRequest(request, { agents: TEST_FIXTURE_AGENTS, config: airlineConfig });
      expect(result.decision).toBe('ASK_CUSTOMER');
      expect(result.ruleNumber).toBe(7);
    });

    it('Scenario 8: Registered active agent → Change flight booking → Expected ASK CUSTOMER (Rule 6)', () => {
      const request: AgentRequest = {
        id: 'REQ-T8',
        customerId: 'PAX-001',
        agentId: 'TEST-AGT-ACTIVE-01',
        action: 'change_booking',
        amount: 2500,
        currency: 'INR',
        description: 'Date change for existing booking',
        flightNumber: 'AI-802',
        route: 'DEL -> BOM',
        timestamp: new Date().toISOString(),
      };
      const result = evaluateRequest(request, { agents: TEST_FIXTURE_AGENTS, config: airlineConfig });
      expect(result.decision).toBe('ASK_CUSTOMER');
      expect(result.ruleNumber).toBe(6);
    });
  });
});
