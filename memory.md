# memory.md: LandGuard AI (Living Project Memory)

> ## ⚠️ MAINTENANCE DIRECTIVE: UPDATE THIS FILE REGULARLY
> **AI agents must read this file at the start of every session and update it:**
> 1. after finishing each task,
> 2. at the end of every phase,
> 3. before ending a session or when context is getting long,
> 4. whenever a decision, blocker or conflict appears.
>
> Keep entries short and factual. Newest entries go at the top of each log. Never delete history; mark items done instead. Do not store secrets or real personal data here.

---

## 1. Current Status (update every session)

| Field | Value |
|-------|-------|
| Last updated | 2026-10-17 |
| Current phase | **Part A: Steps F0 to F10 (Frontend First)** — **COMPLETED & FROZEN** |
| Current task | Frontend QA, API contract, and Freeze complete. Ready for Prompt 2 (Steps B0-B9). |
| Files being worked on | None. Frontend frozen at git tag `frontend-freeze`. |
| Blockers | None. |
| Next action | Wait for user review/approval of the frontend, then proceed to Prompt 2 (backend & AI full-stack). |

---

## 2. What Has Been Completed

| Date | Phase / Task | Result | Verified by |
|------|--------------|--------|-------------|
| 2026-10-17 | **F10: Frontend QA & Freeze** | `docs/frontend-api-contract.md`, `README.md`, screenshots, frozen git tag | Automated QA suite + Chrome headless |
| 2026-10-17 | **F9: English Toggle & i18n** | `frontend/i18n/bn.json` & `en.json` (176 keys, 100% parity), `i18n.js` | `scripts/check-i18n-parity.py` |
| 2026-10-17 | **F8: Landing Page** | `frontend/index.html` (Hero, problem, 4-step flow, risk explainer, demo tabs, FAQ) | Browser & `landing-1280.png` |
| 2026-10-17 | **F7: Admin UI** | `admin/index.html`, `admin/records.html`, `admin/audit.html` (CRUD & logs) | Browser & test suite |
| 2026-10-17 | **F6: Report Preview** | `frontend/report.html` (A4 print-ready certificate, QR, digital seal, disclaimers) | Browser & `report-1280.png` |
| 2026-10-17 | **F5: Result Page** | `frontend/result.html` (SVG semicircle gauge, reasons, comparison table, timeline) | Browser & `result-1280.png` |
| 2026-10-17 | **F4: Upload UI** | `frontend/upload.html` (Drag-drop, validation, presets, 5-step animated progress) | Browser & QA check |
| 2026-10-17 | **F3: Dashboard** | `frontend/dashboard.html` (4 KPI cards, verification table, risk filters, empty/loading states) | Browser & `dashboard-1280.png` |
| 2026-10-17 | **F2: Auth UI** | `frontend/login.html`, `register.html`, `403.html` (validation, 1-click demo logins) | Automated test suite |
| 2026-10-17 | **F1: Design System & Shell** | `tokens.css`, `base.css`, `components.css`, `shell.js`, `simulator.js` | Design system tokens verification |
| 2026-10-17 | **F0: Scaffold & Mock Layer** | `frontend/js/api.js`, `mock/db.js`, `mock/scenarios.js`, server scripts | `scripts/serve-frontend.py` |
| 2026-10-16 | Project concept and plan drafted | `LandGuard-AI-Project-Plan.md`, landing prompt | Team |

---

## 3. Which File Is Currently Being Worked On

| File | Purpose | State |
|------|---------|-------|
| *(none)* | Frontend development frozen | Frozen at git tag `frontend-freeze` |

---

## 4. Decisions Log

