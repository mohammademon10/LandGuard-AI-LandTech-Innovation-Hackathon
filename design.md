# design.md: LandGuard AI (Design System)

> Clean govtech look. Bangla-first. Red/amber/green are reserved **only** for risk states.
> Implement as CSS custom properties in `frontend/css/tokens.css`. Never hardcode colors or sizes elsewhere.

---

## 1. Color & Theme

### 1.1 Light mode (default)
| Token | Hex | Use |
|-------|-----|-----|
| `--color-primary` | `#0B2545` | Navy: navbar, headings, primary buttons |
| `--color-primary-hover` | `#13315C` | Primary hover |
| `--color-secondary` | `#13A579` | Green: secondary buttons, success accents, links on dark |
| `--color-secondary-hover` | `#0E8A64` | Secondary hover |
| `--color-accent` | `#E9B949` | Soft gold: highlights, icons (never risk meaning) |
| `--color-bg` | `#F7FAFC` | Page background |
| `--color-surface` | `#FFFFFF` | Cards, modals, tables |
| `--color-surface-alt` | `#EEF3F8` | Table stripes, subtle panels |
| `--color-border` | `#D6E0EA` | Borders, dividers |
| `--color-text` | `#14213D` | Body text |
| `--color-text-muted` | `#5B6B7F` | Secondary text (≥ 4.5:1 on bg) |
| `--color-focus` | `#1D6FE0` | Focus ring |

### 1.2 Risk colors (reserved)
| Token | Hex | Meaning | Badge text |
|-------|-----|---------|------------|
| `--risk-low` | `#1E9E5A` | LOW 🟢 (0-29) | নিম্ন ঝুঁকি |
| `--risk-medium` | `#E0A100` | MEDIUM 🟡 (30-59) | মধ্যম ঝুঁকি |
| `--risk-high` | `#D64545` | HIGH 🔴 (60-100) | উচ্চ ঝুঁকি |
| `--risk-low-bg` / `-medium-bg` / `-high-bg` | `#E6F6EC` / `#FFF4D6` / `#FDE8E8` | Badge and panel backgrounds | |

Never rely on color alone: always pair with icon (✓ ⚠️ ❌) and text.

### 1.3 Dark mode (optional; `[data-theme="dark"]`)
| Token | Hex |
|-------|-----|
| `--color-bg` | `#0D1B2A` |
| `--color-surface` | `#142638` |
| `--color-surface-alt` | `#1A3047` |
| `--color-border` | `#27415C` |
| `--color-text` | `#E8EEF5` |
| `--color-text-muted` | `#9DB0C4` |
| `--color-primary` | `#7FB2F0` (on dark surfaces) |
| `--color-secondary` | `#2BC89A` |
| Risk colors | Lighten ~10% to keep contrast ≥ 4.5:1 |

Persist theme in `localStorage('lg_theme')` inside try/catch; respect `prefers-color-scheme` on first load.

### 1.4 Spacing, radius, shadow
```
--space-1: 4px   --space-2: 8px   --space-3: 12px  --space-4: 16px
--space-5: 24px  --space-6: 32px  --space-7: 48px  --space-8: 64px
--radius-sm: 6px --radius-md: 12px --radius-lg: 20px --radius-pill: 999px
--shadow-sm: 0 1px 3px rgba(11,37,69,.08)
--shadow-md: 0 6px 18px rgba(11,37,69,.10)
--shadow-lg: 0 16px 40px rgba(11,37,69,.14)
```

---

## 2. Fonts

| Role | Family | Fallback stack |
|------|--------|----------------|
| **Primary (Bangla body + UI)** | **Noto Sans Bengali** | `"Hind Siliguri", "Kalpurush", "SolaimanLipi", "Segoe UI", system-ui, sans-serif` |
| **Secondary (Latin body)** | **Inter** | `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif` |
| **Headings (Latin)** | **Poppins** | `Inter, system-ui, sans-serif` |
| **Headings (Bangla)** | Noto Sans Bengali, weight 600-700 | as above |
| **Monospace (IDs, report codes)** | `"JetBrains Mono", ui-monospace, Consolas, monospace` | |

```css
:root {
  --font-bn: "Noto Sans Bengali", "Hind Siliguri", "Kalpurush", "Segoe UI", system-ui, sans-serif;
  --font-en: "Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --font-heading-en: "Poppins", var(--font-en);
  --font-mono: "JetBrains Mono", ui-monospace, Consolas, monospace;
}
html[lang="bn"] body { font-family: var(--font-bn); }
html[lang="en"] body { font-family: var(--font-en); }
```
Load via Google Fonts `<link>` with `display=swap`. For the PDF, **embed Noto Sans Bengali TTF locally** (no web fonts in Dompdf).

---

## 3. Typography

Bangla glyphs have taller ascenders and descenders and stacked conjuncts. Use larger line heights than Latin text.

| Level | Size (desktop / mobile) | Weight | Line height (BN / EN) | Use |
|-------|-------------------------|-------:|-----------------------|-----|
| Display | 56 / 36 px | 700 | 1.35 / 1.15 | Landing hero only |
| H1 | 40 / 30 px | 700 | 1.4 / 1.2 | Page title |
| H2 | 32 / 26 px | 600 | 1.45 / 1.25 | Section title |
| H3 | 24 / 20 px | 600 | 1.5 / 1.3 | Card title |
| H4 | 20 / 18 px | 600 | 1.55 / 1.35 | Sub-section |
| Body L | 18 / 17 px | 400 | 1.8 / 1.6 | Lead text |
| **Body** | **16 / 16 px** | 400 | **1.75 / 1.6** | Default text |
| Small | 14 px | 400 | 1.7 / 1.5 | Captions, helper text |
| Micro | 12 px | 500 | 1.6 / 1.4 | Badges, legal text (never below 12) |
| Risk number | 72 / 56 px | 700 | 1.1 | Gauge score |

