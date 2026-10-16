# PRD.md: LandGuard AI (Project Requirements Document)

> **Read this first.** It defines what we are building and why.
> Sibling files: `architecture.md` · `rules.md` · `phases.md` · `design.md` · `memory.md`
> Event: LandTech Innovation Hackathon 2026 · Team: PROTON · Repo: `LandGuard-AI`

---

## 1. What to Build

**LandGuard AI** is a **Bangla-first** land document verification and fraud-risk detection prototype for Bangladesh.

A user uploads a land document (PDF/image). The system extracts key fields, compares them with structured land records, detects inconsistencies, calculates an **explainable risk score**, and generates a downloadable **verification report**.

```
Upload → OCR/Parse → AI Extraction → Cross-Verify → Conflict Detection → Risk Score → PDF Report
```

**Tagline (EN):** Verify Before You Buy.
**Tagline (BN):** কেনার আগে যাচাই করুন।

### 1.1 Positioning (mandatory wording)
> "Our prototype demonstrates an AI-assisted verification workflow using structured and synthetic land records, designed to integrate with authorized land databases in the future."

Never claim the system verifies government records. A risk score indicates **potential inconsistencies**, not proof of fraud or legal ownership.

### 1.2 Objective
Deliver a **working, immediately runnable prototype** that perfects three things:
1. **Document → AI Extraction**
2. **Record → Conflict Detection**
3. **Conflict → Explainable Risk Score + Report**

---

## 2. Source: Meeting Decisions (Oct 16, 2026)

| # | Decision / Signal | Impact on the project |
|---|-------------------|-----------------------|
| D1 | **Bangla must be the primary language.** English is acceptable. | UI is Bangla-first (default `bn`). All user-facing strings go through i18n. Reports are Bangla-first. |
| D2 | **Login system is essential.** | Auth is Phase 1, never optional. |
| D3 | **Translation system is secondary.** | EN/BN toggle is built *after* the core flow; Bangla default ships first. |
| D4 | Prototype must be **implementable immediately** and meet **minimum quality**. | One-command setup, seeded data, no broken pages. README run time under 15 min. |
| D5 | Evaluation is by **research quality, prototype and final-round deliverables**. | Include research/comparison section and a working demo. |
| D6 | **System-analyst-level evaluation** was called for. | Ship system-analysis docs: use cases, DFD, ERD, existing-system comparison. |
| D7 | Land projects involve **admin users** (and higher authority such as the Land Minister). | Roles: `citizen` and `admin` (land-office officer). No ministerial features in v1. |
| D8 | Emphasis on **data interoperability, user-friendly UI, digital-government integration, data safety (leak prevention)**. | Provider adapter pattern, audit logs, access control, no real PII, simple UI. |
| D9 | Participants should use **authentic, publicly available data** for realistic use cases. | Use public administrative geography (district/upazila/mouza names) and real-format fields. Owner names and records stay **synthetic**. |
| D10 | Submission mentions a **90-second video**, optional visualization, presentation video. | Produce a ≤ 90 s demo video, backup recording, slides. (Exact rules need confirmation, see §9.) |
| D11 | Action: report the **GitHub repo link** and **share an email for access**. | Keep repo clean; README and access instructions ready. |

> The meeting notes are Gemini auto-generated and partly garbled (e.g. "Cedal surveys", "35 and 180 seconds"). Treat items in §9 as unconfirmed.

---

## 3. Targeted Users

| User | Description | Primary use cases |
|------|-------------|-------------------|
| **Citizen (buyer/seller/heir)** | Ordinary person checking land papers before a transaction | Upload a document, see mismatches, understand the risk, download a report |
| **Admin (land-office officer / reviewer)** | Authorized staff reviewing flagged cases | See all verifications, filter high-risk cases, manage reference records, view audit logs |
| **Judges / evaluators** | Hackathon panel | See a complete, credible, safe, working flow in 2-3 minutes |

### 3.1 Use cases (UC)
- **UC-1** Register / log in (Bangla UI).
- **UC-2** Upload land document and receive extracted fields.
- **UC-3** View per-field comparison against the reference record.
- **UC-4** View explainable risk score and reasons.
- **UC-5** View ownership timeline with gap warning.
- **UC-6** Download PDF verification report.
- **UC-7** Dashboard: see totals and recent verifications.
- **UC-8 (admin)** Review all verifications, filter by risk, manage reference records, read audit log.
- **UC-9** Switch language BN ↔ EN (secondary).

---

## 4. Features

Priority: **P0** = must ship · **P1** = should ship · **P2** = stretch (only after P0 passes 10 E2E runs).

