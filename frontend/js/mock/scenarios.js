/**
 * LandGuard AI - Mock Scenarios
 * Single source of truth for mock verification scenarios.
 * Scenarios match PRD.md §5 and architecture.md §5.
 * 
 * 1. clean_match -> LOW (Score: 0-10)
 * 2. medium_risk -> MEDIUM (Score: 40)
 * 3. Rahim_Land_Deed -> HIGH (Score: 65 = 35 Owner + 20 Area + 10 Chain Gap)
 */

export const MOCK_SCENARIOS = {
  clean_match: {
    id: 1,
    slug: "clean_match",
    title_bn: "পরিচ্ছন্ন দলিল (নিম্ন ঝুঁকি)",
    title_en: "Clean Deed (Low Risk)",
    filename: "clean_match_deed.pdf",
    filesize: "1.4 MB",
    document_type: "বিক্রয় কবলা দলিল (Sale Deed)",
    document_no: "D-2025-8812",
    uploaded_at: "2026-10-15 11:20:00",
    report_code: "LG-2026-00389",
    extracted: {
      owner_name: "আনোয়ারুল ইসলাম",
      khatian_no: "8412",
      dag_no: "102",
      mouza: "তেজগাঁও",
      upazila: "তেজগাঁও",
      district: "ঢাকা",
      area_decimal: 15.0,
      document_no: "D-2025-8812",
      registration_date: "2021-08-14",
      confidence: 0.98,
      missing_fields: [],
      source: "gemini"
    },
    reference: {
      id: 101,
      owner_name: "আনোয়ারুল ইসলাম",
      khatian_no: "8412",
      dag_no: "102",
      mouza: "তেজগাঁও",
      upazila: "তেজগাঁও",
      district: "ঢাকা",
      area_decimal: 15.0,
      registration_date: "2021-08-14"
    },
    field_results: {
      owner: { status: "match", uploaded: "আনোয়ারুল ইসলাম", record: "আনোয়ারুল ইসলাম" },
      khatian: { status: "match", uploaded: "8412", record: "8412" },
      dag: { status: "match", uploaded: "102", record: "102" },
      area: { status: "match", uploaded: 15.0, record: 15.0, diff_pct: 0 },
      mouza: { status: "match", uploaded: "তেজগাঁও", record: "তেজগাঁও" },
      upazila: { status: "match", uploaded: "তেজগাঁও", record: "তেজগাঁও" },
      district: { status: "match", uploaded: "ঢাকা", record: "ঢাকা" },
      registration_date: { status: "match", uploaded: "2021-08-14", record: "2021-08-14" }
    },
    chain_gap: false,
    risk_score: 5,
    risk_level: "LOW",
    reasons: [],
    ownership_history: [
      { id: 101, land_id: 101, seq_no: 1, previous_owner: "বদরুদ্দিন ভূঁইয়া", new_owner: "কামাল উদ্দিন", transfer_type: "sale", transfer_date: "1992-02-10", is_gap: false },
      { id: 102, land_id: 101, seq_no: 2, previous_owner: "কামাল উদ্দিন", new_owner: "নুরুল ইসলাম", transfer_type: "sale", transfer_date: "2005-09-18", is_gap: false },
      { id: 103, land_id: 101, seq_no: 3, previous_owner: "নুরুল ইসলাম (উত্তরাধিকার)", new_owner: "আনোয়ারুল ইসলাম", transfer_type: "inheritance", transfer_date: "2021-08-14", is_gap: false }
    ]
  },

  medium_risk: {
    id: 2,
    slug: "medium_risk",
    title_bn: "আংশিক অসঙ্গতিযুক্ত দলিল (মধ্যম ঝুঁকি)",
    title_en: "Partial Inconsistency Deed (Medium Risk)",
    filename: "medium_risk_deed.pdf",
    filesize: "2.1 MB",
    document_type: "দানপত্র দলিল (Gift Deed)",
    document_no: "D-2024-3401",
    uploaded_at: "2026-10-16 09:45:00",
    report_code: "LG-2026-00405",
    extracted: {
      owner_name: "মোসাম্মাৎ সুলতানা জাহান",
      khatian_no: "6504",
      dag_no: "889",
      mouza: "সাভার",
      upazila: "সাভার",
      district: "ঢাকা",
      area_decimal: 8.35,
      document_no: "D-2024-3401",
      registration_date: "2023-01-10",
      confidence: 0.88,
      missing_fields: [],
      source: "gemini"
    },
    reference: {
      id: 102,
      owner_name: "সুলতানা জাহান",
      khatian_no: "6504",
      dag_no: "889",
      mouza: "সাভার",
      upazila: "সাভার",
      district: "ঢাকা",
      area_decimal: 8.0,
      registration_date: "2023-01-10"
    },
    field_results: {
      owner: { status: "partial", uploaded: "মোসাম্মাৎ সুলতানা জাহান", record: "সুলতানা জাহান", note: "নামে সামান্য অমিল (উপাধি সংযোজন)" },
      khatian: { status: "match", uploaded: "6504", record: "6504" },
      dag: { status: "match", uploaded: "889", record: "889" },
      area: { status: "mismatch", uploaded: 8.35, record: 8.0, diff_pct: 4.37 },
      mouza: { status: "match", uploaded: "সাভার", record: "সাভার" },
      upazila: { status: "match", uploaded: "সাভার", record: "সাভার" },
      district: { status: "match", uploaded: "ঢাকা", record: "ঢাকা" },
      registration_date: { status: "match", uploaded: "2023-01-10", record: "2023-01-10" }
    },
    chain_gap: true,
    risk_score: 40,
    risk_level: "MEDIUM",
    reasons: [
      { code: "AREA_PARTIAL_MISMATCH", params: { uploaded: 8.35, record: 8.0, diff: 0.35, diff_pct: 4.37 }, points: 10 },
      { code: "CHAIN_GAP", params: {}, points: 10 },
      { code: "OWNER_PARTIAL_MATCH", params: { uploaded: "মোসাম্মাৎ সুলতানা জাহান", record: "সুলতানা জাহান" }, points: 18 },
      { code: "SUSPICIOUS_DOC", params: {}, points: 2 }
    ],
    ownership_history: [
      { id: 201, land_id: 102, seq_no: 1, previous_owner: "হাজী মহিউদ্দিন", new_owner: "আবুল হোসেন", transfer_type: "sale", transfer_date: "1998-05-14", is_gap: false },
      { id: 202, land_id: 102, seq_no: 2, is_gap: true, note: "২০০৮ সালে কোনো নামজারি রেকর্ড পাওয়া যায়নি" },
      { id: 203, land_id: 102, seq_no: 3, previous_owner: "আবুল হোসেন", new_owner: "সুলতানা জাহান", transfer_type: "gift", transfer_date: "2023-01-10", is_gap: false }
    ]
  },

  Rahim_Land_Deed: {
    id: 3,
    slug: "Rahim_Land_Deed",
    title_bn: "রহিম ল্যান্ড দলিল (উচ্চ ঝুঁকি - ক্যানোনিকাল ডেমো)",
    title_en: "Rahim Land Deed (High Risk - Canonical Demo)",
    filename: "Rahim_Land_Deed.pdf",
    filesize: "2.8 MB",
    document_type: "সাফ কবলা দলিল (Deed of Absolute Sale)",
    document_no: "D-2026-0041",
    uploaded_at: "2026-10-16 14:30:00",
    report_code: "LG-2026-00412",
    extracted: {
      owner_name: "মোঃ রহিম",
      khatian_no: "10245",
      dag_no: "456",
      mouza: "মির্জাপুর",
      upazila: "কালিয়াকৈর",
      district: "গাজীপুর",
      area_decimal: 12.0,
      document_no: "D-2026-0041",
      registration_date: "2024-05-12",
      confidence: 0.93,
      missing_fields: [],
      source: "gemini"
    },
    reference: {
      id: 42,
      owner_name: "মোঃ করিম",
      khatian_no: "10245",
      dag_no: "456",
      mouza: "মির্জাপুর",
      upazila: "কালিয়াকৈর",
      district: "গাজীপুর",
      area_decimal: 10.0,
      registration_date: "2018-03-20"
    },
    field_results: {
      owner: { status: "mismatch", uploaded: "মোঃ রহিম", record: "মোঃ করিম" },
      khatian: { status: "match", uploaded: "10245", record: "10245" },
      dag: { status: "match", uploaded: "456", record: "456" },
      area: { status: "mismatch", uploaded: 12.0, record: 10.0, diff_pct: 20.0 },
      mouza: { status: "match", uploaded: "মির্জাপুর", record: "মির্জাপুর" },
      upazila: { status: "match", uploaded: "কালিয়াকৈর", record: "কালিয়াকৈর" },
      district: { status: "match", uploaded: "গাজীপুর", record: "গাজীপুর" },
      registration_date: { status: "mismatch", uploaded: "2024-05-12", record: "2018-03-20" }
    },
    chain_gap: true,
    risk_score: 65,
    risk_level: "HIGH",
    reasons: [
      { code: "OWNER_MISMATCH", params: { uploaded: "মোঃ রহিম", record: "মোঃ করিম" }, points: 35 },
      { code: "AREA_MISMATCH", params: { uploaded: 12.0, record: 10.0, diff: 2.0, diff_pct: 20 }, points: 20 },
      { code: "CHAIN_GAP", params: {}, points: 10 }
    ],
    ownership_history: [
      { id: 301, land_id: 42, seq_no: 1, previous_owner: "আব্দুল কাদের", new_owner: "রফিকুল ইসলাম", transfer_type: "sale", transfer_date: "1995-04-12", is_gap: false },
      { id: 302, land_id: 42, seq_no: 2, previous_owner: "রফিকুল ইসলাম", new_owner: "আনোয়ার হোসেন", transfer_type: "sale", transfer_date: "2008-11-05", is_gap: false },
      { id: 303, land_id: 42, seq_no: 3, is_gap: true, note: "২০১৫ সালের ওয়ারিশ সূত্রে হস্তান্তর বা নামজারি দলিল অনুপস্থিত" },
      { id: 304, land_id: 42, seq_no: 4, previous_owner: "আনোয়ার হোসেন (উত্তরাধিকার)", new_owner: "মোঃ করিম", transfer_type: "inheritance", transfer_date: "2018-03-20", is_gap: false }
    ]
  }
};
