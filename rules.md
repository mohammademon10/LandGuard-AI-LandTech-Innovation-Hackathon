# rules.md: LandGuard AI (Rules for AI Coding Agents)

> These rules are binding. If a task conflicts with a rule, **stop and ask** instead of bending the rule.
> Order of authority: `rules.md` > `PRD.md` > `architecture.md` > `design.md` > `phases.md` > `memory.md`.

---

## 1. Non-Negotiable Guardrails

1. **Synthetic data only.** Never use or invent data about real people, real land parcels or real documents. Watermark every sample file `SYNTHETIC / SAMPLE: NOT A REAL DOCUMENT`. Public administrative names (district/upazila) are allowed.
2. **No false claims.** Never state or imply the system verifies government records or proves fraud or ownership. Required disclaimer (BN primary, EN secondary) on the result page, PDF, landing page and README:
   - **BN:** "এটি একটি প্রোটোটাইপ, যা কৃত্রিম (সিনথেটিক) ভূমি রেকর্ড ব্যবহার করে। ঝুঁকির স্কোর সম্ভাব্য অসঙ্গতি নির্দেশ করে; এটি জালিয়াতি বা আইনি মালিকানার প্রমাণ নয়।"
   - **EN:** "Prototype using synthetic land records. Risk score indicates potential inconsistencies, not proof of fraud or legal ownership."
3. **Bangla is the primary language.** Default `lang="bn"`. English is secondary (toggle built after the core flow).
4. **Login is mandatory** for all app pages except landing, login and register.
5. **Never commit secrets.** API keys, passwords and `.env` stay out of git. Only `.env.example`.
6. **Stay in scope.** Build only what the current phase in `phases.md` allows. No stretch features until P0 features pass 10 consecutive E2E runs.
7. **Risk weights are fixed** (see `PRD.md` §5). Do not change weights or thresholds without explicit approval. The Rahim demo must equal **65 / HIGH**.
8. **Do not weaken tests** to make them pass. Fix the cause.
9. **Ask, don't guess,** on scope, stack, scoring or legal/ethical wording.

---

## 2. What to Use

### 2.1 Approved stack and libraries
| Area | Approved |
|------|----------|
| Frontend | HTML5, CSS3, Bootstrap 5 (grid/utilities only), vanilla JS (ES modules) |
| Fonts | Google Fonts: Noto Sans Bengali, Hind Siliguri, Inter, Poppins |
| Backend | PHP 8.1+, PDO, Composer, `vlucas/phpdotenv`, `dompdf/dompdf` |
| Python | `fastapi`, `uvicorn`, `pydantic`, `python-dotenv`, `pytesseract`, `PyMuPDF`, `Pillow`, `opencv-python-headless` (optional), `rapidfuzz`, `google-generativeai` (or the current official Gemini SDK), `pytest`, `httpx` |
| Database | MySQL 8, utf8mb4 |
| Tooling | Git, `.cmd`/`.ps1` helpers for Windows |

Any new dependency must be listed with a one-line reason and approved before install.

