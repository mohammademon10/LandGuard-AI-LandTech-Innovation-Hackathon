/**
 * LandGuard AI - Client Authentication & Route Guard Module
 * 
 * NOTE: Mock authentication is a UI placeholder only.
 * In Phase 2 this will integrate with PHP session cookies and CSRF tokens.
 */

import { api } from './api.js';
import { t } from './i18n.js';

export const auth = {
  /**
   * Route Guard: verifies authentication and role requirements
   */
  async requireAuth(options = { requireRole: null }) {
    const res = await api.auth.me();
    if (!res.ok || !res.data || !res.data.user) {
      const currentPath = encodeURIComponent(window.location.pathname + window.location.search);
      const loginUrl = new URL('login.html', window.location.href);
      loginUrl.searchParams.set('redirect', currentPath);
      window.location.href = loginUrl.href;
      return null;
    }

    const user = res.data.user;

    // Check specific role requirement (e.g. admin)
    if (options.requireRole && user.role !== options.requireRole) {
      window.location.href = new URL('403.html', window.location.href).href;
      return null;
    }

    return user;
  },

  /**
   * Get current authenticated user if any
   */
  async getUser() {
    const res = await api.auth.me();
    if (res.ok && res.data) {
      return res.data.user;
    }
    return null;
  },

  /**
   * Handle user logout
   */
  async logout() {
    await api.auth.logout();
    window.location.href = new URL('login.html', window.location.href).href;
  },

  /**
   * Setup global user menu and navigation bar user state
   */
  async setupNavUser() {
    const user = await this.getUser();
    const guestLinks = document.querySelectorAll('.nav-guest-only');
    const authLinks = document.querySelectorAll('.nav-auth-only');
    const adminLinks = document.querySelectorAll('.nav-admin-only');
    const userNameDisplay = document.querySelector('.nav-user-name');
    const userRoleDisplay = document.querySelector('.nav-user-role');

    if (user) {
      guestLinks.forEach(el => el.style.display = 'none');
      authLinks.forEach(el => el.style.display = 'flex');

      if (user.role === 'admin') {
        adminLinks.forEach(el => el.style.display = 'inline-flex');
      } else {
        adminLinks.forEach(el => el.style.display = 'none');
      }

      if (userNameDisplay) {
        userNameDisplay.textContent = user.name;
      }
      if (userRoleDisplay) {
        userRoleDisplay.textContent = user.role === 'admin' ? t('auth.role_admin') : t('auth.role_citizen');
      }
    } else {
      guestLinks.forEach(el => el.style.display = 'inline-flex');
      authLinks.forEach(el => el.style.display = 'none');
      adminLinks.forEach(el => el.style.display = 'none');
    }

    // Attach logout click listener
    const logoutBtns = document.querySelectorAll('.logout-trigger');
    logoutBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.logout();
      });
    });
  }
};
