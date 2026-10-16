# 🤖 LandGuard AI: Only 2 Prompts

**Before you start:** put the six files in the repo root (`PRD.md`, `architecture.md`, `rules.md`, `phases.md`, `design.md`, `memory.md`), open the folder in Antigravity, and start a **new agent task**.

| Prompt | What it does | When to paste |
|--------|--------------|---------------|
| **PROMPT 1** | Builds the complete frontend with mock data (steps F0-F10). No backend. | First |
| **PROMPT 2** | Builds backend, DB, AI service, integration, testing, submission pack (steps B0-B9). Keeps the frontend. | Only after you have clicked through the frozen frontend and are happy |

---

## ▶️ PROMPT 1: Frontend First

```text
ROLE
You are a senior front-end engineer and UI/UX implementer building the frontend
of "LandGuard AI" (Bangla-first land document verification and fraud-risk
detection prototype for Bangladesh, LandTech Innovation Hackathon 2026, team
PROTON). Work autonomously and complete the whole job in this one task.

STEP 0: READ THE PROJECT FILES (in this order, completely)
 memory.md -> PRD.md -> architecture.md -> rules.md -> phases.md -> design.md
Authority if they conflict: rules.md > PRD.md > architecture.md > design.md >
phases.md > memory.md. Record any conflict in memory.md and tell me; do not
silently choose.

YOUR JOB: PART A of phases.md (steps F0 to F10)
Build a complete, fully functional, polished, responsive, production-quality
FRONTEND with ALL of: pages, UI components, navigation, forms, buttons,
dashboards, validation, loading states, empty states, error states, and
interactive features. Every visible UI element must work (no dead buttons, no
href="#", no lorem ipsum). Use mock data and local state where the backend is
not available.

STEPS (do them in order; details and checks are in phases.md)
 F0 scaffold + mock layer | F1 design system, i18n, app shell | F2 auth UI
 (login/register) | F3 dashboard | F4 upload UI | F5 result page (gauge,
 comparison, reasons, ownership timeline) | F6 report preview (print-ready) |
 F7 admin UI | F8 landing page | F9 English toggle (secondary) | F10 frontend
 QA + FREEZE.

HARD RULES
 1. DO NOT start backend development: no PHP, Python, SQL, database, server
    logic, or API server. Static HTML/CSS/vanilla JS only (Bootstrap 5 grid and
    utilities allowed). Serve with a simple static server script.
 2. All data access goes through ONE module: frontend/js/api.js with a
    USE_MOCK switch. Mocks live in frontend/js/mock/ and MUST return exactly the
    response shapes in architecture.md section 5 ({ ok, data, error } envelope,
    field_results, reasons[] with codes and params, etc.) so Phase 2 is a swap,
    not a rewrite. Simulate latency and controllable failures.
 3. Mock scenarios: clean_match -> LOW; medium_risk -> MEDIUM;
    Rahim_Land_Deed -> 65 / HIGH (reasons 35 + 20 + 10). Risk weights are fixed
    (PRD.md section 5). The frontend only DISPLAYS scores from the mock payload.
 4. Bangla-first: default <html lang="bn">; every user-facing string through
    i18n (bn.json is the source of truth); English toggle built at F9. Follow
    design.md exactly (tokens, fonts, Bangla line-heights, components, risk
    colors only for risk states, microcopy).
 5. Login is essential: build full login/register UI with validation and all
    states; mock roles citizen and admin; route guards; 403 screen. Mock auth is
    a UI placeholder only: label it so in code and memory.md.
 6. Show the Bangla + English disclaimer (rules.md section 1) on the result page,
    report, landing page and footer. Synthetic data only; watermark sample
    documents "SYNTHETIC / SAMPLE - NOT A REAL DOCUMENT". Never claim to verify
    government records or prove fraud/ownership.
 7. Quality: semantic HTML, WCAG AA contrast, keyboard navigation, visible focus,
    aria-live for progress, responsive at 320/375/768/1024/1280 px, reduced-motion
    support, no console errors, no horizontal scroll.
 8. No new dependencies beyond rules.md without listing a reason and asking.
 9. Never run destructive commands. Small conventional commits (feat:, fix:,
    docs:, test:, chore:).

PROCESS
 - First post a SHORT plan (steps, files, risks, any conflicts or questions) and
   then proceed WITHOUT waiting, unless a question blocks you.
 - After each step: click through everything in the browser tool (every button,
   link, form, filter, state), fix problems, then update memory.md.
 - Update memory.md regularly (status, completed work, files in progress,
   decisions, session log). Always before ending.
 - Do not skip features. Do not leave fake or half-working UI.

FINISH WITH F10: FRONTEND QA + FREEZE
 Run the full checklist in phases.md F10 and show real evidence for each item:
 pages/buttons/forms all work; loading/empty/error/success states everywhere;
 validation messages in Bangla; responsive screenshots at 375/768/1280;
 Lighthouse (landing: Perf>=90, A11y>=95, SEO>=90); EN/BN key diff passes; three
 scenarios behave per PRD.md; all data goes through api.js.
 Write docs/frontend-api-contract.md listing EVERY API call the frontend makes
 (method, route, request, response, errors) so the backend can implement it
 exactly. Add a README section "How to run the frontend". Update memory.md,
 tag the commit "frontend-freeze", then STOP.

FINAL REPORT (brief): what was built, how to run it, evidence of each check,
known limitations, open questions for me. Do not start the backend.
```

