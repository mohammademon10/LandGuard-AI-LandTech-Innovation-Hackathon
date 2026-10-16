/**
 * LandGuard AI - Client Mock Database & Local Storage Engine
 * Manages client state for the prototype before Phase 2 backend integration.
 * All mock data strictly reflects architecture.md schemas.
 */

import { MOCK_SCENARIOS } from './scenarios.js';

const STORAGE_KEYS = {
  USERS: 'lg_users',
  CURRENT_USER: 'lg_current_user',
  VERIFICATIONS: 'lg_verifications',
  LAND_RECORDS: 'lg_land_records',
  AUDIT_LOGS: 'lg_audit_logs',
  SIMULATION_SETTINGS: 'lg_sim_settings'
};

// Default initial users
const DEFAULT_USERS = [
  {
    id: 1,
    name: "নাগরিক ব্যবহারকারী (Citizen User)",
    email: "citizen@landguard.gov.bd",
    password: "Password123!",
    role: "citizen",
    language: "bn",
    created_at: "2026-10-10 10:00:00"
  },
  {
    id: 2,
    name: "অ্যাডমিন কর্মকর্তা (Land Officer)",
    email: "admin@landguard.gov.bd",
    password: "AdminPassword123!",
    role: "admin",
    language: "bn",
    created_at: "2026-10-01 09:00:00"
  }
];

