/**
 * LandGuard AI - Unified API Client Layer
 * 
 * Single gate for all backend and mock data interactions across the application.
 * USE_MOCK switch allows swapping from mock simulation to live PHP backend with zero changes in UI components.
 * Standard response envelope: { ok: boolean, data: any, error: { code: string, message_key: string } | null }
 */

import { MockDB } from './mock/db.js';
import { MOCK_SCENARIOS } from './mock/scenarios.js';

export const USE_MOCK = true;
const API_BASE_URL = '/api';

// Helper for simulating controllable latency & failure in mock mode
const mockDelay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const handleMockResponse = async (handler) => {
  const settings = MockDB.getSettings();
  const latency = settings.latencyMs || 250;
  await mockDelay(latency);

  // Controllable failure simulation if enabled
  if (settings.simulateFailureRate > 0 && Math.random() < settings.simulateFailureRate) {
    return {
      ok: false,
      data: null,
      error: {
        code: "SIMULATED_SERVER_ERROR",
        message_key: "error.simulated_server_error"
      }
    };
  }

  try {
    return await handler();
  } catch (err) {
    console.error("Mock API Exception:", err);
    return {
      ok: false,
      data: null,
      error: {
        code: "INTERNAL_ERROR",
        message_key: "error.internal_error"
      }
    };
  }
};

// Generic fetch wrapper for live backend (used when USE_MOCK = false)
async function liveRequest(url, options = {}) {
  try {
    const defaults = {
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    };

    if (!(options.body instanceof FormData)) {
      defaults.headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...defaults,
      ...options,
      headers: {
        ...defaults.headers,
        ...(options.headers || {})
      }
    });

    const json = await response.json();
    return json;
  } catch (error) {
    return {
      ok: false,
      data: null,
      error: {
        code: "NETWORK_ERROR",
        message_key: "error.network_error"
      }
    };
  }
}

