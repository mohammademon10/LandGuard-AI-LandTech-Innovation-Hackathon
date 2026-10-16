# phases.md: LandGuard AI (Development Roadmap)

> Work **one phase at a time**. Each phase ends at a **gate**: tests pass, browser check done, `memory.md` updated, then wait for approval.
> Meeting-driven priority: **Login first (D2) → Core UI (Bangla-first, D1) → features → translation toggle last among features (D3).**

| Phase | Name | Priority |
|------:|------|----------|
| 0 | Setup & scaffold | P0 |
| 1 | Login / Authentication | P0 |
| 2 | Dashboard / Core User Interface (Bangla-first) | P0 |
| 3 | Database, seed data & demo documents | P0 |
| 4 | AI extraction service | P0 |
| 5 | Verification & risk engine | P0 |
| 6 | Upload → Result flow (integration) | P0 |
| 7 | PDF verification report | P0 |
| 8 | Ownership timeline & chain gap | P1 |
| 9 | Admin panel & audit log | P1 |
| 10 | English toggle (secondary translation) | P1 |
| 11 | Landing page | P1 |
| 12 | Integration, testing & hardening | P0 |
| 13 | Submission pack | P0 |

> Phases 3-5 may run in parallel by different people (full-stack vs AI). Phase 6 requires 1-5.

---

## Phase 0: Setup & Scaffold
**Goal:** runnable skeleton.
- Create folder structure from `architecture.md`, `.gitignore`, `.env.example`, README skeleton, LICENSE.
- `scripts/setup.cmd` and `scripts/run-all.cmd` (Windows).
- Composer and Python venv setup; `GET /health` on AI service; PHP "hello" route.
- **Gate:** both servers start with one command; repo pushes cleanly; no secrets tracked.

## Phase 1: Login / Authentication ⭐ (essential)
**Goal:** secure, Bangla-first auth.
- `users` table (role, language). Register, login, logout, `GET /api/me`.
- `password_hash`, CSRF token, session regeneration, login rate limit, route protection middleware, role middleware (`citizen`, `admin`).
- Pages: `login.html`, `register.html` in Bangla with validation messages; redirect rules.
- Seed one admin and one citizen (documented in README, dev only).
- Basic i18n loader with `bn.json` (auth strings).
- **Tests:** register/login/logout, wrong password, duplicate email, CSRF missing → 403, protected route → 401, citizen on admin route → 403.
- **Gate:** auth flow works end-to-end in the browser; audit entries for login/logout.

## Phase 2: Dashboard / Core User Interface
**Goal:** the app shell people will actually use.
- Shared layout (navbar, language-ready, user menu), design tokens from `design.md`.
- `dashboard.html`: KPI cards (মোট নথি, যাচাইকৃত, সম্ভাব্য অসঙ্গতি, উচ্চ ঝুঁকি) + recent verifications table with risk badges (placeholder data until Phase 6).
- Upload page UI (drag and drop, type/size validation on the client, progress state).
- Result page skeleton (comparison table, gauge component, reasons list).
- Empty states, loading states, error states, 375/768/1280 responsive.
- **Gate:** all core pages render in Bangla, no console errors, accessibility basics (labels, focus, contrast).

## Phase 3: Database, Seed Data & Demo Documents
- `landguard.sql` (schema v2 from `architecture.md`), `seed.sql` with ≥ 30 synthetic `land_records` using real public administrative names, `ownership_history` for demo records (incl. one with a gap).
- Create 3 watermarked demo documents (`clean_match_deed`, `medium_risk_deed`, `Rahim_Land_Deed`) in Bangla and/or English layout.
- `docs/data-sources.md` listing public sources used for administrative names.
- **Gate:** import works from scratch; queries return expected demo records.

## Phase 4: AI Extraction Service
- FastAPI `/health`, `/extract`; PDF→image (PyMuPDF), OCR (Tesseract `eng+ben`), Gemini structured extraction, OCR+regex fallback, `DEMO_MODE` cache.
- Normalizer: Bangla digits, `Md.`/`মোঃ`, area units → decimals.
- **Tests:** ≥ 8 normalization cases; extraction on 3 demo files matches ground truth; fallback chain tested with Gemini disabled.
- **Gate:** `/extract` returns the JSON contract for all demo files, offline-capable.

