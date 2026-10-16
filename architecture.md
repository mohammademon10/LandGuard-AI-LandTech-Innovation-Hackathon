# architecture.md: LandGuard AI (Technical Layout)

> Read after `PRD.md`. Defines app flow, folder structure, tech stack and conventions.

---

## 1. App Flow & Architecture

### 1.1 System diagram

```
              USER (Browser, Bangla-first UI)
                       │
                       ▼
        Frontend: HTML / CSS / Bootstrap 5 / vanilla JS
        (i18n JSON: bn default, en secondary)
                       │  fetch() JSON + session cookie
                       ▼
                PHP 8.1+ Backend (thin orchestrator)
     ┌───────────┬─────┴──────┬─────────────────┐
     ▼           ▼            ▼                 ▼
  MySQL 8   File storage   Land Record      Python AI Service
 (PDO only) (outside web   Provider          (FastAPI, localhost)
             root)         (adapter)             │
                          ├─ SyntheticProvider   ├─ OCR (Tesseract eng+ben)
                          └─ AuthorizedApi*      ├─ Gemini structured extraction
                             (future, stub)      ├─ Normalizer
                                                 └─ Verification + Risk Engine
                       │
                       ▼
              PDF Report (Dompdf, Bangla font embedded)
```
\* Not built in v1. Only the interface and a documented stub exist.

### 1.2 Request flow: "Upload and verify"

```
1. Browser  POST /api/documents/upload (file, CSRF token)
2. PHP      auth check → validate file → save with random name → insert land_documents
3. PHP      POST ai-service/extract (file path)         [timeout 30s]
4. AI       OCR → Gemini → normalize → JSON (or fallback chain)
5. PHP      insert extracted_records
6. PHP      Provider.findRecord(khatian, dag) → reference record + ownership_history
7. PHP      POST ai-service/verify (extracted + reference + history)
8. AI       compare → score → level → reasons[] → chain_gap
9. PHP      insert verification_results (+ report_code) → write audit_logs
10. PHP     return { verification_id } → browser redirects to result page
11. Result  GET /api/verifications/{id} → render comparison, gauge, reasons, timeline
12. Report  GET /api/verifications/{id}/report → PDF (Dompdf)
```

### 1.3 Extraction fallback chain
`Gemini (vision/text)` → on failure `OCR + regex rules` → on failure/`DEMO_MODE=true` `cached JSON for demo files`.
The demo must never fail because of network or API limits.

### 1.4 State handling
| State | Where it lives |
|-------|----------------|
| Auth session | PHP session (server-side), `HttpOnly`, `SameSite=Lax`, ID regenerated on login |
| User language | `users.language` (saved) + `localStorage('lg_lang')` for guests; default `bn` |
| Theme (light/dark) | `localStorage('lg_theme')` wrapped in try/catch |
| Verification data | MySQL only; never trust client state |
| UI transient state | JS module variables; no globals |
| Secrets | `.env` (never committed) |

### 1.5 Interoperability design (meeting D8)
- All external data access goes through `LandRecordProviderInterface`:
  `findByKhatianDag()`, `getOwnershipHistory()`, `search()`.
- `SyntheticProvider` reads MySQL `land_records`. A future `AuthorizedApiProvider` would call an official API; swapping needs no change in controllers.
- All service boundaries use versioned JSON contracts (§5).

### 1.6 Security architecture (meeting D8: leak prevention)
- Role-based access (`citizen`, `admin`), checked server-side on every route.
- Citizens can only read their own documents/verifications (ownership check by `user_id`).
- Files stored outside web root; served only through an authenticated PHP route.
- `audit_logs` record who did what and when, with no document contents or full PII.
- AI service bound to `127.0.0.1`, not publicly exposed; shared secret header between PHP and AI service.
- Generic error messages to clients; details only in server logs.
- Synthetic data only; uploaded files may be purged by an admin command.

### 1.7 i18n architecture
- `frontend/i18n/bn.json` (primary, complete) and `en.json` (secondary).
- `t('key')` helper; HTML uses `data-i18n="key"`; `<html lang="bn">` default.
- Backend returns **message codes** (`OWNER_MISMATCH`) plus params; the frontend and the PDF render text from the language files. Risk `reasons[]` are codes with params so they can be shown in either language.
- Numbers: stored as ASCII; display formatter may show Bangla digits when `lang=bn`.
- PDF uses an embedded Bangla font (Noto Sans Bengali) so conjuncts render correctly.

---

## 2. Folder & File Structure

