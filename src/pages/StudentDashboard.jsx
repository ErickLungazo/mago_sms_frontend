import { useState, useEffect, useCallback } from "react";
import api from "../api";
import SurveyModal from "../components/public/SurveyModal"; 
import CounsellingModal from "../components/public/CounsellingModal";

const BRAND = "#0a6e4e";

export default function StudentDashboard({ user, onLogout }) {
  // ── 1. ALL STATES ────────────────────────────────────────────────────────
  const [profile, setStudentProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [surveyModalOpen, setSurveyModalOpen] = useState(false);
  const [counsellingOpen, setCounsellingOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateMessage, setUpdateMessage] = useState({ text: "", type: "" });
  const [profileForm, setProfileForm] = useState({
    phone: "",
    national_id_or_birth_cert: "",
    gender: "Male",
    dob: "",
    age: "",
    county: "",
    home_address: "",
    residence: "Day Scholar",
    funding: "Self-paying",
    special_needs_notes: "",
  });

  const [passForm, setPassForm] = useState({ 
    current_password: "", 
    new_password: "", 
    new_password_confirmation: "" 
  });
  const [passLoading, setPassLoading] = useState(false);
  const [passMessage, setPassMessage] = useState({ text: "", type: "" });

  // ── 2. CALLBACKS ─────────────────────────────────────────────────────────
  const fetchProfile = useCallback(async () => {
    try {
      const res = await api.get("/student/profile");
      setStudentProfile(res.data);
    } catch (err) {
      console.error("Profile extraction exception:", err);
      if (err.response?.status === 403) {
        setUpdateMessage({
          text: err.response.data?.message || "Access denied. Your account may not be correctly linked to a student record.",
          type: "error"
        });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // ── 3. EFFECTS ───────────────────────────────────────────────────────────
  
  // Fetch initial profile
  useEffect(() => {
    queueMicrotask(fetchProfile);
  }, [fetchProfile]);

  // Sync profileForm with student data
  useEffect(() => {
    const student = profile?.student;
    if (student) {
      setProfileForm({
        phone: student.phone || "",
        national_id_or_birth_cert: student.national_id_or_birth_cert || "",
        gender: student.gender || "Male",
        dob: student.dob || "",
        county: student.county || "",
        home_address: student.home_address || "",
        residence: student.residence || "Day Scholar",
        funding: student.funding || "Self-paying",
        special_needs_notes: student.special_needs_notes || "",
        age: student.age || "",
      });
    }
  }, [profile]);

  // Calculate age from DOB automatically
  useEffect(() => {
    if (profileForm.dob) {
      const birthDate = new Date(profileForm.dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age >= 0 && age !== parseInt(profileForm.age)) {
        setProfileForm(prev => ({ ...prev, age: age.toString() }));
      }
    }
  }, [profileForm.dob, profileForm.age]);

  // ── 4. EARLY RETURN (AFTER ALL HOOKS) ────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#f3f4f6]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#0a6e4e] mb-4"></div>
        <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">
          Syncing Mago TVTC Portal Securely...
        </div>
      </div>
    );
  }

  // ── 5. DERIVED DATA & HANDLERS ──────────────────────────────────────────
  const student = profile?.student;
  const survey = profile?.latest_survey;
  const sessions = student?.counselling_sessions || [];

  const tabs = [
    {
      id: "overview",
      label: "Dashboard Overview",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      id: "curriculum",
      label: "Course Details",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      id: "support",
      label: "Counselling & Support",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
    {
      id: "profile",
      label: "My Profile",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      id: "security",
      label: "Security Settings",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
    },
  ];

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPassLoading(true);
    setPassMessage({ text: "", type: "" });
    try {
      await api.post("/student/password-change", passForm);
      setPassMessage({ text: "Password updated successfully!", type: "success" });
      setPassForm({ current_password: "", new_password: "", new_password_confirmation: "" });
    } catch (err) {
      setPassMessage({ text: err.response?.data?.message || "Failed to update password.", type: "error" });
    } finally {
      setPassLoading(false);
      setTimeout(() => setPassMessage({ text: "", type: "" }), 5000);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setUpdateMessage({ text: "", type: "" });
    try {
      await api.post("/student/profile-update", profileForm);
      setUpdateMessage({ text: "Profile updated successfully!", type: "success" });
      fetchProfile();
    } catch (err) {
      setUpdateMessage({
        text: err.response?.data?.message || "Failed to update profile.",
        type: "error",
      });
    } finally {
      setUpdateLoading(false);
      setTimeout(() => setUpdateMessage({ text: "", type: "" }), 5000);
    }
  };

  // ── 6. RENDER ────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen bg-[#f9fafb] font-sans antialiased text-gray-900 overflow-x-hidden">
      <aside className="w-64 bg-white border-r border-gray-200 hidden lg:flex flex-col flex-shrink-0 z-20 h-screen sticky top-0">
        <div className="p-6 border-b border-gray-100">
          <div style={{ color: BRAND }} className="font-extrabold text-lg tracking-wider">
            MAGO TVTC
          </div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 block mt-0.5">
            Student Information Hub
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                activeTab === tab.id
                  ? "bg-[#e6f4ef] text-[#0a6e4e]"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100 mt-auto">
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200/60">
            <div className="flex items-center gap-3 mb-4">
              <div
                style={{ background: BRAND }}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm shadow-sm flex-shrink-0"
              >
                {(student?.name || user?.email || "S").charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                  Student Identity
                </div>
                <div className="font-bold text-xs truncate text-gray-800">
                  {student?.name || user?.email}
                </div>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="w-full py-2.5 bg-white border border-rose-100 text-rose-600 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-rose-50 transition-all flex items-center justify-center gap-2"
            >
              <span>🚪</span> Terminate Session
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="relative flex flex-col w-full max-w-xs p-6 bg-white shadow-xl h-full">
            <div className="flex items-center justify-between pb-6 border-b border-gray-100">
              <div>
                <div style={{ color: BRAND }} className="font-extrabold text-lg tracking-wider">
                  MAGO TVTC
                </div>
                <span className="text-[9px] uppercase font-bold tracking-widest text-gray-400 block">
                  Student Hub
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 outline-none"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex-1 py-6 space-y-1 overflow-y-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                    activeTab === tab.id
                      ? "bg-[#e6f4ef] text-[#0a6e4e]"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>

            <div className="pt-6 border-t border-gray-100">
              <button
                onClick={onLogout}
                className="w-full py-4 bg-rose-50 text-rose-600 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-rose-100 transition-all flex items-center justify-center gap-3"
              >
                <span>🚪</span> Terminate Session
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-12 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-2 text-gray-500 hover:text-gray-700 lg:hidden focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span className="lg:hidden font-black text-lg text-[#0a6e4e] tracking-tight">
              M-TVTC
            </span>
            <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1 rounded-full text-xs font-medium text-gray-500">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Live Node Database Session
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-gray-800">{student?.name}</div>
              <div className="text-[10px] text-gray-400 font-mono">{student?.id || "SIS-STUDENT"}</div>
            </div>
            <div className="w-9 h-9 bg-[#e6f4ef] text-[#0a6e4e] rounded-xl flex items-center justify-center font-bold border border-[#0a6e4e]/10 shadow-inner">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-12 overflow-y-auto max-w-6xl w-full mx-auto">
          <div className="mb-8">
            <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest text-[#0a6e4e] bg-[#e6f4ef] px-3 py-1 rounded-md">
              Academic Session 2026 • Term 2
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-3">
              Hello, {student?.name || "Student User"}
            </h1>
          </div>

          {activeTab === "overview" && (
            <div className="space-y-6 sm:space-y-8">
              <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200 p-5 sm:p-8 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-[#0a6e4e]/5 rounded-full -mr-20 -mt-20 pointer-events-none"></div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.418.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                  Account Information Registry
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:grid-cols-2 lg:gap-6">
                  <div className="p-4 bg-gray-50 border border-gray-200/50 rounded-xl sm:rounded-2xl">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Enrolled Curriculum</div>
                    <div className="font-bold text-sm text-gray-800 leading-tight">{student?.course?.name || "General Studies"}</div>
                  </div>
                  <div className="p-4 bg-gray-50 border border-gray-200/50 rounded-xl sm:rounded-2xl">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Department Unit</div>
                    <div className="font-bold text-sm text-gray-800 leading-tight">{student?.course?.department?.name || "Technical Pool"}</div>
                  </div>
                  <div className="p-4 bg-gray-50 border border-gray-200/50 rounded-xl sm:rounded-2xl">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Registered Contact</div>
                    <div className="font-mono font-bold text-sm text-gray-800">{student?.phone || "—"}</div>
                  </div>
                  <div className="p-4 bg-gray-50 border border-gray-200/50 rounded-xl sm:rounded-2xl">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Institutional Status</div>
                    <div className="mt-1">
                      <span className="px-2.5 py-1 bg-green-100 text-green-700 border border-green-200 text-[10px] font-extrabold uppercase rounded-lg">
                        {student?.status || "Active"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                <div className="lg:col-span-2 bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                      <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                        <svg className="w-4 h-4 text-[#0a6e4e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                        Feedback Evaluation Pipeline
                      </h3>
                      <span className={`self-start sm:self-center px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider border ${survey ? "bg-green-100 text-green-700 border-green-200" : "bg-amber-100 text-amber-700 animate-pulse border-amber-200"}`}>
                        {survey ? "Synchronized" : "Pending Action"}
                      </span>
                    </div>

                    {survey ? (
                      <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-xl sm:rounded-2xl border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Recorded Satisfaction Rating</div>
                            <div className="font-bold text-gray-800 text-xs sm:text-sm">
                              {survey.satisfaction_rating === "Happy" ? "Satisfied with Institutional Program" : "Tracking Operational Conflicts Flagged"}
                            </div>
                          </div>
                          <button onClick={() => setSurveyModalOpen(true)} className="text-xs bg-gray-900 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-xl transition-all self-start sm:self-center">
                            Update Log
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <button onClick={() => setSurveyModalOpen(true)} className="px-6 py-3 bg-[#0a6e4e] hover:bg-[#085a40] text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-md transition-all">
                          Launch Survey Loop
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-900 text-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
                  <div>
                    <h4 className="font-bold text-base text-white tracking-tight mb-3 flex items-center gap-2">
                      <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Office Support Pipelines
                    </h4>
                    <p className="text-gray-400 text-xs leading-relaxed mb-6">Running into blockers? Dispatch an instant request to connect with the counselling desks safely.</p>
                  </div>
                  <button onClick={() => setCounsellingOpen(true)} className="w-full py-3 bg-[#0a6e4e] hover:bg-[#085a40] text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-md">
                    Request Session Securely
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "curriculum" && (
            <div className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-gray-200 shadow-sm">
              <h3 className="font-bold text-lg text-gray-900 mb-4">Your Enrolled Program Syllabus</h3>
              <div className="p-5 bg-gray-50 rounded-xl sm:rounded-2xl border border-gray-100 space-y-4">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase block tracking-wider">Course Name</span>
                  <span className="font-bold text-sm sm:text-base text-gray-800">{student?.course?.name || "Not Set"}</span>
                </div>
                <hr className="border-gray-200" />
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase block tracking-wider">Department Operations Unit</span>
                  <span className="font-bold text-xs sm:text-sm text-gray-700">{student?.course?.department?.name || "Not Assigned"}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "support" && (
            <div className="space-y-6">
              <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-lg text-gray-900">Support Request History</h3>
                  <button
                    onClick={() => setCounsellingOpen(true)}
                    className="px-4 py-2 bg-[#0a6e4e] text-white font-bold text-[10px] uppercase tracking-widest rounded-xl hover:bg-[#085a40] transition-all shadow-md"
                  >
                    File New Request
                  </button>
                </div>

                {sessions.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="py-3 text-[10px] font-black uppercase tracking-widest text-gray-400">Date</th>
                          <th className="py-3 text-[10px] font-black uppercase tracking-widest text-gray-400">Type</th>
                          <th className="py-3 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                          <th className="py-3 text-right"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {sessions.map((s) => (
                          <tr key={s.id} className="group">
                            <td className="py-4 text-xs font-bold text-gray-800">{new Date(s.session_date || s.created_at).toLocaleDateString()}</td>
                            <td className="py-4 text-xs text-gray-600">{s.session_type}</td>
                            <td className="py-4">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase border ${
                                s.status === 'Closed' ? 'bg-green-50 text-green-700 border-green-100' : 
                                s.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-100 animate-pulse' :
                                'bg-blue-50 text-blue-700 border-blue-100'
                              }`}>
                                {s.status}
                              </span>
                            </td>
                            <td className="py-4 text-right">
                              <button 
                                onClick={() => setSelectedSession(s)}
                                className="text-[10px] font-bold text-[#0a6e4e] hover:underline"
                              >
                                View Progress
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <p className="text-xs text-gray-400 font-medium">No prior support requests found in the registry.</p>
                  </div>
                )}
              </div>

              {/* Progress Detail View */}
              {selectedSession && (
                <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border-2 border-[#0a6e4e]/20 shadow-md animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h4 className="font-bold text-base text-gray-900">Request Progress Log</h4>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Ref ID: {selectedSession.id}</p>
                    </div>
                    <button 
                      onClick={() => setSelectedSession(null)}
                      className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Progress Timeline */}
                  <div className="mb-10 px-4">
                    <div className="relative flex items-center justify-between">
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-gray-100"></div>
                      <div 
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-[#0a6e4e] transition-all duration-500" 
                        style={{ 
                          width: selectedSession.status === 'Pending' ? '0%' : 
                                 selectedSession.status === 'Open' ? '50%' : 
                                 selectedSession.status === 'Follow-up' ? '75%' : '100%' 
                        }}
                      ></div>
                      
                      {[
                        { id: 'Pending', label: 'Requested' },
                        { id: 'Open', label: 'In Progress' },
                        { id: 'Closed', label: 'Resolved' }
                      ].map((step, idx) => {
                        const isCompleted = 
                          (selectedSession.status === 'Closed') ||
                          (selectedSession.status === 'Follow-up' && (step.id === 'Pending' || step.id === 'Open')) ||
                          (selectedSession.status === 'Open' && step.id === 'Pending') ||
                          (selectedSession.status === step.id);
                        
                        return (
                          <div key={step.id} className="relative flex flex-col items-center">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center z-10 border-4 ${isCompleted ? 'bg-[#0a6e4e] border-[#e6f4ef]' : 'bg-white border-gray-100'}`}>
                              {isCompleted && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                            </div>
                            <span className={`absolute top-8 whitespace-nowrap text-[9px] font-black uppercase tracking-widest ${isCompleted ? 'text-[#0a6e4e]' : 'text-gray-300'}`}>
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                    <div className="space-y-4">
                      <div>
                        <span className="block text-[9px] font-black uppercase text-gray-400 tracking-wider mb-1">Status Overview</span>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${selectedSession.status === 'Closed' ? 'bg-green-500' : 'bg-amber-500 animate-pulse'}`}></div>
                          <span className="text-sm font-bold text-gray-800">{selectedSession.status}</span>
                        </div>
                      </div>
                      <div>
                        <span className="block text-[9px] font-black uppercase text-gray-400 tracking-wider mb-1">Assigned Counsellor</span>
                        <span className="text-sm font-semibold text-gray-700">{selectedSession.counsellor?.user?.name || "Assigning expert..."}</span>
                      </div>
                    </div>

                    <div className="md:col-span-2 space-y-4">
                      <div>
                        <span className="block text-[9px] font-black uppercase text-gray-400 tracking-wider mb-1">Counsellor Progress Notes</span>
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                          <p className="text-xs text-gray-600 italic leading-relaxed">
                            {selectedSession.status === 'Pending' 
                              ? "Your request has been received and is currently in the review queue. A counsellor will be assigned to your case shortly."
                              : selectedSession.confidential_notes || "Your session is currently being processed. Direct feedback will be provided during your scheduled appointment."
                            }
                          </p>
                        </div>
                      </div>
                      
                      {selectedSession.follow_up_date && (
                        <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                          <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          </div>
                          <div>
                            <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">Scheduled Follow-up</p>
                            <p className="text-xs font-bold text-emerald-700">{new Date(selectedSession.follow_up_date).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-gray-900 text-white p-8 rounded-3xl shadow-xl text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20 pointer-events-none"></div>
                <h3 className="font-bold text-lg mb-2">Need Immediate Assistance?</h3>
                <p className="text-xs text-gray-400 max-w-md mx-auto mb-6 leading-relaxed">
                  All scheduled logs, direct follow-ups, and encrypted outreach parameters submitted are verified directly by the technical guidance team.
                </p>
                <button
                  onClick={() => setCounsellingOpen(true)}
                  className="px-8 py-3 bg-[#0a6e4e] hover:bg-[#085a40] text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-md"
                >
                  File Private Support Request
                </button>
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-gray-200 shadow-sm">
              <div className="mb-6">
                <h3 className="font-bold text-lg text-gray-900">My Personal Profile</h3>
                <p className="text-xs sm:text-sm text-gray-500">Update your personal information to ensure your records are complete and accurate.</p>
              </div>

              {updateMessage.text && (
                <div className={`mb-6 p-4 rounded-xl text-sm font-bold flex items-center gap-2 ${updateMessage.type === "success" ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"}`}>
                  {updateMessage.type === "success" ? "✓" : "⚠️"} {updateMessage.text}
                </div>
              )}

              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-2">Contact & Identity</h4>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Phone Number</label>
                      <input type="tel" className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#0a6e4e] focus:ring-4 focus:ring-[#0a6e4e]/5 transition-all text-sm" value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">National ID / Birth Cert</label>
                      <input type="text" className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#0a6e4e] focus:ring-4 focus:ring-[#0a6e4e]/5 transition-all text-sm" value={profileForm.national_id_or_birth_cert} onChange={(e) => setProfileForm({ ...profileForm, national_id_or_birth_cert: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Date of Birth</label>
                      <input type="date" className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#0a6e4e] focus:ring-4 focus:ring-[#0a6e4e]/5 transition-all text-sm" value={profileForm.dob} onChange={(e) => setProfileForm({ ...profileForm, dob: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Age</label>
                      <input type="number" className="w-full h-11 px-4 bg-gray-100 border border-gray-200 rounded-xl outline-none text-gray-500 cursor-not-allowed text-sm" value={profileForm.age} readOnly />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-2">Location & Residence</h4>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">County / Location</label>
                      <input type="text" className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#0a6e4e] focus:ring-4 focus:ring-[#0a6e4e]/5 transition-all text-sm" value={profileForm.county} onChange={(e) => setProfileForm({ ...profileForm, county: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Home Address</label>
                      <input type="text" className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#0a6e4e] focus:ring-4 focus:ring-[#0a6e4e]/5 transition-all text-sm" value={profileForm.home_address} onChange={(e) => setProfileForm({ ...profileForm, home_address: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Special Needs</label>
                      <textarea className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#0a6e4e] focus:ring-4 focus:ring-[#0a6e4e]/5 transition-all text-sm" rows={2} value={profileForm.special_needs_notes} onChange={(e) => setProfileForm({ ...profileForm, special_needs_notes: e.target.value })} />
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <button type="submit" disabled={updateLoading} className="px-8 py-3 bg-[#0a6e4e] hover:bg-[#085a40] text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg transition-all">
                    {updateLoading ? "Saving..." : "Update My Profile"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "security" && (
            <div className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-gray-200 shadow-sm">
              <div className="mb-6">
                <h3 className="font-bold text-lg text-gray-900">Account Security</h3>
                <p className="text-xs sm:text-sm text-gray-500">Update your password to keep your account secure.</p>
              </div>

              {passMessage.text && (
                <div className={`mb-6 p-4 rounded-xl text-sm font-bold flex items-center gap-2 ${passMessage.type === "success" ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"}`}>
                  {passMessage.type === "success" ? "✓" : "⚠️"} {passMessage.text}
                </div>
              )}

              <form onSubmit={handlePasswordUpdate} className="max-w-md space-y-6">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Current Password</label>
                  <input type="password" required className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#0a6e4e] focus:ring-4 focus:ring-[#0a6e4e]/5 transition-all text-sm" value={passForm.current_password} onChange={(e) => setPassForm({ ...passForm, current_password: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">New Password</label>
                  <input type="password" required className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#0a6e4e] focus:ring-4 focus:ring-[#0a6e4e]/5 transition-all text-sm" value={passForm.new_password} onChange={(e) => setPassForm({ ...passForm, new_password: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Confirm New Password</label>
                  <input type="password" required className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#0a6e4e] focus:ring-4 focus:ring-[#0a6e4e]/5 transition-all text-sm" value={passForm.new_password_confirmation} onChange={(e) => setPassForm({ ...passForm, new_password_confirmation: e.target.value })} />
                </div>
                <div className="pt-4 flex justify-start">
                  <button type="submit" disabled={passLoading} className="px-8 py-3 bg-gray-900 hover:bg-black text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all disabled:bg-gray-300">
                    {passLoading ? "Resetting..." : "Update Password"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>

      <SurveyModal
        isOpen={surveyModalOpen}
        onClose={() => { setSurveyModalOpen(false); fetchProfile(); }}
        studentData={student}
        existingSurvey={survey}
      />

      <CounsellingModal
        isOpen={counsellingOpen}
        onClose={() => { setCounsellingOpen(false); fetchProfile(); }}
        onSuccess={fetchProfile}
        initialValues={{
          full_name: student?.name ?? "",
          admission_number: student?.id ?? "",
          phone: student?.phone ?? "",
          department_id: student?.course?.department_id ?? "",
        }}
      />
    </div>
  );
}