| ID | Feature | Pri | Acceptance criteria |
|----|---------|-----|---------------------|
| F-01 | **Authentication** (register, login, logout, session) | P0 | Passwords hashed; CSRF on forms; session regenerated on login; unauthenticated users redirected; Bangla messages |
| F-02 | **Role-based access** (`citizen`, `admin`) | P0 | Citizens see only their own data; admin pages return 403 to citizens |
| F-03 | **Bangla-first UI + i18n layer** | P0 | Default language `bn`; no hardcoded user-facing strings; Bangla renders correctly everywhere incl. PDF |
| F-04 | **Document upload** (PDF/JPG/PNG ≤ 5 MB) | P0 | MIME + extension + size validated; random filename; stored outside web root; clear Bangla errors |
| F-05 | **AI extraction** | P0 | Returns owner, khatian, dag, mouza, upazila, district, area, document no., registration date + confidence + missing fields; ≥ 90% field accuracy on synthetic docs |
| F-06 | **Normalization** | P0 | Bangla→ASCII digits, Md./মোঃ unification, area units (শতাংশ/শতক/acre/katha) → decimals |
| F-07 | **Cross-verification** | P0 | Compares extracted vs reference by (khatian, dag); per-field ✓ ❌ ⚠️ |
| F-08 | **Risk engine (explainable)** | P0 | Weighted score 0-100, level LOW/MEDIUM/HIGH, `reasons[]` in plain Bangla/English; weights in config |
| F-09 | **Result page** | P0 | Extracted data, comparison table, gauge, reasons, disclaimer |
| F-10 | **PDF report** | P0 | ID `LG-2026-XXXXX`, Bangla text renders, disclaimer, timestamp |
| F-11 | **Dashboard** | P0 | Total / Verified / Potential conflicts / High-risk counts + recent table |
| F-12 | **Audit log** | P1 | Logs login, upload, verify, report download, admin actions (no document contents) |
| F-13 | **Ownership timeline + chain-gap warning** | P1 | Timeline from `ownership_history`; gap flagged; adds chain-gap points to score |
| F-14 | **Admin panel** (all verifications, reference-record CRUD) | P1 | Admin only; filter by risk level |
| F-15 | **EN/BN language toggle** | P1 (secondary per D3) | Full UI + report switch; preference saved per user |
| F-16 | **Landing page** (Bangla-first) | P1 | Explains flow, interactive demo, disclaimer |
| F-17 | **Provider adapter for land records** | P1 | `SyntheticProvider` now; interface ready for an authorized API later |
| F-18 | **Dashboard charts** | P2 | Risk distribution chart |
| F-19 | **Submission pack** | P0 | README, architecture diagram, system-analysis docs, ≤ 90 s video, slides, backup demo |

### 4.1 Non-goals (v1)
Real government database access · legal advice or legal-ownership determination · payments · blockchain · native mobile app · ministerial/minister-level dashboards · real citizen data.

---

## 5. Risk Scoring Specification (single source of truth)

| Factor | Weight | Rule |
|--------|-------:|------|
| Owner mismatch | 35 | Fuzzy ≥ 90 match · 75-89 partial (half) · < 75 mismatch (full) |
| Area mismatch | 20 | ≤ 2% match · 2-5% half · > 5% full |
| Dag mismatch | 15 | Exact after normalization |
| Khatian mismatch | 15 | Exact after normalization |
| Ownership chain gap | 10 | Gap in `ownership_history` |
| Missing information | 3 | Scaled by missing-field ratio |
| Suspicious document | 2 | Low OCR confidence / inconsistent dates |

Levels: **0-29 LOW 🟢 · 30-59 MEDIUM 🟡 · 60-100 HIGH 🔴**

**Canonical demo:** uploaded *Md. Rahim / 10245 / 456 / 12 dec* vs record *Md. Karim / 10245 / 456 / 10 dec* + chain gap → 35 + 20 + 10 = **65 / HIGH**.
(The earlier brainstorm showed 82; that was illustrative and does not match these weights. Use **65** everywhere.)

---

## 6. Data Requirements

- **Reference records:** ≥ 30 synthetic `land_records` using real Bangladesh administrative names (division/district/upazila) and realistic khatian/dag/mouza formats.
- **Owner names, document numbers, ownership chains:** generated, never real people.
- **3 demo documents** (all watermarked "SYNTHETIC / SAMPLE: NOT A REAL DOCUMENT"):
  - `clean_match_deed.pdf` → 🟢 LOW
  - `medium_risk_deed.pdf` → 🟡 MEDIUM
  - `Rahim_Land_Deed.pdf` → 🔴 HIGH (65)
- Document the public sources used for administrative names in `docs/data-sources.md`.

---

## 7. Success Metrics

| Metric | Target |
|--------|--------|
| Demo files produce expected level | 3 / 3 |
| Upload → result → PDF succeeds | 10 consecutive runs |
| Extraction field accuracy (synthetic) | ≥ 90% |
| Risk-engine unit tests | ≥ 10 passing incl. boundaries 29/30, 59/60 |
| Fresh-machine setup time | < 15 min |
| Demo length | ≤ 3 min live, ≤ 90 s video |

---

## 8. Deliverables for Submission

1. Public GitHub repo (`LandGuard-AI`) with README, setup, screenshots.
2. Working prototype with seeded demo data.
3. ≤ 90-second demo video + backup recording.
4. Presentation slides and presentation video (if required).
5. System-analysis pack: use cases, DFD, ERD, existing-system comparison (`docs/system-analysis.md`).
6. Optional visualization (architecture diagram / flow).
7. Access email shared with organizers if requested.

---

## 9. Open Questions (unconfirmed from meeting notes; ask organizers)

1. Are the visualization format, live demo video and presentation video **mandatory or optional**? Is the **90-second** item a proposal video or the demo video?
2. What do "**35 and 180 seconds**" refer to (time limits, security metrics)?
3. What exactly is "authentic publicly available data" expected to mean for land records?
4. "Cedal surveys" is likely **Cadastral Survey (CS)** record types; confirm scope expected.
5. Which email must be granted access, and to what (repo, system, submission portal)?
6. Is the **Land Minister / higher-authority role** expected in the prototype or only discussed as context?
