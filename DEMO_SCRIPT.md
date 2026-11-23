# 2-Minute Video Demonstration Script: Airline Agent Gatekeeper

**Presenter:** Student / Evaluator  
**Target Duration:** ~120 seconds (2 minutes)  
**Tone:** Confident, clear, professional, airline security engineering focus  
**Screen Setup:** Browser open to `http://localhost:5173` showing the Airline Agent Gatekeeper dashboard in full screen.

---

## Visual Progression & Narration Timeline

### 0:00 – 0:18: Introduction & Airline Dashboard Overview
- **Action:** Start on the **Overview Dashboard**. Hover briefly over the Student Enrolment badge (`ENR-2024-0182`), the Airline Carrier badge (`✈️ Air India [AIRLINE]`), and the Decision Distribution bar.
- **Spoken Narration:**
  > *"Hello! Today I am presenting the **Airline Agent Gatekeeper**, a prototype security and permission governance gateway that controls what third-party AI agents can do on behalf of airline passengers.*
  > *In accordance with the academic assignment requirements, my enrolment number maps directly to the **Airline** category. Here on the dashboard, we see my enrolment badge, our configured carrier—Air India—and live telemetry monitoring total travel agents, processed flight requests, and our decision distribution."*

---

### 0:18 – 0:38: Registered Agent & View Flight Fares (ALLOW)
- **Action:** Click on **Request Gatekeeper** in the sidebar. Click the **"View Fares"** quick scenario button (`view_fares`, Amount: 0). Click **"Evaluate Flight Request"**.
- **Spoken Narration:**
  > *"Let's test our first scenario: a registered active AI travel agent querying flight schedules and fares.*
  > *Submitting `view_fares` for the Delhi to Mumbai route returns **ALLOW** under **Rule 3: Permitted Read-Only Fare Search Allowed**.*
  > *Because read-only fare queries involve zero financial expenditure or seat holding, our deterministic engine permits execution without disturbing the passenger."*

---

### 0:38 – 0:58: Routine Flight Booking Below Booking Limit (ALLOW)
- **Action:** Click the **"Booking (≤ Limit)"** quick preset button (Action: `book_flight`, Fare: ₹6,800, Route: DEL &rarr; BLR, Limit: ₹15,000). Click **"Evaluate Flight Request"**.
- **Spoken Narration:**
  > *"Next, the travel agent attempts an autonomous flight booking of ₹6,800 for flight AI-506.*
  > *Because ₹6,800 is strictly below our configured autonomous booking limit of ₹15,000 and the agent holds booking privileges, the engine returns **ALLOW** under **Rule 4: Flight Booking Below Booking Limit Allowed**.*
  > *This preserves convenience for routine automated ticket purchases."*

---

### 0:58 – 1:22: Flight Booking Above Limit & Passenger Authorization (ASK CUSTOMER)
- **Action:** Click the **"Booking (> Limit)"** preset button (Action: `book_flight`, Fare: ₹28,500, Route: DEL &rarr; LHR). Click **"Evaluate Flight Request"**.
- Result card displays **ASK CUSTOMER** under Rule 5. Click **"Authorize Now"** or navigate to **Customer Approval**. Click **APPROVE**.
- **Spoken Narration:**
  > *"Now, what happens if an agent attempts a high-value international ticket booking of ₹28,500?*
  > *The engine evaluates **Rule 5: Booking Above Booking Limit** and returns **ASK CUSTOMER**.*
  > *The ticket issuance is halted and sent to our Passenger Authorization Queue.*
  > *In this simulated environment, the passenger can review the flight number, route, and fare. Clicking **APPROVE** authorizes the booking and logs the passenger's decision with an exact timestamp."*

---

### 1:22 – 1:42: Perimeter Defenses: Unknown Agent & Revoked Agent (BLOCK)
- **Action:** Return to **Request Gatekeeper**. Click **"Unknown Agent"** preset &rarr; Click **"Evaluate"** &rarr; Shows **BLOCK** (Rule 1). Navigate to **Revocation Center**, show the revoked agent, and click **"Test Block in Gatekeeper"** &rarr; Shows **BLOCK** (Rule 2).
- **Spoken Narration:**
  > *"Airline Gatekeeper enforces zero-tolerance perimeter defense.*
  > *If an unknown web scraper attempts to reserve seats, **Rule 1** immediately **BLOCKS** it.*
  > *Similarly, when an agent's credentials are revoked in our Revocation Center, **Rule 2** permanently **BLOCKS** all future booking operations.*
  > *Revoked bots cannot be reactivated silently, protecting the airline inventory against unauthorized automated changes."*

---

### 1:42 – 2:00: Persistent Flight Audit Log, Test Lab & Conclusion
- **Action:** Navigate to **Audit Log**. Briefly show the table filtering by ALLOW, ASK CUSTOMER, and BLOCK. Click **Test Lab**, click **"Run All Test Cases"** (shows all 6 required academic tests passing in green).
- **Spoken Narration:**
  > *"Finally, every flight evaluation, registration, and revocation is recorded in our persistent **Audit Log**, which can be exported to CSV or JSON.*
  > *In our **Test Lab**, running all 6 required academic test scenarios executes the real airline decision engine, verifying that our 8-rule deterministic hierarchy functions with 100% accuracy.*
  > *Thank you!"*

---

## Demonstration Checklist for the Student
- [ ] Practiced speaking along with the click sequence.
- [ ] Confirmed microphone input is clear.
- [ ] Screen resolution set to 1080p (1920x1080) with clean browser tabs.
- [ ] Verified that `npm run dev` is running and all airline demo data is loaded.
