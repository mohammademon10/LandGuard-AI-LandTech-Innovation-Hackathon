/**
 * LandGuard AI - Prototype Simulation Controller (Floating Helper)
 * Allows judges and evaluators to quickly test all 3 scenarios, toggle roles, and test failures.
 */

import { MockDB } from './mock/db.js';
import { setLanguage, getCurrentLanguage } from './i18n.js';

export function initSimulationWidget() {
  // Only inject once
  if (document.getElementById('lgSimWidget')) return;

  const currentSettings = MockDB.getSettings();
  const currentUser = MockDB.getCurrentUser();

  const widgetHtml = `
    <div id="lgSimWidget" class="sim-drawer-wrap" style="position: fixed; bottom: 20px; right: 20px; z-index: 9999;">
      <button id="simToggleBtn" class="btn-custom btn-primary-custom" style="border-radius: var(--radius-pill); box-shadow: var(--shadow-lg); border: 2px solid var(--color-accent); font-size: 0.85rem; padding: 6px 14px;">
        ⚙️ <span class="d-none d-sm-inline">প্রোটোটাইপ কন্ট্রোলার (Demo Control)</span>
      </button>

      <div id="simPanel" class="card-custom" style="display: none; position: absolute; bottom: 50px; right: 0; width: 330px; max-width: 90vw; max-height: 80vh; overflow-y: auto; box-shadow: var(--shadow-lg); border: 2px solid var(--color-border); z-index: 10000; padding: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid var(--color-border); padding-bottom: 8px;">
          <h5 style="margin: 0; font-size: 1rem; font-weight: 700;">🧪 টেস্ট ও ডেমো কন্ট্রোল</h5>
          <button id="simCloseBtn" class="btn-custom btn-ghost-custom" style="min-height: 28px; padding: 2px 8px; font-size: 1.1rem;">&times;</button>
        </div>

        <div style="margin-bottom: 12px;">
          <label class="form-label-custom" style="font-size: 0.85rem;">ক্যানোনিকাল ৩টি ডেমো নথি (Preset):</label>
          <select id="simScenarioSelect" class="form-select-custom" style="font-size: 0.85rem; min-height: 38px;">
            <option value="Rahim_Land_Deed" ${currentSettings.currentScenarioForNewUpload === 'Rahim_Land_Deed' ? 'selected' : ''}>🔴 রহিম ল্যান্ড দলিল (উচ্চ ঝুঁকি: ৬৫)</option>
            <option value="medium_risk" ${currentSettings.currentScenarioForNewUpload === 'medium_risk' ? 'selected' : ''}>🟡 আংশিক অসঙ্গতি (মধ্যম ঝুঁকি: ৪০)</option>
            <option value="clean_match" ${currentSettings.currentScenarioForNewUpload === 'clean_match' ? 'selected' : ''}>🟢 পরিচ্ছন্ন দলিল (নিম্ন ঝুঁকি: ৫)</option>
          </select>
          <small class="text-muted-custom" style="font-size: 0.75rem;">নতুন আপলোডের জন্য এই দৃশ্যপটটি ব্যবহৃত হবে</small>
        </div>

        <div style="margin-bottom: 12px;">
          <label class="form-label-custom" style="font-size: 0.85rem;">ব্যবহারকারী ভূমিকা পরিবর্তন:</label>
          <div style="display: flex; gap: 6px;">
            <button id="simSwitchCitizen" class="btn-custom ${currentUser && currentUser.role === 'citizen' ? 'btn-secondary-custom' : 'btn-outline-custom'}" style="flex: 1; min-height: 36px; font-size: 0.8rem; padding: 4px;">
              👤 নাগরিক
            </button>
            <button id="simSwitchAdmin" class="btn-custom ${currentUser && currentUser.role === 'admin' ? 'btn-secondary-custom' : 'btn-outline-custom'}" style="flex: 1; min-height: 36px; font-size: 0.8rem; padding: 4px;">
              🛡️ অ্যাডমিন
            </button>
          </div>
        </div>

        <div style="margin-bottom: 12px;">
          <label class="form-label-custom" style="font-size: 0.85rem;">সিমুলেটেড লেটেন্সি (ms):</label>
          <input type="range" id="simLatencyInput" min="50" max="1500" step="50" value="${currentSettings.latencyMs || 300}" style="width: 100%;">
          <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--color-text-muted);">
            <span>৫০ms</span>
            <span id="simLatencyVal">${currentSettings.latencyMs || 300}ms</span>
            <span>১৫০০ms</span>
          </div>
        </div>

        <div style="margin-bottom: 12px;">
          <label class="form-label-custom" style="font-size: 0.85rem;">ব্যর্থতা সিমুলেশন (Error Rate):</label>
          <select id="simFailureSelect" class="form-select-custom" style="font-size: 0.85rem; min-height: 38px;">
            <option value="0" ${currentSettings.simulateFailureRate === 0 ? 'selected' : ''}>স্বাভাবিক (০% ত্রুটি)</option>
            <option value="1" ${currentSettings.simulateFailureRate === 1 ? 'selected' : ''}>১০০% সার্ভার ত্রুটি সিমুলেট করুন</option>
          </select>
        </div>

        <div style="border-top: 1px solid var(--color-border); padding-top: 10px; display: flex; flex-direction: column; gap: 8px;">
          <button id="simResetBtn" class="btn-custom btn-outline-custom" style="width: 100%; min-height: 36px; font-size: 0.8rem;">
            🔄 ডেমো ডাটা রিসেট করুন
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', widgetHtml);

  // Bind actions
  const toggleBtn = document.getElementById('simToggleBtn');
  const panel = document.getElementById('simPanel');
  const closeBtn = document.getElementById('simCloseBtn');
  const scenarioSelect = document.getElementById('simScenarioSelect');
  const switchCitizen = document.getElementById('simSwitchCitizen');
  const switchAdmin = document.getElementById('simSwitchAdmin');
  const latencyInput = document.getElementById('simLatencyInput');
  const latencyVal = document.getElementById('simLatencyVal');
  const failureSelect = document.getElementById('simFailureSelect');
  const resetBtn = document.getElementById('simResetBtn');

  toggleBtn.addEventListener('click', () => {
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
  });

  closeBtn.addEventListener('click', () => {
    panel.style.display = 'none';
  });

  scenarioSelect.addEventListener('change', (e) => {
    MockDB.updateSettings({ currentScenarioForNewUpload: e.target.value });
  });

  switchCitizen.addEventListener('click', () => {
    const users = MockDB.getUsers();
    const citizen = users.find(u => u.role === 'citizen') || users[0];
    MockDB.setCurrentUser(citizen);
    window.location.reload();
  });

  switchAdmin.addEventListener('click', () => {
    const users = MockDB.getUsers();
    const adminUser = users.find(u => u.role === 'admin') || users[1];
    MockDB.setCurrentUser(adminUser);
    window.location.reload();
  });

  latencyInput.addEventListener('input', (e) => {
    const ms = parseInt(e.target.value, 10);
    latencyVal.textContent = `${ms}ms`;
    MockDB.updateSettings({ latencyMs: ms });
  });

  failureSelect.addEventListener('change', (e) => {
    const rate = parseFloat(e.target.value);
    MockDB.updateSettings({ simulateFailureRate: rate });
  });

  resetBtn.addEventListener('click', () => {
    if (confirm("আপনি কি সমস্ত ডেমো ডাটা প্রাথমিক অবস্থায় ফিরিয়ে নিতে চান?")) {
      MockDB.resetToDefault();
      window.location.reload();
    }
  });
}