Rules:
- Max line length 70 characters (BN) / 75 (EN).
- Don't use italics for Bangla (poor rendering). Use weight or color for emphasis.
- Bold Bangla at 600-700 only.
- Numerals: stored as ASCII; in `bn` mode format with Bangla digits via `Intl.NumberFormat('bn-BD')` for display. Keep IDs, khatian/dag numbers exactly as in the source and show them in monospace.
- Letter-spacing: 0 for Bangla (never add tracking).

---

## 4. Components

| Component | Spec |
|-----------|------|
| **Buttons** | Primary (navy fill, white text), Secondary (green fill), Outline, Ghost. Height 44px min (touch), radius `--radius-md`, visible focus ring 3px `--color-focus` |
| **Cards** | Surface bg, 1px border, `--radius-lg`, `--shadow-sm`, hover lift `--shadow-md` |
| **Forms** | Labels above fields (Bangla), 44px inputs, inline error text with icon, `aria-describedby` |
| **Risk badge** | Pill, risk bg + risk text color + icon (🟢🟡🔴 or SVG), text from i18n |
| **Risk gauge** | SVG semicircle, stroke animated via `stroke-dashoffset`, center number (Risk number style), level label below; color by level; respects `prefers-reduced-motion` |
| **Comparison table** | Columns: ক্ষেত্র / আপলোডকৃত / রেকর্ড / ফলাফল; status icon ✓ ❌ ⚠️ plus text; stripe rows |
| **KPI card** | Large number, label, small icon; four per row desktop, two mobile |
| **Timeline** | Vertical line, nodes with owner and transfer type, dashed red "missing record" node for gaps |
| **Toast / alert** | Info, success, warning, error with icon and text; `role="status"` / `role="alert"` |
| **Empty state** | Simple SVG + one sentence + one action |
| **Navbar** | Sticky, logo "LandGuard AI" + Bangla tagline, language toggle (secondary position), user menu |

### 4.1 Layout
- Mobile-first; breakpoints **480 / 768 / 1024 / 1280** px; container max 1200px.
- 16px side gutters on mobile; 8-pt spacing scale.
- No horizontal scroll at 320px.

### 4.2 Motion
- Durations 150-300 ms, ease-out. Scroll reveal and gauge fill allowed.
- Disable non-essential motion under `prefers-reduced-motion: reduce`.

### 4.3 Imagery & icons
- Inline SVG icons (Lucide/Heroicons style, hand-written). No icon CDNs.
- Landing images (if used): free sources only (Unsplash/Pexels/Pixabay), verified URLs, descriptive alt, credits in footer, with gradient fallback. Never imitate real land records, seals or government logos; sample documents are HTML/SVG labeled **নমুনা / SAMPLE**.

### 4.4 Accessibility (WCAG 2.1 AA)
- Contrast ≥ 4.5:1 (text) and 3:1 (large text, UI).
- Full keyboard use, visible focus, semantic landmarks, one `<h1>` per page, `lang` attribute set per language, `aria-live` for upload and verification progress.
- Touch targets ≥ 44×44 px.

---

## 5. Voice & Microcopy (Bangla first)

Plain, respectful, non-legal. Avoid accusing language.

| Context | Bangla | English |
|---------|--------|---------|
| Tagline | কেনার আগে যাচাই করুন। | Verify Before You Buy. |
| Upload CTA | নথি আপলোড করুন | Upload document |
| Result title | যাচাইকরণ ফলাফল | Verification result |
| Risk score | ঝুঁকির স্কোর | Risk score |
| Potential issue | সম্ভাব্য অসঙ্গতি পাওয়া গেছে | Potential inconsistency found |
| Owner mismatch | মালিকের নাম রেকর্ডের সাথে মেলেনি | Owner name does not match the record |
| Area mismatch | জমির পরিমাণে পার্থক্য আছে | Land area differs |
| Chain gap | মালিকানা ধারায় একটি রেকর্ড অনুপস্থিত | A record is missing in the ownership chain |
| Download | প্রতিবেদন ডাউনলোড করুন | Download report |
| Login | লগইন | Log in |
| Register | নিবন্ধন করুন | Register |
| Dashboard | ড্যাশবোর্ড | Dashboard |
| Disclaimer | এটি একটি প্রোটোটাইপ, যা কৃত্রিম (সিনথেটিক) ভূমি রেকর্ড ব্যবহার করে। ঝুঁকির স্কোর সম্ভাব্য অসঙ্গতি নির্দেশ করে; এটি জালিয়াতি বা আইনি মালিকানার প্রমাণ নয়। | Prototype using synthetic land records. Risk score indicates potential inconsistencies, not proof of fraud or legal ownership. |

Field labels: মালিকের নাম · খতিয়ান নম্বর · দাগ নম্বর · মৌজা · উপজেলা · জেলা · জমির পরিমাণ (শতক) · দলিল নম্বর · নিবন্ধনের তারিখ.
Risk levels: নিম্ন ঝুঁকি · মধ্যম ঝুঁকি · উচ্চ ঝুঁকি.

Have a native Bangla speaker proofread all strings before submission.
