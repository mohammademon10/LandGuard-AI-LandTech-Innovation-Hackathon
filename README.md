# 🛡️ LandGuard AI (ল্যান্ডগার্ড এআই)

> **বাংলা-প্রথম এআইনির্ভর ভূমি দলিল যাচাইকরণ ও জালিয়াতি ঝুঁকি সনাক্তকরণ প্ল্যাটফর্ম**  
> *Bangla-First AI-Assisted Land Document Verification & Fraud-Risk Detection Prototype for Bangladesh*  
> **ইভেন্ট:** ল্যান্ডটেক ইনোভেশন হ্যাকাথন ২০২৬ (LandTech Innovation Hackathon 2026)  
> **দল:** প্রোটন (Team PROTON)  
> **মূল স্লোগান:** *কেনার আগে যাচাই করুন।* / *Verify Before You Buy.*

---

## ⚠️ গুরুত্বপূর্ণ আইনি সতর্কতা ও প্রোটোটাইপ ঘোষণা (Legal Disclaimer)

> **বাংলা:** "এটি একটি প্রোটোটাইপ, যা কৃত্রিম (সিনথেটিক) ভূমি রেকর্ড ব্যবহার করে। ঝুঁকির স্কোর সম্ভাব্য অসঙ্গতি নির্দেশ করে; এটি জালিয়াতি বা আইনি মালিকানার প্রমাণ নয়।"
> 
> **English:** "Prototype using synthetic land records. Risk score indicates potential inconsistencies, not proof of fraud or legal ownership."
> 
> *আমাদের প্রোটোটাইপটি কৃত্রিম (সিনথেটিক) এবং ডিজিটাল রেফারেন্স ভূমি রেকর্ড ব্যবহার করে এআই-সহায়ক যাচাইকরণ কর্মপ্রবাহ প্রদর্শন করে, যা ভবিষ্যতে সরকারের অনুমোদিত ভূমি ডেটাবেজের সাথে সমন্বয় করার জন্য নির্মিত।*

---

## 🚀 How to Run the Frontend (ফ্রন্টএন্ড চালু করার নির্দেশিকা)

The frontend is built using **HTML5, CSS3 (Design Tokens), Bootstrap 5 Grid/Utilities, and modern Vanilla ES Modules**. It runs entirely locally without needing PHP or MySQL during Phase 1.

### Option 1: One-Click Windows Runner
Double-click `scripts/run-frontend.cmd` or run:
```cmd
scripts\run-frontend.cmd
```

### Option 2: Python Static Server
```bash
python scripts/serve-frontend.py
```

### Option 3: Node or any standard HTTP Server
```bash
npx serve frontend -p 8080
```

