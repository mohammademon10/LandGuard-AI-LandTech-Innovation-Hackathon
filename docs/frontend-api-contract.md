# LandGuard AI - Frontend API Contract

> **Single Source of Truth** for the interface between the Frontend and Backend.
> Implemented by `frontend/js/api.js`. When `USE_MOCK = false`, the frontend makes these exact HTTP requests.
> Envelope standard:
> - Success: `{ "ok": true, "data": { ... }, "error": null }`
> - Error: `{ "ok": false, "data": null, "error": { "code": "STRING_CODE", "message_key": "i18n.key" } }`

---

## 1. Authentication & User Management

### 1.1 Register
- **Method**: `POST`
- **Route**: `/api/auth/register`
- **Access**: Public
- **Request Body** (`application/json`):
  ```json
  {
    "name": "মোঃ আরিফুল ইসলাম",
    "email": "user@example.com",
    "password": "Password123!",
    "role": "citizen",
    "language": "bn"
  }
  ```
- **Success Response** (`200 OK` / `201 Created`):
  ```json
  {
    "ok": true,
    "data": {
      "user": {
        "id": 1,
        "name": "মোঃ আরিফুল ইসলাম",
        "email": "user@example.com",
        "role": "citizen",
        "language": "bn"
      }
    },
    "error": null
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: `{ "ok": false, "data": null, "error": { "code": "VALIDATION_FAILED", "message_key": "auth.error.missing_fields" } }`
  - `409 Conflict`: `{ "ok": false, "data": null, "error": { "code": "DUPLICATE_EMAIL", "message_key": "auth.error.duplicate_email" } }`

---

### 1.2 Login
- **Method**: `POST`
- **Route**: `/api/auth/login`
- **Access**: Public
- **Request Body** (`application/json`):
  ```json
  {
    "email": "user@example.com",
    "password": "Password123!"
  }
  ```
- **Success Response** (`200 OK`, sets HttpOnly session cookie):
  ```json
  {
    "ok": true,
    "data": {
      "user": {
        "id": 1,
        "name": "নাগরিক ব্যবহারকারী",
        "email": "citizen@landguard.gov.bd",
        "role": "citizen",
        "language": "bn"
      }
    },
    "error": null
  }
  ```
- **Error Response**:
  - `401 Unauthorized`: `{ "ok": false, "data": null, "error": { "code": "INVALID_CREDENTIALS", "message_key": "auth.error.invalid_credentials" } }`

---

### 1.3 Logout
- **Method**: `POST`
- **Route**: `/api/auth/logout`
- **Access**: Authenticated
- **Success Response** (`200 OK`):
  ```json
  {
    "ok": true,
    "data": { "logged_out": true },
    "error": null
  }
  ```

---

### 1.4 Get Current User (`me`)
- **Method**: `GET`
- **Route**: `/api/me`
- **Access**: Authenticated
- **Success Response** (`200 OK`):
  ```json
  {
    "ok": true,
    "data": {
      "user": {
        "id": 1,
        "name": "নাগরিক ব্যবহারকারী",
        "email": "citizen@landguard.gov.bd",
        "role": "citizen",
        "language": "bn"
      }
    },
    "error": null
  }
  ```
- **Error Response**:
  - `401 Unauthorized`: `{ "ok": false, "data": null, "error": { "code": "UNAUTHENTICATED", "message_key": "auth.error.unauthenticated" } }`

---

### 1.5 Update User Language
- **Method**: `PATCH`
- **Route**: `/api/me/language`
- **Access**: Authenticated
- **Request Body**:
  ```json
  { "language": "en" }
  ```
- **Success Response**:
  ```json
  { "ok": true, "data": { "language": "en" }, "error": null }
  ```

---

## 2. Document Upload & Verification Flow

### 2.1 Upload and Analyze Document
- **Method**: `POST`
- **Route**: `/api/documents/upload`
- **Access**: Authenticated
- **Content-Type**: `multipart/form-data`
- **Payload**:
  - `document`: File binary (PDF/JPG/PNG $\le 5$ MB)
  - `document_type`: String (e.g. `বিক্রয় কবলা দলিল`)
- **Success Response** (`200 OK`):
  ```json
  {
    "ok": true,
    "data": {
      "verification_id": 3,
      "report_code": "LG-2026-00412",
      "risk_level": "HIGH",
      "risk_score": 65
    },
    "error": null
  }
  ```
- **Error Responses**:
  - `413 Payload Too Large`: `{ "ok": false, "data": null, "error": { "code": "FILE_TOO_LARGE", "message_key": "upload.error_file_too_large" } }`
  - `415 Unsupported Media Type`: `{ "ok": false, "data": null, "error": { "code": "UNSUPPORTED_TYPE", "message_key": "upload.error_unsupported_type" } }`

---

### 2.2 Get Verification Result Details
- **Method**: `GET`
- **Route**: `/api/verifications/{id}`
- **Access**: Owner or Admin (403 if citizen accesses another user's verification)
- **Success Response** (`200 OK`):
  ```json
  {
    "ok": true,
    "data": {
      "id": 3,
      "report_code": "LG-2026-00412",
      "document_name": "Rahim_Land_Deed.pdf",
      "document_type": "সাফ কবলা দলিল (Deed of Absolute Sale)",
      "uploaded_at": "2026-10-16 14:30:00",
      "risk_score": 65,
      "risk_level": "HIGH",
      "chain_gap": true,
      "extracted": {
        "owner_name": "মোঃ রহিম",
        "khatian_no": "10245",
        "dag_no": "456",
        "mouza": "মির্জাপুর",
        "upazila": "কালিয়াকৈর",
        "district": "গাজীপুর",
        "area_decimal": 12.0,
        "document_no": "D-2026-0041",
        "registration_date": "2024-05-12",
        "confidence": 0.93
      },
      "reference": {
        "id": 42,
        "owner_name": "মোঃ করিম",
        "khatian_no": "10245",
        "dag_no": "456",
        "mouza": "মির্জাপুর",
        "upazila": "কালিয়াকৈর",
        "district": "গাজীপুর",
        "area_decimal": 10.0,
        "registration_date": "2018-03-20"
      },
      "field_results": {
        "owner": { "status": "mismatch", "uploaded": "মোঃ রহিম", "record": "মোঃ করিম" },
        "khatian": { "status": "match", "uploaded": "10245", "record": "10245" },
        "dag": { "status": "match", "uploaded": "456", "record": "456" },
        "area": { "status": "mismatch", "uploaded": 12.0, "record": 10.0, "diff_pct": 20.0 },
        "mouza": { "status": "match", "uploaded": "মির্জাপুর", "record": "মির্জাপুর" },
        "upazila": { "status": "match", "uploaded": "কালিয়াকৈর", "record": "কালিয়াকৈর" },
        "district": { "status": "match", "uploaded": "গাজীপুর", "record": "গাজীপুর" },
        "registration_date": { "status": "mismatch", "uploaded": "2024-05-12", "record": "2018-03-20" }
      },
      "reasons": [
        { "code": "OWNER_MISMATCH", "params": { "uploaded": "মোঃ রহিম", "record": "মোঃ করিম" }, "points": 35 },
        { "code": "AREA_MISMATCH", "params": { "uploaded": 12.0, "record": 10.0, "diff": 2.0, "diff_pct": 20.0 }, "points": 20 },
        { "code": "CHAIN_GAP", "params": {}, "points": 10 }
      ],
      "ownership_history": [
        { "id": 301, "seq_no": 1, "previous_owner": "আব্দুল কাদের", "new_owner": "রফিকুল ইসলাম", "transfer_type": "sale", "transfer_date": "1995-04-12", "is_gap": false },
        { "id": 302, "seq_no": 2, "previous_owner": "রফিকুল ইসলাম", "new_owner": "আনোয়ার হোসেন", "transfer_type": "sale", "transfer_date": "2008-11-05", "is_gap": false },
        { "id": 303, "seq_no": 3, "is_gap": true, "note": "২০১৫ সালের ওয়ারিশ সূত্রে হস্তান্তর বা নামজারি দলিল অনুপস্থিত" },
        { "id": 304, "seq_no": 4, "previous_owner": "আনোয়ার হোসেন (উত্তরাধিকার)", "new_owner": "মোঃ করিম", "transfer_type": "inheritance", "transfer_date": "2018-03-20", "is_gap": false }
      ]
    },
    "error": null
  }
  ```
- **Error Responses**:
  - `403 Forbidden`: `{ "ok": false, "data": null, "error": { "code": "FORBIDDEN", "message_key": "auth.error.forbidden" } }`
  - `404 Not Found`: `{ "ok": false, "data": null, "error": { "code": "RECORD_NOT_FOUND", "message_key": "error.record_not_found" } }`

---

### 2.3 Get Report Payload / PDF Download
- **Method**: `GET`
- **Route**: `/api/verifications/{id}/report`
- **Access**: Owner or Admin
- **Behavior**: Returns verification result data or serves generated PDF stream with embedded Noto Sans Bengali. Logs action in `audit_logs`.

---

## 3. Dashboard API

### 3.1 Get Dashboard Statistics
- **Method**: `GET`
- **Route**: `/api/dashboard/stats`
- **Access**: Authenticated
- **Success Response** (`200 OK`):
  ```json
  {
    "ok": true,
    "data": {
      "stats": {
        "total_documents": 3,
        "verified_count": 3,
        "potential_conflicts": 2,
        "high_risk_count": 1
      },
      "recent_verifications": [
        {
          "id": 3,
          "document_name": "Rahim_Land_Deed.pdf",
          "document_type": "সাফ কবলা দলিল",
          "khatian_no": "10245",
          "dag_no": "456",
          "owner_name": "মোঃ রহিম",
          "mouza": "মির্জাপুর",
          "upazila": "কালিয়াকৈর",
          "district": "গাজীপুর",
          "area_decimal": 12.0,
          "risk_score": 65,
          "risk_level": "HIGH",
          "report_code": "LG-2026-00412",
          "created_at": "2026-10-16 14:30:00"
        }
      ]
    },
    "error": null
  }
  ```

---

## 4. Admin Management APIs

### 4.1 Get All Verifications (Admin Only)
- **Method**: `GET`
- **Route**: `/api/admin/verifications?level={ALL|LOW|MEDIUM|HIGH}`
- **Access**: Admin only (`role === 'admin'`)
- **Success Response**: Array of all user verifications with risk scores and levels.

---

### 4.2 Reference Land Records CRUD (Admin Only)
- **List / Search**: `GET /api/admin/records?q={query}`
- **Create**: `POST /api/admin/records` (`{ owner_name, khatian_no, dag_no, mouza, upazila, district, area_decimal, registration_date }`)
- **Update**: `PUT /api/admin/records/{id}` (`{ ...updates }`)
- **Delete**: `DELETE /api/admin/records/{id}`

---

### 4.3 Get Security Audit Logs (Admin Only)
- **Method**: `GET`
- **Route**: `/api/admin/audit`
- **Access**: Admin only
- **Success Response**:
  ```json
  {
    "ok": true,
    "data": [
      {
        "id": 1,
        "user_id": 1,
        "user_email": "citizen@landguard.gov.bd",
        "action": "login",
        "entity": "auth",
        "entity_id": 1,
        "ip": "127.0.0.1",
        "created_at": "2026-10-16 14:00:00"
      }
    ],
    "error": null
  }
  ```