// 30+ synthetic reference records using real BD administrative geography
const DEFAULT_LAND_RECORDS = [
  { id: 42, owner_name: "মোঃ করিম", khatian_no: "10245", dag_no: "456", mouza: "মির্জাপুর", upazila: "কালিয়াকৈর", district: "গাজীপুর", area_decimal: 10.0, registration_date: "2018-03-20" },
  { id: 101, owner_name: "আনোয়ারুল ইসলাম", khatian_no: "8412", dag_no: "102", mouza: "তেজগাঁও", upazila: "তেজগাঁও", district: "ঢাকা", area_decimal: 15.0, registration_date: "2021-08-14" },
  { id: 102, owner_name: "সুলতানা জাহান", khatian_no: "6504", dag_no: "889", mouza: "সাভার", upazila: "সাভার", district: "ঢাকা", area_decimal: 8.0, registration_date: "2023-01-10" },
  { id: 103, owner_name: "রফিকুল হাসান", khatian_no: "3310", dag_no: "774", mouza: "উত্তরা", upazila: "উত্তরা", district: "ঢাকা", area_decimal: 5.5, registration_date: "2020-05-19" },
  { id: 104, owner_name: "ফাতেমা বেগম", khatian_no: "4521", dag_no: "215", mouza: "মিরপুর", upazila: "মিরপুর", district: "ঢাকা", area_decimal: 12.25, registration_date: "2019-11-04" },
  { id: 105, owner_name: "জালাল আহমেদ", khatian_no: "7890", dag_no: "651", mouza: "গুলশান", upazila: "গুলশান", district: "ঢাকা", area_decimal: 20.0, registration_date: "2017-07-22" },
  { id: 106, owner_name: "তারেক মাহমুদ", khatian_no: "1123", dag_no: "983", mouza: "ধানমন্ডি", upazila: "ধানমন্ডি", district: "ঢাকা", area_decimal: 7.8, registration_date: "2022-04-11" },
  { id: 107, owner_name: "বেগম রোকেয়া", khatian_no: "5632", dag_no: "412", mouza: "কেরানীগঞ্জ", upazila: "কেরানীগঞ্জ", district: "ঢাকা", area_decimal: 18.5, registration_date: "2016-09-30" },
  { id: 108, owner_name: "শামসুল হক", khatian_no: "9021", dag_no: "154", mouza: "টঙ্গী", upazila: "টঙ্গী", district: "গাজীপুর", area_decimal: 9.0, registration_date: "2021-12-05" },
  { id: 109, owner_name: "মনোয়ারা বেগম", khatian_no: "2345", dag_no: "678", mouza: "শ্রীপুর", upazila: "শ্রীপুর", district: "গাজীপুর", area_decimal: 25.0, registration_date: "2015-06-18" },
  { id: 110, owner_name: "আজিজুল হক", khatian_no: "6789", dag_no: "345", mouza: "জয়দেবপুর", upazila: "গাজীপুর সদর", district: "গাজীপুর", area_decimal: 14.3, registration_date: "2020-08-25" },
  { id: 111, owner_name: "কামরুন নাহার", khatian_no: "4321", dag_no: "876", mouza: "সিদ্ধিরগঞ্জ", upazila: "সিদ্ধিরগঞ্জ", district: "নারায়ণগঞ্জ", area_decimal: 6.75, registration_date: "2022-03-14" },
  { id: 112, owner_name: "দেলোয়ার হোসেন", khatian_no: "8765", dag_no: "234", mouza: "ফতুল্লা", upazila: "নারায়ণগঞ্জ সদর", district: "নারায়ণগঞ্জ", area_decimal: 11.0, registration_date: "2019-10-29" },
  { id: 113, owner_name: "শাহ আলম", khatian_no: "3456", dag_no: "567", mouza: "রূপগঞ্জ", upazila: "রূপগঞ্জ", district: "নারায়ণগঞ্জ", area_decimal: 30.0, registration_date: "2014-02-17" },
  { id: 114, owner_name: "নাসরিন আক্তার", khatian_no: "7891", dag_no: "890", mouza: "সোনারগাঁও", upazila: "সোনারগাঁও", district: "নারায়ণগঞ্জ", area_decimal: 16.4, registration_date: "2023-05-09" },
  { id: 115, owner_name: "হাবিবুর রহমান", khatian_no: "2198", dag_no: "321", mouza: "আগ্রাবাদ", upazila: "ডবলমুরিং", district: "চট্টগ্রাম", area_decimal: 8.5, registration_date: "2021-01-20" },
  { id: 116, owner_name: "জাহেদা খাতুন", khatian_no: "5432", dag_no: "654", mouza: "পাহাড়তলী", upazila: "পাহাড়তলী", district: "চট্টগ্রাম", area_decimal: 13.0, registration_date: "2018-11-12" },
  { id: 117, owner_name: "সাইফুল ইসলাম", khatian_no: "9876", dag_no: "987", mouza: "পাঁচলাইশ", upazila: "পাঁচলাইশ", district: "চট্টগ্রাম", area_decimal: 22.0, registration_date: "2017-04-03" },
  { id: 118, owner_name: "ফারহানা ইয়াসমিন", khatian_no: "1357", dag_no: "246", mouza: "কোতোয়ালী", upazila: "কোতোয়ালী", district: "চট্টগ্রাম", area_decimal: 4.8, registration_date: "2022-07-28" },
  { id: 119, owner_name: "মাহবুবুর রশীদ", khatian_no: "2468", dag_no: "135", mouza: "বোয়ালখালী", upazila: "বোয়ালখালী", district: "চট্টগ্রাম", area_decimal: 17.2, registration_date: "2020-10-15" },
  { id: 120, owner_name: "খালেদা আক্তার", khatian_no: "3579", dag_no: "468", mouza: "হাটহাজারী", upazila: "হাটহাজারী", district: "চট্টগ্রাম", area_decimal: 28.5, registration_date: "2016-12-01" },
  { id: 121, owner_name: "মতিউর রহমান", khatian_no: "4680", dag_no: "579", mouza: "শাহজালাল উপশহর", upazila: "সিলেট সদর", district: "সিলেট", area_decimal: 10.5, registration_date: "2021-06-19" },
  { id: 122, owner_name: "সেলিনা চৌধুরী", khatian_no: "5791", dag_no: "680", mouza: "আম্বরখানা", upazila: "সিলেট সদর", district: "সিলেট", area_decimal: 6.2, registration_date: "2019-03-24" },
  { id: 123, owner_name: "আক্তার হোসেন", khatian_no: "6802", dag_no: "791", mouza: "বিয়ানীবাজার", upazila: "বিয়ানীবাজার", district: "সিলেট", area_decimal: 35.0, registration_date: "2015-08-11" },
  { id: 124, owner_name: "রুমানা পারভীন", khatian_no: "7913", dag_no: "802", mouza: "গোলাপগঞ্জ", upazila: "গোলাপগঞ্জ", district: "সিলেট", area_decimal: 19.8, registration_date: "2022-11-08" },
  { id: 125, owner_name: "ইসমাইল খন্দকার", khatian_no: "8024", dag_no: "913", mouza: "বোয়ালিয়া", upazila: "বোয়ালিয়া", district: "রাজশাহী", area_decimal: 12.0, registration_date: "2020-02-16" },
  { id: 126, owner_name: "মাহমুদা খাতুন", khatian_no: "9135", dag_no: "024", mouza: "মতিহার", upazila: "মতিহার", district: "রাজশাহী", area_decimal: 8.9, registration_date: "2018-09-05" },
  { id: 127, owner_name: "আব্দুস সামাদ", khatian_no: "1246", dag_no: "357", mouza: "পবা", upazila: "পবা", district: "রাজশাহী", area_decimal: 26.4, registration_date: "2017-05-30" },
  { id: 128, owner_name: "সাহানা আক্তার", khatian_no: "2357", dag_no: "468", mouza: "বগুড়া সদর", upazila: "বগুড়া সদর", district: "বগুড়া", area_decimal: 15.6, registration_date: "2023-02-14" },
  { id: 129, owner_name: "জয়নাল আবেদীন", khatian_no: "3468", dag_no: "579", mouza: "খুলনা সদর", upazila: "খুলনা সদর", district: "খুলনা", area_decimal: 9.4, registration_date: "2021-09-22" },
  { id: 130, owner_name: "ফরিদা ইয়াসমিন", khatian_no: "4579", dag_no: "680", mouza: "দৌলতপুর", upazila: "দৌলতপুর", district: "খুলনা", area_decimal: 21.0, registration_date: "2016-04-18" }
];