### 2.2 Preferred paradigms
- Thin controllers, logic in services; scoring logic only in `ai/risk_engine`.
- Provider adapter for land-record access (`LandRecordProviderInterface`).
- Config over constants: weights and thresholds in `ai/risk_engine/config.py`.
- Message **codes** from the backend, text from i18n files.
- Small functions, early returns, type hints (PHP `declare(strict_types=1)`, Python annotations).
- Small commits, conventional messages: `feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `chore:`.

### 2.3 Coding standards
- PHP: PSR-12, PSR-4 autoload namespace `LandGuard\`.
- Python: PEP 8, `black`-style formatting, docstrings on public functions.
- JS: ES modules, `const`/`let`, no globals, no inline JS in HTML.
- CSS: design tokens from `design.md` only; no hardcoded colors or font sizes.
- Comments explain *why*, not *what*.

---

## 3. What to Avoid

| Avoid | Instead |
|-------|---------|
| Heavy PHP frameworks (Laravel, Symfony) | Plain PHP + small router |
| React/Vue/Angular, Tailwind, jQuery | Vanilla JS + Bootstrap 5 grid |
| String-built SQL, `mysqli_query` with concatenation | PDO prepared statements |
| `md5`/`sha1` passwords | `password_hash` / `password_verify` |
| Hardcoded Bangla/English text in HTML/JS/PHP | i18n keys |
| Business logic in the frontend | Backend/AI service |
| `var`, `eval`, `innerHTML` with untrusted data | `textContent`, escaping |
| Exposing the AI service publicly | Bind `127.0.0.1` + internal key |
| Showing stack traces or SQL errors to users | Generic message + server log |
| Storing uploads inside web root or under original names | Outside web root, random names |
| Real personal data, real government logos/seals | Synthetic data, neutral branding |
| Images that resemble real land records | HTML/CSS/SVG samples labeled SAMPLE |
| Dead code, unused files, TODO litter | Remove or log in `memory.md` |
| Changing weights silently | Ask first |
| Bundling stretch features early | Follow `phases.md` |

---

## 4. Specific Guidelines

### 4.1 Security
- PDO prepared statements everywhere. Escape all output.
- CSRF token on every state-changing request. Regenerate session ID on login. Cookies `HttpOnly`, `SameSite=Lax`.
- Upload validation: MIME sniffing + extension allow-list (pdf, jpg, jpeg, png) + size ≤ 5 MB + random filename + stored outside web root + served only through an authenticated route.
- Authorization on every route: role checks and ownership checks (citizen only sees own data).
- Rate-limit login attempts (simple counter per IP/email is enough).
- Audit-log security-relevant actions; never log passwords, tokens, file contents or full document text.
- Timeouts on all AI calls (extract 30 s, verify 10 s).

### 4.2 Error handling protocol
1. **Validate** input early; return a stable error **code** (e.g. `FILE_TOO_LARGE`, `UNSUPPORTED_TYPE`, `AI_UNAVAILABLE`, `RECORD_NOT_FOUND`).
2. **Catch** exceptions at the boundary (controller/route). Log details server-side with a request ID.
3. **Respond** with the standard envelope `{ ok, data, error: { code, message_key } }`. HTTP codes: 400 validation, 401 unauthenticated, 403 forbidden, 404 not found, 413 too large, 422 unprocessable, 500/502 server/AI.
4. **Degrade gracefully:** extraction falls back Gemini → OCR+regex → cached demo JSON. Unknown khatian/dag → "record not found" result with a clear Bangla message, not a crash.
5. **Show** friendly Bangla messages in the UI; no raw error text.
6. A failed AI step must never leave a half-written verification (use DB transactions).

### 4.3 Language and i18n
- All user-facing strings live in `frontend/i18n/bn.json` and `en.json`. Add both keys together; Bangla is the source of truth.
- Test Bangla rendering in the UI **and** the PDF (conjuncts, digits).
- Use `lang` attributes; Bangla line-height ≥ 1.7.

### 4.4 Data and AI
- Normalize before comparing: Bangla→ASCII digits, trim/collapse spaces, `Md.`/`মোঃ`/`মো:` unified, area units → decimals.
- Gemini prompts require strict JSON; validate against a schema; never trust the output blindly.
- `reasons[]` must reflect actual scoring contributions and sum to the score.
- Keep `DEMO_MODE=true` caching so the demo never depends on network.

### 4.5 Testing
- AI: pytest with ≥ 8 normalization cases and ≥ 10 risk cases (all-match, owner-only, area-only, chain-gap, missing info, boundaries 29/30 and 59/60, Rahim demo = 65).
- Backend: curl/PHPUnit checks for each endpoint incl. 401/403 cases.
- E2E: `scripts/e2e.py` runs the 3 demo files × 10 times.
- UI: open pages in the browser tool at 375 / 768 / 1280 px and check Bangla text.
- Never mark a phase done with failing tests.

---

## 5. AI Assistant Operating Rules (Guardrails and Boundaries)

1. **Session start:** read `memory.md`, then `phases.md`; confirm the current phase before touching code.
2. **Plan first:** for each phase, state the plan (files to create/change, risks) and wait for approval when the phase is large or ambiguous.
3. **One phase at a time.** Stop at the phase gate and report: what passed/failed, files changed, how to run it locally.
4. **Touch only what the phase requires.** No drive-by refactors; log suggestions in `memory.md` under "Ideas".
5. **Never run destructive commands** (dropping databases, deleting folders, `git reset --hard`, force-push) without explicit approval.
6. **No external calls** beyond the approved ones (Gemini API, Google Fonts, free image CDNs if requested). Do not send document contents to any other service.
7. **Honest reporting.** State known limitations and unverified items plainly. Do not claim a test passed unless it was run.
8. **Update `memory.md`** at the end of every task and every phase (see its directive).
9. **Conflicts:** if files disagree, follow the authority order above and record the conflict in `memory.md`.
10. **Definition of done** for any task: code runs, tests pass, Bangla UI checked, no secrets committed, `memory.md` updated.