```
LandGuard-AI/
├── PRD.md  architecture.md  rules.md  phases.md  design.md  memory.md
├── README.md
├── LICENSE
├── .gitignore
├── .env.example
├── scripts/
│   ├── setup.cmd            # Windows one-command setup
│   ├── run-all.cmd          # start PHP + AI service
│   └── e2e.py               # 3 demo files × 10 runs
├── frontend/
│   ├── index.html           # landing (Bangla-first)
│   ├── login.html  register.html
│   ├── dashboard.html  upload.html  result.html
│   ├── admin/               # admin.html, records.html, audit.html
│   ├── css/                 # tokens.css, base.css, components.css, pages/*.css
│   ├── js/                  # api.js, auth.js, i18n.js, gauge.js, pages/*.js
│   ├── i18n/                # bn.json, en.json
│   └── assets/              # fonts/, icons/, images/
├── backend/
│   ├── public/              # web root: index.php (router), api entry
│   ├── src/
│   │   ├── Controllers/     # AuthController, DocumentController, VerificationController, AdminController
│   │   ├── Services/        # AiClient, ReportService, AuditLogger
│   │   ├── Providers/       # LandRecordProviderInterface, SyntheticProvider
│   │   ├── Middleware/      # Auth, Role, Csrf
│   │   └── Support/         # Db (PDO), Env, Response, Validator
│   ├── storage/uploads/     # outside public/, gitignored
│   ├── templates/report.php # HTML for Dompdf
│   └── composer.json
├── ai/
│   ├── main.py              # FastAPI app
│   ├── ocr/  extraction/  normalization/
│   ├── risk_engine/         # config.py, matcher.py, scorer.py, chain.py
│   ├── cache/demo_extractions.json
│   ├── tests/
│   └── requirements.txt
├── database/
│   ├── landguard.sql  seed.sql
├── sample-data/             # 3 watermarked demo documents
└── docs/
    ├── system-analysis.md   # use cases, DFD, ERD, existing-system comparison
    ├── data-sources.md
    ├── architecture.png
    ├── pitch-script.md  demo-script.md
    └── screenshots/
```

### 2.1 Naming conventions
| Item | Convention | Example |
|------|-----------|---------|
| PHP classes | PascalCase, one per file, PSR-4 `LandGuard\` | `VerificationController.php` |
| PHP functions/vars | camelCase | `findByKhatianDag()` |
| Python | snake_case, type hints | `calculate_risk_score()` |
| JS | camelCase, ES modules | `renderGauge()` |
| CSS | BEM-lite, tokens as custom properties | `.risk-badge--high` |
| DB | snake_case, plural tables | `land_documents` |
| i18n keys | dot.notation lowercase | `result.owner_mismatch` |
| Files | kebab-case (frontend), snake_case (python) | `result-page.js`, `risk_engine/` |

---

## 3. Tech Stack

| Layer | Choice | Notes |
|-------|--------|-------|
| Frontend | HTML5, CSS3, **Bootstrap 5** (grid/utilities), vanilla JS (ES modules) | Tokens override Bootstrap; see `design.md` |
| Backend | **PHP 8.1+**, PDO, Composer | No heavy framework |
| Database | **MySQL 8** (utf8mb4_unicode_ci) | Bangla text safe |
| AI service | **Python 3.10+, FastAPI, Uvicorn** | localhost only |
| OCR | Tesseract (`eng+ben`), PyMuPDF | Bangla traineddata required |
| LLM | **Gemini API** | Key in `.env` |
| Fuzzy match | RapidFuzz | Owner names |
| PDF | **Dompdf** | Embed Noto Sans Bengali |
| Tests | pytest (AI), PHPUnit optional, `e2e.py` | |
| Dev env | XAMPP/Laragon + Python venv, Windows-friendly | |
| VCS | Git + GitHub | Conventional commits |

---

## 4. Database Schema (v2)

```sql
CREATE DATABASE IF NOT EXISTS landguard CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE landguard;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('citizen','admin') NOT NULL DEFAULT 'citizen',
  language ENUM('bn','en') NOT NULL DEFAULT 'bn',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE land_documents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  document_type VARCHAR(50),
  original_name VARCHAR(255),
  stored_name VARCHAR(255) NOT NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE extracted_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  document_id INT NOT NULL,
  owner_name VARCHAR(150), khatian_no VARCHAR(50), dag_no VARCHAR(50),
  mouza VARCHAR(100), upazila VARCHAR(100), district VARCHAR(100),
  area_decimal DECIMAL(10,2), document_no VARCHAR(80),
  registration_date DATE NULL, confidence DECIMAL(4,2) NULL, raw_json JSON NULL,
  FOREIGN KEY (document_id) REFERENCES land_documents(id) ON DELETE CASCADE
);

CREATE TABLE land_records (            -- synthetic reference records
  id INT AUTO_INCREMENT PRIMARY KEY,
  owner_name VARCHAR(150) NOT NULL,
  khatian_no VARCHAR(50) NOT NULL, dag_no VARCHAR(50) NOT NULL,
  mouza VARCHAR(100), upazila VARCHAR(100), district VARCHAR(100),
  area_decimal DECIMAL(10,2) NOT NULL, registration_date DATE NULL,
  UNIQUE KEY uq_khatian_dag (khatian_no, dag_no)
);