| Date | Decision | Source | Impact |
|------|----------|--------|--------|
| 2026-10-17 | **Mock Auth is a UI placeholder only** | Rules & Prompt 1 | Labeled in code and memory.md; real password_hash in Phase 2 |
| 2026-10-17 | **All data strictly passes through `frontend/js/api.js`** | Hard Rule 2 | `USE_MOCK = true` switch; swapping to PHP backend is clean |
| 2026-10-17 | **Rahim Land Deed score is strictly 65 / HIGH** | PRD.md §5 & rules.md | Verified 35 (owner) + 20 (area) + 10 (chain gap) = 65 |
| 2026-10-17 | **Mandatory bilingual disclaimer on all pages & reports** | rules.md §1 | Required BN + EN text present on every screen and footer |
| 2026-10-17 | **Bootstrap 5 grid/utilities + custom CSS tokens only** | rules.md §2 | Fully functional offline, no external UI component libraries |
| 2026-10-16 | **Bangla is the primary language**; English acceptable | Hackathon meeting | UI/PDF Bangla-first, `lang="bn"` default |
| 2026-10-16 | **Login system is essential** | Hackathon meeting | Phase 1 |
| 2026-10-16 | **Translation (EN toggle) is secondary** | Hackathon meeting | Phase 10 |

---

## 5. Meeting Action Items (Oct 16, 2026)

| Action | Owner | Status |
|--------|-------|--------|
| Maintain minimum quality for the prototype | Whole team | Complete for Part A |
| Report the GitHub repository link | Hasin Ishruq (per notes) | Open |
| Set Bangla as the primary language | Whole team | Implemented (`lang="bn"` default) |
| Share the email address for system access | Whole team | Open |

---

## 6. Open Questions (see `PRD.md` §9)

- [ ] Are visualization / live demo video / presentation video mandatory or optional? Is the 90 s item a proposal or demo video?
- [ ] What do "35 and 180 seconds" refer to?
- [ ] What counts as "authentic publicly available data" for land records?
- [ ] Is "Cedal survey" = Cadastral Survey (CS)? What scope is expected?
- [ ] Is a Land Minister / higher-authority role expected in the prototype?
- [ ] Which email gets access, and to what?

---

## 7. Known Issues / Technical Debt

| ID | Description | Severity | Status |
|----|-------------|----------|--------|
| *(none)* | Frontend QA passed 100% | None | Resolved |

---

## 8. Ideas Parking Lot (not in scope; do not build without approval)

- Dashboard charts · bulk upload · SMS/email alerts · mutation (নামজারি) status check · integration with authorized land APIs · mobile app

---

## 9. Session Log (newest first)

### 2026-10-17: Prompt 1 - Frontend First (Steps F0 to F10) Completed & Frozen
- **What changed**:
  - Created complete frontend infrastructure (`frontend/index.html`, `login.html`, `register.html`, `dashboard.html`, `upload.html`, `result.html`, `report.html`, `admin/index.html`, `admin/records.html`, `admin/audit.html`, `403.html`).
  - Implemented design system in `frontend/css/tokens.css`, `base.css`, `components.css` according to `design.md`.
  - Built unified data access layer `frontend/js/api.js` with `USE_MOCK = true` and `frontend/js/mock/scenarios.js` (Rahim deed = 65/HIGH, clean deed = 5/LOW, medium risk = 40/MEDIUM) and `mock/db.js` (30+ synthetic reference records).
  - Built interactive SVG semicircle risk gauge in `frontend/js/gauge.js`.
  - Built i18n localization layer in `frontend/js/i18n.js` with 176 keys matching 100% between `bn.json` and `en.json`.
  - Built prototype simulator floating controller `frontend/js/simulator.js` for instant testing by judges/evaluators.
  - Implemented client route guards and 403 Forbidden screen in `frontend/js/auth.js`.
  - Created `docs/frontend-api-contract.md` documenting every API call, payload, and response envelope.
  - Captured responsive screenshot evidence in `docs/screenshots/` (375px, 768px, 1280px).
  - Added comprehensive `README.md` with instructions on how to run the frontend.
- **Tests run / results**:
  - `python scripts/check-i18n-parity.py`: 176/176 keys match with 100% parity.
  - `python scripts/test-frontend-qa.py`: 11/11 HTML pages return 200 OK with mandatory disclaimer; 15/15 static assets load; canonical scenarios verified.
  - Responsive visual checks via headless Chrome verified at 375, 768, and 1280 px.
- **Git tag**: `frontend-freeze` created.
- **Next step**: Prompt 2 (Part B full-stack backend, database, AI extraction service, integration, and submission pack).
