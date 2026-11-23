# Research Sources & Policy References: Airline Agent Gatekeeper

This document catalogs the academic literature, news investigations, regulatory frameworks, and airline enterprise policies that form the problem statement and technical architecture of the **Airline Agent Gatekeeper** system.

---

## 1. Assignment-Provided Core References

### Reference 1: OfficeChai Enterprise AI Agent Blocking Analysis (Delta Air Lines Focus)
- **Headline:** *Amazon, JPMorgan, Schwab, and Delta are all blocking AI agents — here's why*
- **Publication:** *OfficeChai*
- **URL:** [https://officechai.com/ai/amazon-jpmorgan-schwab-and-delta-are-all-blocking-ai-agents-heres-why/](https://officechai.com/ai/amazon-jpmorgan-schwab-and-delta-are-all-blocking-ai-agents-heres-why/)
- **Status:** Verified Assignment Reference
- **Relevance to Airline Agent Gatekeeper:**
  - **Aggressive Inventory Holding & Scraping:** Airlines like **Delta Air Lines** have deployed automated bot detection perimeters to prevent third-party bots from flooding fare query endpoints, holding seat blocks without payment, and initiating rapid automated cancellations.
  - **Protecting Passenger Fare Integrity:** Without an autonomous gatekeeper, bots can exploit promotional fare tiers, alter existing passenger reservations without explicit consent, or claim unauthorized refunds.
  - **Implementation in Project:** Direct motivation for the **8 Airline Gatekeeper Rules**, Rule 3 (Read-Only Fare Access), Rule 4/5 (Flight Booking Limits), and Rule 7 (Refund Protection).

---

### Reference 2: American Banker Investigation (Revocation & Liability)
- **Headline:** *Wells Fargo wants customers to prove they've revoked AI agents*
- **Publication:** *American Banker*
- **URL:** [https://www.americanbanker.com/news/wells-fargo-wants-customers-to-prove-theyve-revoked-ai-agents](https://www.americanbanker.com/news/wells-fargo-wants-customers-to-prove-theyve-revoked-ai-agents)
- **Status:** Verified Assignment Reference
- **Relevance to Airline Agent Gatekeeper:**
  - **Verifiable Revocation Proof:** Examines the legal requirement for customers and passengers to maintain auditable, timestamped proof when revoking a third-party bot's access to their customer profile.
  - **Implementation in Project:** Directly inspired the **Airline AI Agent Revocation Center** and **Rule 2 (Revoked Agent Block)**, where revoked travel agents are permanently barred from performing any further flight operations.

---

## 2. Airline Industry Regulatory & Technical Standards

### Category A: IATA Passenger Service Conference Standards
- **IATA Resolution 850m (Passenger Ticket Discrepancies & Agency Audit):**
  - Regulates automated travel agent and electronic booking interfaces.
  - Mandates strict accountability for automated booking aggregators, preventing unauthorized booking modifications, automated fare hacking, and unconfirmed ticket re-routing.

### Category B: Airline Conditions of Carriage
- **Air India / Delta Air Lines Conditions of Carriage:**
  - Explicitly restricts third-party automated software agents and robotic tools from making bulk seat holds or initiating refund cancellations without verifiable passenger presence.
  - Governs change fee structures and passenger authorization mandates for route alterations (implemented in **Rule 6**).
