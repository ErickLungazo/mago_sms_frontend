import { useState, useEffect, useCallback } from "react";
import api from "../api";
import SurveyModal from "../components/public/SurveyModal"; // Safely mapped to your structural imports
import CounsellingModal from "../components/public/CounsellingModal";

const BRAND = "#0a6e4e";

export default function StudentDashboard({ user, onLogout }) {
  const [profile, setStudentProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [surveyModalOpen, setSurveyModalOpen] = useState(false);
  const [counsellingOpen, setCounsellingOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await api.get("/student/profile");
      setStudentProfile(res.data);
    } catch (err) {
      console.error("Profile extraction exception:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(fetchProfile);
  }, [fetchProfile]);

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

  const student = profile?.student;
  const survey = profile?.latest_survey;

  const tabs = [
    {
      id: "overview",
      label: "Dashboard Overview",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
    {
      id: "curriculum",
      label: "Course Details",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
    },
    {
      id: "support",
      label: "Counselling & Support",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#f9fafb] font-sans antialiased text-gray-900 overflow-x-hidden">
      {/* ── DESKTOP PERSISTENT SIDEBAR ── */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden lg:flex flex-col flex-shrink-0 z-20">
        <div className="p-6 border-b border-gray-100">
          <div
            style={{ color: BRAND }}
            className="font-extrabold text-lg tracking-wider"
          >
            MAGO TVTC
          </div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 block mt-0.5">
            Student Information Hub
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
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

        <div className="p-4 border-t border-gray-100">
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200/60">
            <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Signed In As
            </div>
            <div className="font-bold text-xs truncate text-gray-800">
              {student?.name || user?.email}
            </div>
            <button
              onClick={onLogout}
              className="mt-3 w-full py-2 bg-white border border-red-200 text-red-600 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-red-50 transition-colors"
            >
              Terminate Session
            </button>
          </div>
        </div>
      </aside>

      {/* ── MOBILE DRAWER NAVIGATION CANVAS ── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
          <div className="relative flex flex-col w-full max-w-xs p-6 bg-white shadow-xl">
            <div className="flex items-center justify-between pb-6 border-b border-gray-100">
              <div>
                <div
                  style={{ color: BRAND }}
                  className="font-extrabold text-lg tracking-wider"
                >
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
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <nav className="flex-1 py-6 space-y-1">
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
            <div className="pt-4 border-t border-gray-100">
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200/60">
                <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Session Identity
                </div>
                <div className="font-bold text-xs truncate text-gray-800 mb-3">
                  {student?.name || user?.email}
                </div>
                <button
                  onClick={onLogout}
                  className="w-full py-2.5 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl font-bold text-[10px] uppercase tracking-widest"
                >
                  Terminate Session
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN WORKSPACE CONTENT CONTAINER ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Floating Viewport App Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-12 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-2 text-gray-500 hover:text-gray-700 lg:hidden focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
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
              <div className="text-xs font-bold text-gray-800">
                {student?.name}
              </div>
              <div className="text-[10px] text-gray-400 font-mono">
                {student?.id || "SIS-STUDENT"}
              </div>
            </div>
            <div className="w-9 h-9 bg-[#e6f4ef] text-[#0a6e4e] rounded-xl flex items-center justify-center font-bold border border-[#0a6e4e]/10 shadow-inner">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          </div>
        </header>

        {/* Workspace Shell Display */}
        <main className="flex-1 p-4 sm:p-6 lg:p-12 overflow-y-auto max-w-6xl w-full mx-auto">
          {/* Welcome Banner Card */}
          <div className="mb-8">
            <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest text-[#0a6e4e] bg-[#e6f4ef] px-3 py-1 rounded-md">
              Academic Session 2026 • Term 2
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-3">
              Hello, {student?.name || "Student User"}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Welcome back to your technical training management desk. All nodes
              functional.
            </p>
          </div>

          {/* Dynamic Viewport Router rendering blocks */}
          {activeTab === "overview" && (
            <div className="space-y-6 sm:space-y-8">
              {/* Account Information Block Frame */}
              <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200 p-5 sm:p-8 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-[#0a6e4e]/5 rounded-full -mr-20 -mt-20 pointer-events-none"></div>

                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.418.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                    />
                  </svg>
                  Account Information Registry
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:grid-cols-2 lg:gap-6">
                  <div className="p-4 bg-gray-50 border border-gray-200/50 rounded-xl sm:rounded-2xl">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Enrolled Curriculum
                    </div>
                    <div className="font-bold text-sm text-gray-800 leading-tight">
                      {student?.course?.name || "General Studies"}
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 border border-gray-200/50 rounded-xl sm:rounded-2xl">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Department Unit
                    </div>
                    <div className="font-bold text-sm text-gray-800 leading-tight">
                      {student?.course?.department?.name || "Technical Pool"}
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 border border-gray-200/50 rounded-xl sm:rounded-2xl">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Registered Contact
                    </div>
                    <div className="font-mono font-bold text-sm text-gray-800">
                      {student?.phone || "—"}
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 border border-gray-200/50 rounded-xl sm:rounded-2xl">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Institutional Status
                    </div>
                    <div className="mt-1">
                      <span className="px-2.5 py-1 bg-green-100 text-green-700 border border-green-200 text-[10px] font-extrabold uppercase rounded-lg">
                        {student?.status || "Active"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid split architecture controls */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {/* Survey management feedback frame */}
                <div className="lg:col-span-2 bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                      <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-[#0a6e4e]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                          />
                        </svg>
                        Feedback Evaluation Pipeline
                      </h3>
                      <span
                        className={`self-start sm:self-center px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider border ${
                          survey
                            ? "bg-green-100 text-green-700 border-green-200"
                            : "bg-amber-100 text-amber-700 animate-pulse border-amber-200"
                        }`}
                      >
                        {survey ? "Synchronized" : "Pending Action"}
                      </span>
                    </div>

                    {survey ? (
                      <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-xl sm:rounded-2xl border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">
                              Recorded Satisfaction Rating
                            </div>
                            <div className="font-bold text-gray-800 text-xs sm:text-sm">
                              {survey.satisfaction_rating === "Happy"
                                ? "Satisfied with Institutional Program"
                                : "Tracking Operational Conflicts Flagged"}
                            </div>
                          </div>
                          <button
                            onClick={() => setSurveyModalOpen(true)}
                            className="text-xs bg-gray-900 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-xl transition-all self-start sm:self-center"
                          >
                            Update Log
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="p-4 border border-gray-100 rounded-xl">
                            <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                              Influence Point
                            </div>
                            <div className="font-semibold text-xs text-gray-700">
                              {survey.influencer}
                            </div>
                          </div>
                          <div className="p-4 border border-gray-100 rounded-xl">
                            <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                              Retention Path Confirmation
                            </div>
                            <div className="font-semibold text-xs text-gray-700">
                              {survey.retention_intent}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto mb-6">
                          You haven't submitted your mandatory feedback loop for
                          this term. Please fill it out to keep your training
                          dashboard metrics current.
                        </p>
                        <button
                          onClick={() => setSurveyModalOpen(true)}
                          className="px-6 py-3 bg-[#0a6e4e] hover:bg-[#085a40] text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-md transition-all"
                        >
                          Launch Survey Loop
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Counselling direct workspace prompt */}
                <div className="bg-gray-900 text-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
                  <div>
                    <h4 className="font-bold text-base text-white tracking-tight mb-3 flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-emerald-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                      Office Support Pipelines
                    </h4>
                    <p className="text-gray-400 text-xs leading-relaxed mb-6">
                      Running into academic blockers, financial challenges, or
                      personal stress? Dispatch an instant request to connect
                      with the counselling desks safely.
                    </p>
                  </div>
                  <button
                    onClick={() => setCounsellingOpen(true)}
                    className="w-full py-3 bg-[#0a6e4e] hover:bg-[#085a40] text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-md"
                  >
                    Request Session Securely
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Curriculum Informational Panel Layout */}
          {activeTab === "curriculum" && (
            <div className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-gray-200 shadow-sm">
              <h3 className="font-bold text-lg text-gray-900 mb-4">
                Your Enrolled Program Syllabus
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mb-6">
                Details fetched live from the Mago TVTC Institutional course
                structure directory tree records.
              </p>

              <div className="p-5 bg-gray-50 rounded-xl sm:rounded-2xl border border-gray-100 space-y-4">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase block tracking-wider">
                    Course Name
                  </span>
                  <span className="font-bold text-sm sm:text-base text-gray-800">
                    {student?.course?.name || "Not Set"}
                  </span>
                </div>
                <hr className="border-gray-200" />
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase block tracking-wider">
                    Department Operations Unit
                  </span>
                  <span className="font-bold text-xs sm:text-sm text-gray-700">
                    {student?.course?.department?.name || "Not Assigned"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Direct Support Hub Area */}
          {activeTab === "support" && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-gray-200 shadow-sm text-center py-12">
              <div className="w-14 h-14 bg-[#e6f4ef] text-[#0a6e4e] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#0a6e4e]/10 shadow-sm">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">
                Institutional Support Center
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto mb-6">
                All scheduled logs, direct follow-ups, and encrypted outreach
                parameters submitted are verified directly by the technical
                guidance team.
              </p>
              <button
                onClick={() => setCounsellingOpen(true)}
                className="px-6 py-2.5 bg-gray-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-gray-800 transition-colors shadow-sm"
              >
                File New Request
              </button>
            </div>
          )}
        </main>
      </div>

      {/* ── IMMUTABLE SYSTEM MODALS ── */}
      <SurveyModal
        isOpen={surveyModalOpen}
        onClose={() => {
          setSurveyModalOpen(false);
          fetchProfile();
        }}
        studentData={student}
        existingSurvey={survey}
      />

      <CounsellingModal
        isOpen={counsellingOpen}
        onClose={() => setCounsellingOpen(false)}
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