// Initial verifications list
const DEFAULT_VERIFICATIONS = [
  {
    id: 1,
    document_id: 101,
    user_id: 1,
    user_name: "নাগরিক ব্যবহারকারী",
    document_name: "clean_match_deed.pdf",
    document_type: "বিক্রয় কবলা দলিল",
    khatian_no: "8412",
    dag_no: "102",
    owner_name: "আনোয়ারুল ইসলাম",
    mouza: "তেজগাঁও",
    upazila: "তেজগাঁও",
    district: "ঢাকা",
    area_decimal: 15.0,
    risk_score: 5,
    risk_level: "LOW",
    report_code: "LG-2026-00389",
    created_at: "2026-10-15 11:20:00",
    data: MOCK_SCENARIOS.clean_match
  },
  {
    id: 2,
    document_id: 102,
    user_id: 1,
    user_name: "নাগরিক ব্যবহারকারী",
    document_name: "medium_risk_deed.pdf",
    document_type: "দানপত্র দলিল",
    khatian_no: "6504",
    dag_no: "889",
    owner_name: "মোসাম্মাৎ সুলতানা জাহান",
    mouza: "সাভার",
    upazila: "সাভার",
    district: "ঢাকা",
    area_decimal: 8.35,
    risk_score: 40,
    risk_level: "MEDIUM",
    report_code: "LG-2026-00405",
    created_at: "2026-10-16 09:45:00",
    data: MOCK_SCENARIOS.medium_risk
  },
  {
    id: 3,
    document_id: 103,
    user_id: 1,
    user_name: "নাগরিক ব্যবহারকারী",
    document_name: "Rahim_Land_Deed.pdf",
    document_type: "সাফ কবলা দলিল",
    khatian_no: "10245",
    dag_no: "456",
    owner_name: "মোঃ রহিম",
    mouza: "মির্জাপুর",
    upazila: "কালিয়াকৈর",
    district: "গাজীপুর",
    area_decimal: 12.0,
    risk_score: 65,
    risk_level: "HIGH",
    report_code: "LG-2026-00412",
    created_at: "2026-10-16 14:30:00",
    data: MOCK_SCENARIOS.Rahim_Land_Deed
  }
];

