/**
 * LandGuard AI - Shared App Shell (Navbar, Footer, Theme, i18n hooks)
 * Standardizes app layout across all pages.
 */

import { initI18n, setLanguage, getCurrentLanguage } from './i18n.js';
import { auth } from './auth.js';
import { initSimulationWidget } from './simulator.js';

export async function initAppShell({ activeNav = '' } = {}) {
  // Setup theme
  initTheme();

  // Initialize i18n
  await initI18n();

  // Setup user in navbar
  await auth.setupNavUser();

  // Set active nav link
  if (activeNav) {
    const activeEl = document.querySelector(`.nav-link-custom[data-nav="${activeNav}"]`);
    if (activeEl) activeEl.classList.add('active');
  }

  // Language switch triggers
  const langBtns = document.querySelectorAll('.lang-toggle-btn');
  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const current = getCurrentLanguage();
      setLanguage(current === 'bn' ? 'en' : 'bn');
    });
  });

  // Theme switch triggers
  const themeBtns = document.querySelectorAll('.theme-toggle-btn');
  themeBtns.forEach(btn => {
    btn.addEventListener('click', toggleTheme);
  });

  // Initialize the prototype simulation controller widget
  initSimulationWidget();
}

function initTheme() {
  let theme = 'light';
  try {
    const saved = localStorage.getItem('lg_theme');
    if (saved === 'dark' || saved === 'light') {
      theme = saved;
    }
  } catch (e) {}

  document.documentElement.setAttribute('data-theme', theme);
  updateThemeIcons(theme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  try {
    localStorage.setItem('lg_theme', next);
  } catch (e) {}
  updateThemeIcons(next);
}

function updateThemeIcons(theme) {
  const icons = document.querySelectorAll('.theme-toggle-icon');
  icons.forEach(icon => {
    icon.textContent = theme === 'dark' ? '☀️' : '🌙';
  });
}