CREATE TABLE ownership_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  land_id INT NOT NULL,
  previous_owner VARCHAR(150), new_owner VARCHAR(150),
  transfer_type ENUM('sale','inheritance','gift','other') NOT NULL,
  transfer_date DATE NULL, seq_no INT NOT NULL,
  FOREIGN KEY (land_id) REFERENCES land_records(id) ON DELETE CASCADE
);

CREATE TABLE verification_results (
  id INT AUTO_INCREMENT PRIMARY KEY,
  document_id INT NOT NULL,
  matched_land_id INT NULL,
  owner_match TINYINT(1), khatian_match TINYINT(1),
  dag_match TINYINT(1), area_match TINYINT(1),
  chain_gap TINYINT(1) DEFAULT 0,
  risk_score INT NOT NULL,
  risk_level ENUM('LOW','MEDIUM','HIGH') NOT NULL,
  reasons JSON,                         -- [{code, params}]
  report_code VARCHAR(30) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (document_id) REFERENCES land_documents(id) ON DELETE CASCADE
);

CREATE TABLE audit_logs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  action VARCHAR(60) NOT NULL,          -- login, upload, verify, report_download, admin_*
  entity VARCHAR(40) NULL, entity_id INT NULL,
  ip VARCHAR(45) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 5. API Contracts

### 5.1 PHP routes (all JSON, CSRF header on state-changing calls)
| Method | Route | Role | Purpose |
|--------|-------|------|---------|
| POST | `/api/auth/register` | public | Register |
| POST | `/api/auth/login` | public | Login |
| POST | `/api/auth/logout` | auth | Logout |
| GET | `/api/me` | auth | Current user + language |
| PATCH | `/api/me/language` | auth | Save `bn`/`en` |
| POST | `/api/documents/upload` | auth | Upload + extract + verify |
| GET | `/api/documents` | auth | Own documents |
| GET | `/api/verifications/{id}` | owner/admin | Result detail |
| GET | `/api/verifications/{id}/report` | owner/admin | PDF |
| GET | `/api/dashboard/stats` | auth | Counts + recent |
| GET | `/api/ownership/{land_id}` | owner/admin | Timeline |
| GET | `/api/admin/verifications` | admin | All, filter by level |
| GET/POST/PUT/DELETE | `/api/admin/records` | admin | Reference records CRUD |
| GET | `/api/admin/audit` | admin | Audit log |

**Standard response**
```json
{ "ok": true, "data": { }, "error": null }
{ "ok": false, "data": null, "error": { "code": "FILE_TOO_LARGE", "message_key": "error.file_too_large" } }
```

### 5.2 Python AI service (localhost, header `X-Internal-Key`)
| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/health` | Liveness |
| POST | `/extract` | File → extraction JSON |
| POST | `/verify` | Extraction + reference + history → comparison + risk |

**/extract response**
```json
{
  "owner_name": "মোঃ রহিম", "khatian_no": "10245", "dag_no": "456",
  "mouza": "…", "upazila": "…", "district": "…",
  "area_decimal": 12.0, "document_no": "D-2026-0041",
  "registration_date": "2024-05-12",
  "confidence": 0.93, "missing_fields": [], "source": "gemini|ocr_regex|cache"
}
```

**/verify response**
```json
{
  "field_results": {
    "owner":   {"status": "mismatch", "uploaded": "Md. Rahim", "record": "Md. Karim"},
    "khatian": {"status": "match"},
    "dag":     {"status": "match"},
    "area":    {"status": "mismatch", "uploaded": 12.0, "record": 10.0, "diff_pct": 20.0}
  },
  "chain_gap": true,
  "risk_score": 65,
  "risk_level": "HIGH",
  "reasons": [
    {"code": "OWNER_MISMATCH", "params": {"uploaded": "Md. Rahim", "record": "Md. Karim"}, "points": 35},
    {"code": "AREA_MISMATCH",  "params": {"diff": 2, "diff_pct": 20}, "points": 20},
    {"code": "CHAIN_GAP",      "params": {}, "points": 10}
  ]
}
```

---

## 6. Environment Variables (`.env.example`)

```
APP_ENV=local
APP_URL=http://localhost/LandGuard-AI/backend/public
DB_HOST=127.0.0.1
DB_NAME=landguard
DB_USER=root
DB_PASS=
AI_SERVICE_URL=http://127.0.0.1:8001
AI_INTERNAL_KEY=change-me
GEMINI_API_KEY=
DEMO_MODE=true
UPLOAD_MAX_MB=5
DEFAULT_LANG=bn
```

---

## 7. Quality Gates
- Every phase ends with passing tests and a manual browser check.
- Risk engine, normalizer and chain-gap logic live **only** in `ai/` and are unit tested.
- PHP never re-implements scoring; it stores what `/verify` returns.