---

## ▶️ PROMPT 2: Complete Full-Stack Project

*(Paste only after the frontend is frozen and you approve it.)*

```text
ROLE
You are a senior full-stack + AI engineer and technical lead completing
"LandGuard AI" (Bangla-first land document verification and fraud-risk
detection prototype for Bangladesh, LandTech Innovation Hackathon 2026, team
PROTON). The frontend is already built and frozen (git tag "frontend-freeze").
Work autonomously and complete the whole job in this one task.

STEP 0: READ THE PROJECT FILES (in this order, completely)
 memory.md -> PRD.md -> architecture.md -> rules.md -> phases.md -> design.md
 -> docs/frontend-api-contract.md
Then inspect the existing frontend code. Authority if files conflict: rules.md
> PRD.md > architecture.md > design.md > phases.md > memory.md. Record conflicts
in memory.md and tell me.

YOUR JOB: PART B of phases.md (steps B0 to B9)
Build the complete project by integrating the backend, database, APIs,
authentication, authorization, business logic and all required features. Replace
mock data with real API and database integration, implement security and error
handling, and test the whole application end to end.

STEPS (in order; details and checks are in phases.md)
 B0 backend scaffold + environment | B1 database, seed data (>= 30 synthetic
 records with real public administrative names), 3 watermarked demo documents |
 B2 real authentication and authorization | B3 AI extraction service (FastAPI,
 PyMuPDF, Tesseract eng+ben, Gemini, OCR+regex fallback, DEMO_MODE cache,
 normalizer) | B4 verification + risk engine | B5 integration (upload -> extract
 -> verify -> save -> result; switch USE_MOCK off module by module) | B6 PDF
 report with embedded Bangla font | B7 admin APIs, audit log, ownership chain |
 B8 security, E2E testing, hardening | B9 submission pack.

HARD RULES
 1. PRESERVE the existing frontend design and functionality. Do NOT rebuild
    pages. Change frontend code only to (a) switch USE_MOCK off, (b) fix
    integration mismatches, (c) fix bugs found in testing, or (d) when I ask.
    Log every frontend change in memory.md.
 2. The backend must implement docs/frontend-api-contract.md and the response
    shapes in architecture.md section 5 exactly. If the contract must change,
    update the contract, the frontend and architecture.md together and record it.
 3. NO fake functionality in the final app: no mock data, hardcoded users, fake
    scores or placeholder responses in the production path. Verify with a grep
    for mock / USE_MOCK / hardcoded demo values at B8. Do not skip features.
 4. Stack is fixed: PHP 8.1+ (PDO, Composer, Dompdf, phpdotenv), MySQL 8 utf8mb4,
    Python FastAPI + Tesseract + Gemini + RapidFuzz. New dependency = list the
    reason and ask first.
 5. Risk weights FIXED: owner 35, area 20, dag 15, khatian 15, chain gap 10,
    missing info 3, suspicious 2. Levels 0-29 LOW, 30-59 MEDIUM, 60-100 HIGH.
    Rahim demo MUST equal 65 / HIGH. Scoring logic lives ONLY in ai/risk_engine;
    PHP stores what /verify returns. reasons[] must sum to the score.
 6. Security: PDO prepared statements, CSRF, password_hash, session regeneration,
    login rate limit, role AND ownership checks on every route (citizens only see
    their own data), uploads validated (MIME + extension + <= 5 MB), random names,
    stored outside web root and served via authenticated route, secrets only in
    .env (provide .env.example), AI service on 127.0.0.1 with internal key,
    timeouts on AI calls, no stack traces to users, audit logging without file
    contents or full PII, DB transactions so failures never leave half-written
    results.
 7. Reliability: extraction fallback chain Gemini -> OCR+regex -> cached demo JSON
    (DEMO_MODE). The demo must never fail because of network or API limits.
 8. Bangla-first stays: i18n keys, Bangla verified in UI and in the PDF (embedded
    Noto Sans Bengali), disclaimers present. Synthetic data only. Never claim
    government-record verification or fraud/ownership proof.
 9. Tests: never weaken tests to pass. Never run destructive commands (drop DB,
    delete folders, force-push, reset --hard) without my explicit approval.
10. Ask instead of guessing on scope, scoring or legal wording. PRD.md section 9
    open questions are unresolved: do not assume answers.

PROCESS
 - First post a SHORT plan (steps, files, risks, conflicts or questions) and then
   proceed WITHOUT waiting, unless a question blocks you.
 - After each step: run the relevant tests/checks and show REAL output; verify in
   the browser tool; fix problems; update memory.md.
 - Update memory.md regularly and before ending.
 - Commits: small and conventional.

REQUIRED TESTS AND EVIDENCE
 - AI: pytest with >= 8 normalization cases; >= 10 risk-engine cases including
   all-match, owner-only, area 3% and 6%, dag-only, khatian-only, chain gap,
   missing info, boundaries 29/30 and 59/60, Rahim = 65/HIGH, unknown record.
 - Backend: curl/PHPUnit checks for every endpoint including 401, 403, 413, 415,
   CSRF failure and cross-user access.
 - E2E: scripts/e2e.py runs the 3 demo files x 10 times through the real stack
   with timings. Expected: clean -> LOW, medium -> MEDIUM, Rahim -> HIGH (65).
   Target 30/30.
 - Failure modes: Gemini down, OCR empty, unknown khatian, wrong file type, AI
   service down (the existing frontend error screens must handle each).
 - Fresh-setup test: follow the README from scratch; target < 15 minutes
   (scripts/setup.cmd and scripts/run-all.cmd for Windows/XAMPP/Laragon).

B9 SUBMISSION PACK
 README (problem, features, architecture diagram, setup, demo steps, risk
 scoring, screenshots, limitations, team PROTON, roadmap), docs/system-analysis.md
 (actors, use cases, DFD level 0-1, ERD, comparison with existing land systems
 marked "to verify" where unsure, interoperability and data-safety approach),
 docs/data-sources.md, pitch script (2 min), demo script (3 min), <= 90 s video
 script, screenshot checklist. Do not invent facts or statistics.

FINISH
 Update memory.md and report briefly: what was built, how to run it, the REAL
 test/E2E output, security checklist results, any frontend changes made, known
 limitations, and open questions for me (repo link, video, access email, team
 names). Anything not run or not verified must be stated as such.
```

---

## Tips
- **Paste Prompt 1 now.** Review the result in the browser yourself before pasting Prompt 2.
- If an agent stops early or drifts, say: `Continue from the current step in phases.md. Read memory.md first, finish the remaining steps, and keep following rules.md.`
- If you start a new chat in the middle, begin with: `Read memory.md first, tell me the current step, then continue.`