Once started, open your browser at:
👉 **[http://127.0.0.1:8080](http://127.0.0.1:8080)**

---

## 🔑 Demo & Test Accounts (১-ক্লিকে টেস্ট লগইন)

| Role | Email | Password | Access Rights |
|------|-------|----------|---------------|
| **নাগরিক (Citizen)** | `citizen@landguard.gov.bd` | `Password123!` | Dashboard, Upload, View Results & Print Reports |
| **অ্যাডমিন (Land Officer)** | `admin@landguard.gov.bd` | `AdminPassword123!` | Full Admin Panel, Reference Records CRUD, Audit Log |

*(Note: On the login page, you can also click the quick **"1-Click Demo Login"** buttons to log in instantly).*

---

## 🧪 ক্যানোনিকাল ৩টি টেস্ট দৃশ্যপট (Canonical Test Scenarios)

The prototype includes the 3 mandated canonical scenarios from `PRD.md §5`:

1. **🔴 মোঃ রহিম - সাফ কবলা দলিল (`Rahim_Land_Deed`) [Canonical Hackathon Demo]:**
   - **ঝুঁকির স্কোর:** **৬৫ / ১০০ (উচ্চ ঝুঁকি - HIGH)**
   - **স্কোরের গাণিতিক বিশ্লেষণ:**
     - মালিকের নাম অমিল (`Md. Rahim` বনাম `Md. Karim`): **৩৫ পয়েন্ট**
     - জমির পরিমাপে ২০% গরমিল (১২ শতক বনাম ১০ শতক): **২০ পয়েন্ট**
     - মালিকানা ধারাবাহিকতায় চেইন গ্যাপ (২০১৫ সালের রেকর্ড অনুপস্থিত): **১০ পয়েন্ট**
     - **সর্বমোট স্কোর:** $35 + 20 + 10 = \mathbf{65}$ পয়েন্ট।
2. **🟡 মোসাঃ সুলতানা জাহান - দানপত্র দলিল (`medium_risk`):**
   - **ঝুঁকির স্কোর:** **৪০ / ১০০ (মধ্যম ঝুঁকি - MEDIUM)**
   - নামের উপাধির আংশিক পার্থক্য, জমির পরিমাপে সামান্য পার্থক্য এবং চেইন গ্যাপ।
3. **🟢 আনোয়ারুল ইসলাম - বিক্রয় কবলা দলিল (`clean_match`):**
   - **ঝুঁকির স্কোর:** **৫ / ১০০ (নিম্ন ঝুঁকি - LOW)**
   - মালিকের নাম, খতিয়ান, দাগ, পরিমাণ হুবহু মিলেছে এবং ৩-ধাপের নিরবচ্ছিন্ন হস্তান্তরের ইতিহাস রয়েছে।

---

## 🛠️ আর্কিটেকচার ও ডিজাইন সিস্টেম (Architecture & Design)

- **Design System (`design.md`):**
  - Brand Navy (`#0B2545`), Emerald Green (`#13A579`), Soft Gold (`#E9B949`).
  - **Strict Rule:** লাল/হলুদ/সবুজ রঙ শুধুমাত্র ঝুঁকির স্থিতি প্রদর্শনে সংরক্ষিত; সাধারণ বাটন বা ব্যাকগ্রাউন্ডে কখনই ঝুঁকির কালার ব্যবহৃত হয়নি।
  - **Bangla-First Typography:** Google Fonts *Noto Sans Bengali* (line-height $\ge 1.75$ ফর ক্লিয়ার যুক্তাক্ষর) এবং *Inter / Poppins*।
  - **Contrast & A11y:** WCAG 2.1 AA মানদণ্ড (Contrast $\ge 4.5:1$, visible focus rings, aria-live for animated upload steps).
- **Single API Gate (`frontend/js/api.js`):**
  - All data queries route through `api.js` with `USE_MOCK = true`.
  - Swapping to Phase 2 live PHP backend requires zero modifications in UI pages.
  - Complete contract documented in [`docs/frontend-api-contract.md`](docs/frontend-api-contract.md).
- **i18n Layer (`frontend/js/i18n.js`):**
  - `bn.json` is the single source of truth (176 keys).
  - 100% key parity with `en.json`.
  - Display numbers support authentic Bangla numerals (`০-৯`) via `formatNumber()`.

---

## 📱 পেজ ও ফিচার ওভারভিউ (Pages Built)

| Page | File | Purpose |
|------|------|---------|
| **নীড়পাতা (Landing)** | [`frontend/index.html`](frontend/index.html) | বাংলা-প্রথম ল্যান্ডিং পেজ: হিরো, সমস্যা বিশ্লেষণ, ৪-ধাপে যাচাইকরণ, ঝুঁকি স্কোর ব্যাখ্যা, ইন্টারেক্টিভ ডেমো, FAQ ও ডিসক্লেইমার |
| **লগইন (Login)** | [`frontend/login.html`](frontend/login.html) | বাংলা ইনপুট ভ্যালিডেশন, ১-ক্লিক ডেমো অ্যাকাউন্ট বাটন, সেশন হ্যান্ডলিং |
| **নিবন্ধন (Register)** | [`frontend/register.html`](frontend/register.html) | নাগরিক ও অ্যাডমিন কর্মকর্তা নিবন্ধন ফর্ম |
| **ড্যাশবোর্ড (Dashboard)** | [`frontend/dashboard.html`](frontend/dashboard.html) | ৪টি কেপিআই কার্ড, রিসেন্ট ভেরিফিকেশন টেবিল, ফিল্টার পিলস (LOW/MED/HIGH), এম্পটি ও লোডিং স্টেট |
| **নথি যাচাই (Upload)** | [`frontend/upload.html`](frontend/upload.html) | ড্র্যাগ-অ্যান্ড-ড্রপ, ফাইল সাইজ ও টাইপ ভ্যালিডেশন, ১-ক্লিক ক্যানোনিকাল প্রিসেটস, ৫-ধাপের অ্যানিমেটেড প্রোগ্রেস |
| **ফলাফল (Result)** | [`frontend/result.html`](frontend/result.html) | সেমি-সার্কেল এসভিজি ঝুঁকি গজ, কারণভিত্তিক ব্যাখ্যা পিলস, ফিল্ড তুলনা টেবিল, চেইন গ্যাপ অ্যালার্ট, হস্তান্তরের টাইমলাইন |
| **প্রত্যয়ন পত্র (Report)** | [`frontend/report.html`](frontend/report.html) | এ৪ প্রিন্ট-রেডি ভেরিফিকেশন সার্টিফিকেট, কিউআর কোড, ডিজিটাল প্রত্যয়ন সিল ও সিগনেচার |
| **অ্যাডমিন ভেরিফিকেশন (Admin)** | [`frontend/admin/index.html`](frontend/admin/index.html) | সার্বিক সিস্টেমের সকল নাগরিকের যাচাইকরণ নজরদারি ও ঝুঁকি ফিল্টার |
| **রেফারেন্স রেকর্ডস (Admin CRUD)** | [`frontend/admin/records.html`](frontend/admin/records.html) | ৩০+ সিনথেটিক রেফারেন্স ভূমি রেকর্ডস অনুসন্ধান, সংযোজন, সম্পাদন ও মোছার ইন্টারফেস |
| **নিরাপত্তা অডিট (Admin Audit)** | [`frontend/admin/audit.html`](frontend/admin/audit.html) | লগইন, আপলোড, ভেরিফাই ও রিপোর্ট ডাউনলোডের অপরিবর্তনীয় অডিট ট্রেইল (PII মুক্ত) |
| **নিষেধাজ্ঞা পর্দা (403 Forbidden)** | [`frontend/403.html`](frontend/403.html) | নাগরিক ব্যবহারকারী অ্যাডমিন রুটে প্রবেশের চেষ্টা করলে সুরক্ষামূলক ৪০৩ পর্দা |

---

## 📸 স্ক্রিনশট গ্যালারি (Responsive Evidence)

Screen evidence at 375px (Mobile), 768px (Tablet), and 1280px (Desktop) are archived in `docs/screenshots/`:
- `landing-1280.png`, `landing-768.png`, `landing-375.png`
- `dashboard-1280.png`, `dashboard-768.png`, `dashboard-375.png`
- `result-1280.png`, `result-768.png`, `result-375.png`
- `upload-1280.png`, `report-1280.png`

---

## 📋 কোয়ালিটি গেট ও ভ্যালিডেশন ফলাফল (QA Verification)

Run the automated test suites:
```bash
# Verify 100% i18n key parity between Bangla and English
python scripts/check-i18n-parity.py

# Verify all pages, static assets, scenario scores, and disclaimers
python scripts/test-frontend-qa.py
```
- **i18n Parity:** 176 Bangla keys = 176 English keys (100% match).
- **Rahim Land Deed Risk Score:** Strictly 65 / HIGH ($35 + 20 + 10$).
- **WCAG AA:** Contrast verified, keyboard navigation, skip link, visible focus rings.
- **Zero console errors, zero dead links, zero lorem ipsum.**