// Initial audit logs
const DEFAULT_AUDIT_LOGS = [
  { id: 1, user_id: 1, user_email: "citizen@landguard.gov.bd", action: "login", entity: "auth", entity_id: null, ip: "127.0.0.1", created_at: "2026-10-15 11:15:00" },
  { id: 2, user_id: 1, user_email: "citizen@landguard.gov.bd", action: "upload", entity: "land_documents", entity_id: 101, ip: "127.0.0.1", created_at: "2026-10-15 11:19:30" },
  { id: 3, user_id: 1, user_email: "citizen@landguard.gov.bd", action: "verify", entity: "verification_results", entity_id: 1, ip: "127.0.0.1", created_at: "2026-10-15 11:20:00" },
  { id: 4, user_id: 1, user_email: "citizen@landguard.gov.bd", action: "report_download", entity: "verification_results", entity_id: 1, ip: "127.0.0.1", created_at: "2026-10-15 11:25:10" },
  { id: 5, user_id: 1, user_email: "citizen@landguard.gov.bd", action: "upload", entity: "land_documents", entity_id: 102, ip: "127.0.0.1", created_at: "2026-10-16 09:44:00" },
  { id: 6, user_id: 1, user_email: "citizen@landguard.gov.bd", action: "verify", entity: "verification_results", entity_id: 2, ip: "127.0.0.1", created_at: "2026-10-16 09:45:00" },
  { id: 7, user_id: 1, user_email: "citizen@landguard.gov.bd", action: "upload", entity: "land_documents", entity_id: 103, ip: "127.0.0.1", created_at: "2026-10-16 14:28:45" },
  { id: 8, user_id: 1, user_email: "citizen@landguard.gov.bd", action: "verify", entity: "verification_results", entity_id: 3, ip: "127.0.0.1", created_at: "2026-10-16 14:30:00" },
  { id: 9, user_id: 2, user_email: "admin@landguard.gov.bd", action: "login", entity: "auth", entity_id: null, ip: "127.0.0.1", created_at: "2026-10-16 15:00:00" },
  { id: 10, user_id: 2, user_email: "admin@landguard.gov.bd", action: "admin_view_records", entity: "land_records", entity_id: null, ip: "127.0.0.1", created_at: "2026-10-16 15:05:00" }
];

