/**
 * LandGuard AI - i18n Internationalization Engine
 * Default language: bn (Bangla-first)
 * English (en) is secondary toggle.
 * Provides t(), applyI18n(), formatNumber(), formatRiskLevel().
 */

import { api } from './api.js';

let currentLanguage = 'bn';
let translations = {
  bn: null,
  en: null
};

// Bangla numeral digits
const BANGLA_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

/**
 * Format numbers with localized digits
 */
export function formatNumber(num) {
  if (num === null || num === undefined) return '';
  if (currentLanguage === 'bn') {
    return String(num).replace(/[0-9]/g, digit => BANGLA_DIGITS[parseInt(digit, 10)]);
  }
  return String(num);
}

/**
 * Load translation files
 */
export async function initI18n() {
  try {
    // Check saved preference in localStorage or user
    const saved = localStorage.getItem('lg_lang');
    if (saved && (saved === 'bn' || saved === 'en')) {
      currentLanguage = saved;
    }

    // Fetch both language dictionaries
    const [bnRes, enRes] = await Promise.all([
      fetch('/i18n/bn.json').then(r => r.json()),
      fetch('/i18n/en.json').then(r => r.json())
    ]);

    translations.bn = bnRes;
    translations.en = enRes;

    document.documentElement.lang = currentLanguage;
    applyI18n();
    updateLanguageControls();
  } catch (error) {
    console.error("Failed to initialize i18n:", error);
  }
}

/**
 * Retrieve translation key by dot notation with optional params substitution
 */
export function t(key, params = {}) {
  const dict = translations[currentLanguage] || translations.bn;
  if (!dict) return key;

  const parts = key.split('.');
  let val = dict;
  for (const part of parts) {
    if (val && typeof val === 'object' && part in val) {
      val = val[part];
    } else {
      return key; // Fallback to key if not found
    }
  }

  if (typeof val === 'string') {
    // Replace {placeholder} with formatted params
    return val.replace(/\{(\w+)\}/g, (_, placeholder) => {
      const paramVal = params[placeholder];
      if (typeof paramVal === 'number') {
        return formatNumber(paramVal);
      }
      return paramVal !== undefined ? paramVal : `{${placeholder}}`;
    });
  }

  return val;
}

/**
 * Switch language between bn and en
 */
export async function setLanguage(lang) {
  if (lang !== 'bn' && lang !== 'en') return;
  currentLanguage = lang;
  try {
    localStorage.setItem('lg_lang', lang);
  } catch (e) {}

  document.documentElement.lang = lang;
  await api.auth.updateLanguage(lang);
  applyI18n();
  updateLanguageControls();

  // Dispatch custom event for page-specific component updates (e.g. gauge or tables)
  window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
}

export function getCurrentLanguage() {
  return currentLanguage;
}

/**
 * Translate all DOM elements containing data-i18n attributes
 */
export function applyI18n(container = document) {
  const elements = container.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (key) {
      el.textContent = t(key);
    }
  });

  // Handle placeholders
  const placeholderEls = container.querySelectorAll('[data-i18n-placeholder]');
  placeholderEls.forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (key) {
      el.setAttribute('placeholder', t(key));
    }
  });

  // Handle aria-labels
  const ariaEls = container.querySelectorAll('[data-i18n-aria]');
  ariaEls.forEach(el => {
    const key = el.getAttribute('data-i18n-aria');
    if (key) {
      el.setAttribute('aria-label', t(key));
    }
  });
}

function updateLanguageControls() {
  const toggleBtns = document.querySelectorAll('.lang-toggle-btn');
  toggleBtns.forEach(btn => {
    if (currentLanguage === 'bn') {
      btn.textContent = 'English';
      btn.setAttribute('title', 'Switch to English');
    } else {
      btn.textContent = 'বাংলা';
      btn.setAttribute('title', 'বাংলায় পরিবর্তন করুন');
    }
  });
}