## Phase 5: Verification & Risk Engine
- `/verify`: matcher (owner fuzzy, exact khatian/dag, area tolerance), chain-gap detection, scorer with weights from `config.py`, `reasons[]` with codes and points.
- **Tests (≥ 10):** all-match, owner-only, area-only 3%/6%, dag-only, khatian-only, chain gap, missing info, boundaries 29/30 and 59/60, **Rahim = 65 / HIGH**, unknown record.
- **Gate:** scores match `PRD.md` §5 exactly; reasons sum to score.

## Phase 6: Upload → Result Flow (Integration)
- PHP: upload validation and storage, `AiClient`, `SyntheticProvider`, transactional save of extraction + verification, `report_code` generation (`LG-2026-XXXXX`), dashboard stats API, results API with ownership checks.
- Wire the frontend pages to real APIs; remove placeholders.
- **Tests:** curl for each endpoint incl. 401/403/413/415; citizen cannot read another user's result.
- **Gate:** the 3 demo files give LOW / MEDIUM / HIGH(65) in the browser.

## Phase 7: PDF Verification Report
- Dompdf template with embedded Noto Sans Bengali; ID, extracted fields, comparison table, score, level, reasons, disclaimer (BN primary), timestamp.
- Authenticated download route; audit log entry.
- **Gate:** Bangla renders correctly (no broken conjuncts/boxes); PDF opens on another machine.

## Phase 8: Ownership Timeline & Chain Gap (P1)
- `/api/ownership/{land_id}`; timeline UI with a visible "missing record" gap marker; chain-gap warning on the result page.
- **Do not change weights.**
- **Gate:** Rahim demo shows gap; clean demo shows none.

## Phase 9: Admin Panel & Audit Log (P1)
- Admin dashboard: all verifications with risk filter, reference-record CRUD, audit log viewer (read-only).
- **Tests:** admin-only access, validation on record CRUD.
- **Gate:** citizens get 403; admin flows work in Bangla.

## Phase 10: English Toggle: Secondary Translation (P1)
- Complete `en.json`; language switch in navbar; persisted in `users.language` / `localStorage`; PDF respects selected language.
- **Gate:** every screen switches with no missing keys (add a script that diffs key sets).

## Phase 11: Landing Page (P1)
- Bangla-first landing per `design.md`: hero, problem, how it works, features, risk-score explainer, interactive demo (hardcoded data), FAQ, disclaimer. Free images only with credits, with fallbacks.
- **Gate:** Lighthouse Perf ≥ 90, A11y ≥ 95, SEO ≥ 90 at 375 and 1280 px.

## Phase 12: Integration, Testing & Hardening
- `scripts/e2e.py`: 3 demo files × 10 runs through the real stack with timings.
- Security checklist pass (see `rules.md` §4.1), dependency review, failure-mode tests (Gemini down, OCR empty, unknown khatian, wrong file type).
- Fresh-machine setup test: follow README from scratch, time it (< 15 min).
- **Gate:** 30/30 E2E runs pass; no critical or high findings open.

## Phase 13: Submission Pack
- README (problem, features, architecture diagram, setup, demo steps, risk scoring, screenshots, limitations, team PROTON, roadmap).
- `docs/system-analysis.md`: actors, use cases, DFD (level 0-1), ERD, comparison with existing systems and gaps, interoperability and data-safety approach.
- `docs/pitch-script.md` (2-min) and `docs/demo-script.md` (3-min); slides; ≤ 90 s demo video + backup recording; optional visualization.
- Report the GitHub link; prepare the access email the organizers asked for.
- **Gate:** repo public and clean; video plays; checklist in `PRD.md` §8 complete.

---

## Phase Gate Checklist (copy for every phase)
- [ ] Scope limited to this phase
- [ ] Tests written and passing (show output)
- [ ] Browser check done at 375/768/1280, Bangla text verified
- [ ] No secrets or real data committed
- [ ] Disclaimer present where required
- [ ] `memory.md` updated
- [ ] Approval requested before the next phase
