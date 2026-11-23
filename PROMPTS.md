# Prompt History & Engineering Log: Airline Agent Gatekeeper

This document logs the development prompts used to specify, scaffold, implement, test, and convert the **Agent Gatekeeper** application to the **AIRLINE** industry scenario, followed by the personal verification section for the student.

---

## 1. Initial Project Architecture & Specification Prompt

```text
Build a complete, functional, premium-quality web application called "Agent Gatekeeper" from start to finish. This is an academic project that must meet every requirement below. Do not build merely a static UI or mockup. Build a working application, run it, test it, fix bugs, and verify all features before declaring completion.

PROJECT OBJECTIVE:
Agent Gatekeeper is a prototype security and permission management system that controls what third-party AI agents can do on behalf of customers. The system evaluates an AI agent's request and returns one of three decisions:
1. ALLOW
2. ASK CUSTOMER
3. BLOCK

The system must explain the decision, identify the rule responsible, record the event, support agent registration, and support agent revocation with a timestamp.
```

---

## 2. Airline Industry Conversion Prompt

```text
Modify my existing Agent Gatekeeper website to use the AIRLINE industry instead of the banking industry.

IMPORTANT:
- Keep the existing website structure, premium UI/UX, dashboard, audit logs, agent registry, testing lab, revocation functionality and overall design.
- Remove banking-specific actions, rules, labels, examples, transaction logic and demo data.
- Convert the entire decision engine and test scenarios to an AIRLINE CUSTOMER SERVICE AND FLIGHT BOOKING GATEKEEPER.
- Do not merely change the UI labels. Update the actual decision logic.

AIRLINE ACTIONS:
1. View flight fares (view_fares)
2. Book flight (book_flight)
3. Change flight booking (change_booking)
4. Request flight refund (request_refund)

AIRLINE GATEKEEPER RULES:
1. Unregistered AI agents must be BLOCKED.
2. Revoked AI agents must always be BLOCKED.
3. Registered agents may ALLOW permitted read-only actions such as viewing flight fares, subject to their permissions.
4. Flight bookings below the configured booking limit may be ALLOWED if the agent is authorized and all required conditions are satisfied.
5. Bookings above the configured booking limit must require customer approval (ASK CUSTOMER).
6. Flight changes must be checked against the agent's permissions and configured change restrictions.
7. Refund requests must require customer approval (ASK CUSTOMER), unless a stricter rule BLOCKS them.
8. Unauthorized actions or invalid requests must be BLOCKED.

CONFIGURATION:
- Make the flight booking spending limit editable.
- Use INR as the default currency.
- Make the airline name configurable.
- Display the student's enrolment number in the dashboard.
- Do not invent my enrolment number.
- Clearly display the configured rules.

TEST LAB:
Implement and execute the following six test scenarios using the actual decision engine:
1. Registered active agent → View flight fares → Expected ALLOW.
2. Unknown agent → Book flight → Expected BLOCK.
3. Registered active agent → Book flight above booking limit → Expected ASK CUSTOMER.
4. Registered active agent → Book flight below booking limit → Expected ALLOW.
5. Revoked agent → Attempt flight booking → Expected BLOCK.
6. Registered active agent → Attempt an unauthorized action → Expected BLOCK.

Show expected decision, actual decision, rule number, PASS/FAIL and timestamp for each test.
```

---

## 3. My Own Verification and Changes

> **Instructions for the Student:**
> The section below is reserved for you to document your personal verifications, observations, and any customizations you made before final submission. Update the checkboxes and notes below based on what you actually inspected and tested.

### Personal Verification Checklist

- [ ] **Enrolment Number & Airline Configuration:**
  - Entered my actual enrolment number: `___________________`
  - Confirmed the last digit falls into the **0–3** range for the **Airline** industry.
  - Configured the airline carrier name (e.g., Air India, IndiGo, or Delta Air Lines).
  - Confirmed currency is set to **INR (₹)** and booking limit is configured (default: ₹15,000).
- [ ] **Testing the 6 Required Airline Scenarios in the Test Lab:**
  - Navigated to the **Test Lab** tab in the running application.
  - Clicked **"Run All Test Cases"** and verified that all 6 mandatory tests passed with correct rule numbers:
    - Test 1 (View flight fares) &rarr; **`ALLOW`** (Rule 3)
    - Test 2 (Unknown agent books flight) &rarr; **`BLOCK`** (Rule 1)
    - Test 3 (Booking above ₹15,000 limit) &rarr; **`ASK CUSTOMER`** (Rule 5)
    - Test 4 (Booking below ₹15,000 limit) &rarr; **`ALLOW`** (Rule 4)
    - Test 5 (Revoked agent booking) &rarr; **`BLOCK`** (Rule 2)
    - Test 6 (Unauthorized action attempt) &rarr; **`BLOCK`** (Rule 8)
- [ ] **Interactive Flight Request Gatekeeper Verification:**
  - Tested a domestic flight booking below ₹15,000 &rarr; Verified verdict was **ALLOW**.
  - Tested an international flight booking of ₹28,500 &rarr; Verified verdict was **ASK CUSTOMER**.
  - Tested a fare refund request &rarr; Verified verdict was **ASK CUSTOMER** under Rule 7.
  - Navigated to the **Customer Approval Queue** and clicked **APPROVE** and **REJECT** &rarr; Verified resolution status and audit event logging.
- [ ] **Airline Travel Agent Revocation Center:**
  - Selected an active travel agent and clicked **Revoke Access**.
  - Filled in the revocation reason and confirmed the revocation.
  - Attempted to book a flight with the revoked agent in the Request Gatekeeper &rarr; Verified that **Rule 2 (Revoked Agent Block)** immediately blocked the request.
- [ ] **Audit Trail & Flight Logging:**
  - Verified that all flight actions, fares, routes, registrations, and revocations appeared in the **Audit Log**.
  - Exported the flight audit log as CSV and JSON.
  - Refreshed the web browser and confirmed all data remained intact.
- [ ] **Automated CLI Build & Test Verification:**
  - Ran `npm test` in the terminal and confirmed 9/9 tests pass.
  - Ran `npm run build` and confirmed the TypeScript production build succeeds with 0 errors.

### Personal Notes & Observations

```text
[Record your personal observations, any custom flight booking limits you experimented with,
or notes on the airline carrier you selected.]
```