export class MockDB {
  static init() {
    try {
      if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
      }
      if (!localStorage.getItem(STORAGE_KEYS.LAND_RECORDS)) {
        localStorage.setItem(STORAGE_KEYS.LAND_RECORDS, JSON.stringify(DEFAULT_LAND_RECORDS));
      }
      if (!localStorage.getItem(STORAGE_KEYS.VERIFICATIONS)) {
        localStorage.setItem(STORAGE_KEYS.VERIFICATIONS, JSON.stringify(DEFAULT_VERIFICATIONS));
      }
      if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
        localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(DEFAULT_AUDIT_LOGS));
      }
      if (!localStorage.getItem(STORAGE_KEYS.SIMULATION_SETTINGS)) {
        localStorage.setItem(STORAGE_KEYS.SIMULATION_SETTINGS, JSON.stringify({
          latencyMs: 350,
          simulateFailureRate: 0,
          currentScenarioForNewUpload: 'Rahim_Land_Deed'
        }));
      }
      // If no current user, default to citizen user for seamless prototype exploration
      if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(DEFAULT_USERS[0]));
      }
    } catch (e) {
      console.warn("localStorage init failed or unavailable:", e);
    }
  }

  static get(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.warn(`Error getting ${key}:`, e);
      return null;
    }
  }

  static set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`Error setting ${key}:`, e);
    }
  }

  // User auth methods
  static getCurrentUser() {
    return this.get(STORAGE_KEYS.CURRENT_USER);
  }

  static setCurrentUser(user) {
    this.set(STORAGE_KEYS.CURRENT_USER, user);
  }

  static clearCurrentUser() {
    try {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    } catch (e) {
      console.warn("Failed to clear current user", e);
    }
  }

  static getUsers() {
    return this.get(STORAGE_KEYS.USERS) || DEFAULT_USERS;
  }

  static addUser(user) {
    const users = this.getUsers();
    users.push(user);
    this.set(STORAGE_KEYS.USERS, users);
  }

  // Verifications
  static getVerifications() {
    return this.get(STORAGE_KEYS.VERIFICATIONS) || DEFAULT_VERIFICATIONS;
  }

  static getVerificationById(id) {
    const list = this.getVerifications();
    return list.find(v => String(v.id) === String(id)) || null;
  }

  static addVerification(record) {
    const list = this.getVerifications();
    list.unshift(record);
    this.set(STORAGE_KEYS.VERIFICATIONS, list);
    return record;
  }

  // Reference land records
  static getLandRecords() {
    return this.get(STORAGE_KEYS.LAND_RECORDS) || DEFAULT_LAND_RECORDS;
  }

  static addLandRecord(rec) {
    const list = this.getLandRecords();
    const newId = list.length > 0 ? Math.max(...list.map(r => r.id)) + 1 : 1;
    const newRecord = { ...rec, id: newId };
    list.unshift(newRecord);
    this.set(STORAGE_KEYS.LAND_RECORDS, list);
    return newRecord;
  }

  static updateLandRecord(id, updated) {
    const list = this.getLandRecords();
    const index = list.findIndex(r => String(r.id) === String(id));
    if (index !== -1) {
      list[index] = { ...list[index], ...updated };
      this.set(STORAGE_KEYS.LAND_RECORDS, list);
      return list[index];
    }
    return null;
  }

  static deleteLandRecord(id) {
    const list = this.getLandRecords();
    const filtered = list.filter(r => String(r.id) !== String(id));
    this.set(STORAGE_KEYS.LAND_RECORDS, filtered);
    return true;
  }

  // Audit logs
  static getAuditLogs() {
    return this.get(STORAGE_KEYS.AUDIT_LOGS) || DEFAULT_AUDIT_LOGS;
  }

  static logAction(userId, userEmail, action, entity = null, entityId = null) {
    const logs = this.getAuditLogs();
    const newId = logs.length > 0 ? Math.max(...logs.map(l => l.id)) + 1 : 1;
    const logEntry = {
      id: newId,
      user_id: userId,
      user_email: userEmail || "system",
      action,
      entity,
      entity_id: entityId,
      ip: "127.0.0.1",
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    logs.unshift(logEntry);
    this.set(STORAGE_KEYS.AUDIT_LOGS, logs);
    return logEntry;
  }

  // Simulation settings
  static getSettings() {
    return this.get(STORAGE_KEYS.SIMULATION_SETTINGS) || {
      latencyMs: 350,
      simulateFailureRate: 0,
      currentScenarioForNewUpload: 'Rahim_Land_Deed'
    };
  }

  static updateSettings(newSettings) {
    const current = this.getSettings();
    const updated = { ...current, ...newSettings };
    this.set(STORAGE_KEYS.SIMULATION_SETTINGS, updated);
    return updated;
  }

  static resetToDefault() {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
      localStorage.setItem(STORAGE_KEYS.LAND_RECORDS, JSON.stringify(DEFAULT_LAND_RECORDS));
      localStorage.setItem(STORAGE_KEYS.VERIFICATIONS, JSON.stringify(DEFAULT_VERIFICATIONS));
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(DEFAULT_AUDIT_LOGS));
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(DEFAULT_USERS[0]));
    } catch (e) {
      console.warn("Reset failed", e);
    }
  }
}

// Auto init on import
MockDB.init();