export const api = {
  // Auth API
  auth: {
    async register({ name, email, password, role = 'citizen', language = 'bn' }) {
      if (USE_MOCK) {
        return handleMockResponse(() => {
          if (!name || !email || !password) {
            return {
              ok: false,
              data: null,
              error: { code: "VALIDATION_FAILED", message_key: "auth.error.missing_fields" }
            };
          }
          const users = MockDB.getUsers();
          if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
            return {
              ok: false,
              data: null,
              error: { code: "DUPLICATE_EMAIL", message_key: "auth.error.duplicate_email" }
            };
          }
          const newUser = {
            id: users.length + 1,
            name,
            email,
            password, // Note: Mock UI placeholder only; real hashing happens in PHP backend
            role,
            language,
            created_at: new Date().toISOString()
          };
          MockDB.addUser(newUser);
          MockDB.setCurrentUser(newUser);
          MockDB.logAction(newUser.id, newUser.email, "register", "users", newUser.id);

          return {
            ok: true,
            data: {
              user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                language: newUser.language
              }
            },
            error: null
          };
        });
      }
      return liveRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role, language })
      });
    },

    async login({ email, password }) {
      if (USE_MOCK) {
        return handleMockResponse(() => {
          const users = MockDB.getUsers();
          const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
          if (!user || user.password !== password) {
            return {
              ok: false,
              data: null,
              error: { code: "INVALID_CREDENTIALS", message_key: "auth.error.invalid_credentials" }
            };
          }

          MockDB.setCurrentUser(user);
          MockDB.logAction(user.id, user.email, "login", "auth", user.id);

          return {
            ok: true,
            data: {
              user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                language: user.language
              }
            },
            error: null
          };
        });
      }
      return liveRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
    },

    async logout() {
      if (USE_MOCK) {
        return handleMockResponse(() => {
          const user = MockDB.getCurrentUser();
          if (user) {
            MockDB.logAction(user.id, user.email, "logout", "auth", user.id);
          }
          MockDB.clearCurrentUser();
          return { ok: true, data: { logged_out: true }, error: null };
        });
      }
      return liveRequest('/auth/logout', { method: 'POST' });
    },

    async me() {
      if (USE_MOCK) {
        return handleMockResponse(() => {
          const user = MockDB.getCurrentUser();
          if (!user) {
            return {
              ok: false,
              data: null,
              error: { code: "UNAUTHENTICATED", message_key: "auth.error.unauthenticated" }
            };
          }
          return {
            ok: true,
            data: {
              user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                language: user.language || 'bn'
              }
            },
            error: null
          };
        });
      }
      return liveRequest('/me');
    },

    async updateLanguage(language) {
      if (USE_MOCK) {
        return handleMockResponse(() => {
          const user = MockDB.getCurrentUser();
          if (user) {
            user.language = language;
            MockDB.setCurrentUser(user);
            const users = MockDB.getUsers();
            const idx = users.findIndex(u => u.id === user.id);
            if (idx !== -1) {
              users[idx].language = language;
              MockDB.set('lg_users', users);
            }
          }
          try {
            localStorage.setItem('lg_lang', language);
          } catch (e) {}
          return { ok: true, data: { language }, error: null };
        });
      }
      return liveRequest('/me/language', {
        method: 'PATCH',
        body: JSON.stringify({ language })
      });
    }
  },

  // Document Upload & Verification
  documents: {
    async upload({ file, documentType = 'বিক্রয় কবলা দলিল', scenarioKey = null }) {
      if (USE_MOCK) {
        return handleMockResponse(() => {
          const currentUser = MockDB.getCurrentUser();
          if (!currentUser) {
            return {
              ok: false,
              data: null,
              error: { code: "UNAUTHENTICATED", message_key: "auth.error.unauthenticated" }
            };
          }

          // Choose scenario
          let scenarioToUse = MOCK_SCENARIOS.Rahim_Land_Deed;
          if (scenarioKey && MOCK_SCENARIOS[scenarioKey]) {
            scenarioToUse = MOCK_SCENARIOS[scenarioKey];
          } else {
            const fileName = file ? (file.name || '') : '';
            if (fileName.includes('clean') || fileName.includes('low')) {
              scenarioToUse = MOCK_SCENARIOS.clean_match;
            } else if (fileName.includes('medium')) {
              scenarioToUse = MOCK_SCENARIOS.medium_risk;
            } else {
              const currentDefault = MockDB.getSettings().currentScenarioForNewUpload || 'Rahim_Land_Deed';
              scenarioToUse = MOCK_SCENARIOS[currentDefault] || MOCK_SCENARIOS.Rahim_Land_Deed;
            }
          }

          const verifications = MockDB.getVerifications();
          const newId = verifications.length > 0 ? Math.max(...verifications.map(v => v.id)) + 1 : 1;
          const reportCode = `LG-2026-${String(newId + 400).padStart(5, '0')}`;
          const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

          const newVerification = {
            id: newId,
            document_id: 100 + newId,
            user_id: currentUser.id,
            user_name: currentUser.name,
            document_name: file ? file.name : scenarioToUse.filename,
            document_type: documentType || scenarioToUse.document_type,
            khatian_no: scenarioToUse.extracted.khatian_no,
            dag_no: scenarioToUse.extracted.dag_no,
            owner_name: scenarioToUse.extracted.owner_name,
            mouza: scenarioToUse.extracted.mouza,
            upazila: scenarioToUse.extracted.upazila,
            district: scenarioToUse.extracted.district,
            area_decimal: scenarioToUse.extracted.area_decimal,
            risk_score: scenarioToUse.risk_score,
            risk_level: scenarioToUse.risk_level,
            report_code: reportCode,
            created_at: nowStr,
            data: {
              ...scenarioToUse,
              id: newId,
              report_code: reportCode,
              uploaded_at: nowStr,
              filename: file ? file.name : scenarioToUse.filename
            }
          };

          MockDB.addVerification(newVerification);
          MockDB.logAction(currentUser.id, currentUser.email, "upload", "land_documents", newVerification.document_id);
          MockDB.logAction(currentUser.id, currentUser.email, "verify", "verification_results", newId);

          return {
            ok: true,
            data: {
              verification_id: newId,
              report_code: reportCode,
              risk_level: scenarioToUse.risk_level,
              risk_score: scenarioToUse.risk_score
            },
            error: null
          };
        });
      }

      const formData = new FormData();
      formData.append('document', file);
      formData.append('document_type', documentType);
      return liveRequest('/documents/upload', {
        method: 'POST',
        body: formData
      });
    },

    async list() {
      if (USE_MOCK) {
        return handleMockResponse(() => {
          const user = MockDB.getCurrentUser();
          const verifications = MockDB.getVerifications();
          const filtered = user && user.role !== 'admin' 
            ? verifications.filter(v => v.user_id === user.id)
            : verifications;
          return { ok: true, data: filtered, error: null };
        });
      }
      return liveRequest('/documents');
    }
  },

  // Verification Results
  verifications: {
    async get(id) {
      if (USE_MOCK) {
        return handleMockResponse(() => {
          const user = MockDB.getCurrentUser();
          const record = MockDB.getVerificationById(id);
          if (!record) {
            return {
              ok: false,
              data: null,
              error: { code: "RECORD_NOT_FOUND", message_key: "error.record_not_found" }
            };
          }

          // Role guard: citizen can only read their own verifications
          if (user && user.role !== 'admin' && record.user_id !== user.id) {
            return {
              ok: false,
              data: null,
              error: { code: "FORBIDDEN", message_key: "auth.error.forbidden" }
            };
          }

          return {
            ok: true,
            data: record.data,
            error: null
          };
        });
      }
      return liveRequest(`/verifications/${id}`);
    },

    async getReport(id) {
      if (USE_MOCK) {
        return handleMockResponse(() => {
          const user = MockDB.getCurrentUser();
          const record = MockDB.getVerificationById(id);
          if (!record) {
            return {
              ok: false,
              data: null,
              error: { code: "RECORD_NOT_FOUND", message_key: "error.record_not_found" }
            };
          }
          if (user) {
            MockDB.logAction(user.id, user.email, "report_download", "verification_results", id);
          }
          return {
            ok: true,
            data: record.data,
            error: null
          };
        });
      }
      return liveRequest(`/verifications/${id}/report`);
    }
  },

  // Dashboard Stats
  dashboard: {
    async getStats() {
      if (USE_MOCK) {
        return handleMockResponse(() => {
          const user = MockDB.getCurrentUser();
          const all = MockDB.getVerifications();
          const list = user && user.role !== 'admin' 
            ? all.filter(v => v.user_id === user.id) 
            : all;

          const total = list.length;
          const verified = list.length;
          const potential_conflicts = list.filter(v => v.risk_level === 'MEDIUM' || v.risk_level === 'HIGH').length;
          const high_risk_count = list.filter(v => v.risk_level === 'HIGH').length;

          return {
            ok: true,
            data: {
              stats: {
                total_documents: total,
                verified_count: verified,
                potential_conflicts: potential_conflicts,
                high_risk_count: high_risk_count
              },
              recent_verifications: list.slice(0, 10)
            },
            error: null
          };
        });
      }
      return liveRequest('/dashboard/stats');
    }
  },

  // Ownership Timeline
  ownership: {
    async getHistory(landId) {
      if (USE_MOCK) {
        return handleMockResponse(() => {
          // Look inside existing verifications for matching land_id
          const verifications = MockDB.getVerifications();
          for (const v of verifications) {
            if (v.data && v.data.reference && String(v.data.reference.id) === String(landId)) {
              return {
                ok: true,
                data: v.data.ownership_history || [],
                error: null
              };
            }
          }
          // Default fallback timeline
          return {
            ok: true,
            data: MOCK_SCENARIOS.Rahim_Land_Deed.ownership_history,
            error: null
          };
        });
      }
      return liveRequest(`/ownership/${landId}`);
    }
  },

  // Admin APIs
  admin: {
    async getVerifications(riskLevelFilter = 'ALL') {
      if (USE_MOCK) {
        return handleMockResponse(() => {
          const user = MockDB.getCurrentUser();
          if (!user || user.role !== 'admin') {
            return {
              ok: false,
              data: null,
              error: { code: "FORBIDDEN", message_key: "auth.error.forbidden" }
            };
          }
          const all = MockDB.getVerifications();
          const filtered = riskLevelFilter === 'ALL'
            ? all
            : all.filter(v => v.risk_level === riskLevelFilter);

          return { ok: true, data: filtered, error: null };
        });
      }
      return liveRequest(`/admin/verifications?level=${riskLevelFilter}`);
    },

    async getRecords(query = '') {
      if (USE_MOCK) {
        return handleMockResponse(() => {
          const user = MockDB.getCurrentUser();
          if (!user || user.role !== 'admin') {
            return {
              ok: false,
              data: null,
              error: { code: "FORBIDDEN", message_key: "auth.error.forbidden" }
            };
          }
          let records = MockDB.getLandRecords();
          if (query && query.trim() !== '') {
            const q = query.trim().toLowerCase();
            records = records.filter(r => 
              r.owner_name.toLowerCase().includes(q) ||
              r.khatian_no.includes(q) ||
              r.dag_no.includes(q) ||
              r.mouza.toLowerCase().includes(q) ||
              r.district.toLowerCase().includes(q)
            );
          }
          return { ok: true, data: records, error: null };
        });
      }
      return liveRequest(`/admin/records?q=${encodeURIComponent(query)}`);
    },

    async createRecord(record) {
      if (USE_MOCK) {
        return handleMockResponse(() => {
          const user = MockDB.getCurrentUser();
          if (!user || user.role !== 'admin') {
            return {
              ok: false,
              data: null,
              error: { code: "FORBIDDEN", message_key: "auth.error.forbidden" }
            };
          }
          const created = MockDB.addLandRecord(record);
          MockDB.logAction(user.id, user.email, "admin_create_record", "land_records", created.id);
          return { ok: true, data: created, error: null };
        });
      }
      return liveRequest('/admin/records', {
        method: 'POST',
        body: JSON.stringify(record)
      });
    },

    async updateRecord(id, updates) {
      if (USE_MOCK) {
        return handleMockResponse(() => {
          const user = MockDB.getCurrentUser();
          if (!user || user.role !== 'admin') {
            return {
              ok: false,
              data: null,
              error: { code: "FORBIDDEN", message_key: "auth.error.forbidden" }
            };
          }
          const updated = MockDB.updateLandRecord(id, updates);
          MockDB.logAction(user.id, user.email, "admin_update_record", "land_records", id);
          return { ok: true, data: updated, error: null };
        });
      }
      return liveRequest(`/admin/records/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
    },

    async deleteRecord(id) {
      if (USE_MOCK) {
        return handleMockResponse(() => {
          const user = MockDB.getCurrentUser();
          if (!user || user.role !== 'admin') {
            return {
              ok: false,
              data: null,
              error: { code: "FORBIDDEN", message_key: "auth.error.forbidden" }
            };
          }
          MockDB.deleteLandRecord(id);
          MockDB.logAction(user.id, user.email, "admin_delete_record", "land_records", id);
          return { ok: true, data: { id, deleted: true }, error: null };
        });
      }
      return liveRequest(`/admin/records/${id}`, { method: 'DELETE' });
    },

    async getAuditLogs() {
      if (USE_MOCK) {
        return handleMockResponse(() => {
          const user = MockDB.getCurrentUser();
          if (!user || user.role !== 'admin') {
            return {
              ok: false,
              data: null,
              error: { code: "FORBIDDEN", message_key: "auth.error.forbidden" }
            };
          }
          return { ok: true, data: MockDB.getAuditLogs(), error: null };
        });
      }
      return liveRequest('/admin/audit');
    }
  },

  // Prototype Simulation Settings
  simulation: {
    getSettings() {
      return MockDB.getSettings();
    },
    updateSettings(settings) {
      return MockDB.updateSettings(settings);
    },
    resetData() {
      MockDB.resetToDefault();
      return true;
    }
  }
};
