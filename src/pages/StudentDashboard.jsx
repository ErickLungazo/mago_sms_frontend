import React, { useState, useEffect } from "react";
import api from "../api";
import SurveyModal from "../components/public/SurveyModal";
import CounsellingModal from "../components/public/CounsellingModal";

const BRAND = "#0a6e4e";
const BRAND_LIGHT = "#e6f4ef";

export default function StudentDashboard({ user, onLogout }) {
  const [profile, setStudentProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [surveyModalOpen, setSurveyModalOpen] = useState(false);
  const [counsellingOpen, setCounsellingOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const fetchProfile = async () => {
    try {
      const res = await api.get("/student/profile");
      setStudentProfile(res.data);
    } catch (err) {
      console.error("Profile extraction exception:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

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

  return (
    <div className="flex min-h-screen bg-[#f9fafb] font-sans antialiased text-gray-900">
      {/* ── INTERACTIVE WORKSPACE SIDEBAR ── */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col flex-shrink-0 z-20">
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
          {[
            { id: "overview", label: "Dashboard Overview", icon: "📊" },
            { id: "curriculum", label: "Course Details", icon: "📚" },
            { id: "support", label: "Counselling & Support", icon: "💬" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                activeTab === tab.id
                  ? "bg-[#e6f4ef] text-[#0a6e4e]"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span className="text-base">{tab.icon}</span>
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

      {/* ── MAIN DESKTOP CONTEXT FRAME ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Floating App Bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 md:px-12 z-10">
          <div className="flex items-center gap-3">
            <span className="md:hidden font-black text-lg text-[#0a6e4e]">
              M-TVTC
            </span>
            <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1 rounded-full text-xs font-medium text-gray-500">
              <span className="w-2 h-2 rounded-full bg-green-500"></span> Live
              Node Database Session
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
            <div className="w-9 h-9 bg-[#e6f4ef] text-[#0a6e4e] rounded-xl flex items-center justify-center font-bold border border-[#0a6e4e]/10">
              👤
            </div>
            <button
              onClick={onLogout}
              className="md:hidden text-xs font-bold text-red-600 border border-red-200 px-3 py-1.5 rounded-xl bg-red-50"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Dynamic Inner Workspace Shell */}
        <main className="flex-1 p-6 md:p-12 overflow-y-auto max-w-6xl w-full mx-auto">
          {/* Welcome Dashboard Banner Block */}
          <div className="mb-8">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0a6e4e] bg-[#e6f4ef] px-3 py-1 rounded-md">
              Academic Session 2026 • Term 2
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mt-3">
              Hello, {student?.name || "Student User"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Welcome back to your technical training management desk.
            </p>
          </div>

          {/* Render Context Viewport dynamically via state tabs */}
          {activeTab === "overview" && (
            <div className="space-y-8 animate-fade-in">
              {/* Profile Overview Visual Frame */}
              <div className="bg-white rounded-3xl border border-gray-200/80 p-6 md:p-8 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-[#0a6e4e]/5 rounded-full -mr-20 -mt-20 pointer-events-none"></div>

                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                  <span>🪪</span> Account Information Registry
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="p-4 bg-gray-50 border border-gray-200/50 rounded-2xl">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Enrolled Curriculum
                    </div>
                    <div className="font-bold text-sm text-gray-800 leading-tight">
                      {student?.course?.name || "General Studies"}
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 border border-gray-200/50 rounded-2xl">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Department Unit
                    </div>
                    <div className="font-bold text-sm text-gray-800 leading-tight">
                      {student?.course?.department?.name || "Technical Pool"}
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 border border-gray-200/50 rounded-2xl">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Registered Contact
                    </div>
                    <div className="font-mono font-bold text-sm text-gray-800">
                      {student?.phone || "—"}
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 border border-gray-200/50 rounded-2xl">
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

              {/* Two Column Interactive Lower Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Direct Survey Action Handler */}
                <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-3xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                        <span>📝</span> Feedback Evaluation Pipeline
                      </h3>
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider ${
                          survey
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : "bg-amber-100 text-amber-700 animate-pulse border border-amber-200"
                        }`}
                      >
                        {survey ? "Synchronized" : "Pending Action"}
                      </span>
                    </div>

                    {survey ? (
                      <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                          <div>
                            <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">
                              Recorded Satisfaction Rating
                            </div>
                            <div className="font-bold text-gray-800 flex items-center gap-2">
                              {survey.satisfaction_rating === "Happy"
                                ? "😊 Satisfied with Program"
                                : "😐 Tracking Conflicts Flagged"}
                            </div>
                          </div>
                          <button
                            onClick={() => setSurveyModalOpen(true)}
                            className="text-xs bg-gray-900 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-xl transition-all"
                          >
                            Update Log
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="p-4 border border-gray-100 rounded-2xl">
                            <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                              Influence Point
                            </div>
                            <div className="font-semibold text-xs text-gray-700">
                              {survey.influencer}
                            </div>
                          </div>
                          <div className="p-4 border border-gray-100 rounded-2xl">
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
                        <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
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

                {/* Right Column: Direct Secondary Counselling Access Actions */}
                <div className="bg-gray-900 text-white p-6 rounded-3xl shadow-xl flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
                  <div>
                    <h4 className="font-bold text-base text-white tracking-tight mb-3 flex items-center gap-2">
                      <span>🛡️</span> Office Support Pipelines
                    </h4>
                    <p className="text-gray-400 text-xs leading-relaxed mb-6">
                      Running into academic blockers, financial challenges, or
                      personal stress? Dispatch an instant request to connect
                      with the counselling desks.
                    </p>
                  </div>
                  <button
                    onClick={() => setCounsellingOpen(true)}
                    className="w-full py-3 bg-[#0a6e4e] hover:bg-[#085a40] text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-md shadow-[#0a6e4e]/20"
                  >
                    Request Session Securely
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Curriculum Insights Informational Tab */}
          {activeTab === "curriculum" && (
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200/80 shadow-sm animate-fade-in">
              <h3 className="font-bold text-lg text-gray-900 mb-4">
                Your Enrolled Program Syllabus
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Details fetched live from the Mago TVTC Institutional course
                structure directory.
              </p>

              <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase block tracking-wider">
                    Course Name
                  </span>
                  <span className="font-bold text-base text-gray-800">
                    {student?.course?.name || "Not Set"}
                  </span>
                </div>
                <hr className="border-gray-200" />
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase block tracking-wider">
                    Department Operations Unit
                  </span>
                  <span className="font-bold text-sm text-gray-700">
                    {student?.course?.department?.name || "Not Assigned"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Counselling Logs Framework Informational Tab */}
          {activeTab === "support" && (
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200/80 shadow-sm animate-fade-in text-center py-12">
              <div className="w-16 h-16 bg-[#e6f4ef] text-[#0a6e4e] rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                💬
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">
                Institutional Support Center
              </h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
                All scheduled logs, direct follow-ups, and encrypted outreach
                parameters submitted are verified directly by the technical
                guidance team.
              </p>
              <button
                onClick={() => setCounsellingOpen(true)}
                className="px-6 py-2.5 bg-gray-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-gray-800 transition-colors"
              >
                File New Request
              </button>
            </div>
          )}
        </main>
      </div>

      {/* ── MODALS (UNCHANGED FUNCTIONAL PROPS AND HANDLERS) ── */}
      <StudentSurveyModal
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
        }}
      />
    </div>
  );
}

// ── CUSTOM MODAL (UNCHANGED COMPONENT LOGIC & PROPS WITH REFINED CLEAN STYLING) ──

function StudentSurveyModal({ isOpen, onClose, studentData, existingSurvey }) {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    is_satisfied: true,
    influencer: "Self",
    reason_text: "",
    willing_to_change: false,
  });

  useEffect(() => {
    if (existingSurvey) {
      setForm({
        is_satisfied: existingSurvey.satisfaction_rating === "Happy",
        influencer: existingSurvey.influencer || "Self",
        reason_text: existingSurvey.reason_text || "",
        willing_to_change: existingSurvey.retention_intent === "Uncertain",
      });
    }
  }, [existingSurvey, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const payload = {
        ...form,
        satisfaction_rating: form.is_satisfied ? "Happy" : "Unhappy",
        retention_intent: form.is_satisfied
          ? "Yes"
          : form.willing_to_change
            ? "Uncertain"
            : "No",
        primary_challenge: form.is_satisfied ? "None" : "Dissatisfaction",
      };

      if (existingSurvey) {
        await api.put(`/surveys/${existingSurvey.id}`, payload);
      } else {
        await api.post("/public/survey", {
          ...payload,
          admission_number: studentData.id,
          full_name: studentData.name,
          phone: studentData.phone,
          department_id: studentData.course?.department_id,
          course_id: studentData.course_id,
        });
      }
      setSuccess(true);
    } catch (err) {
      setError("Update transaction rejected. Please contact support.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl overflow-hidden relative border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 bg-gray-100 text-gray-500 hover:bg-gray-200 rounded-full flex items-center justify-center font-bold text-sm transition-colors"
        >
          ✕
        </button>

        {success ? (
          <div className="p-10 text-center flex flex-col items-center">
            <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl mb-4">
              ✓
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Metrics Saved Successfully
            </h2>
            <p className="text-xs text-gray-500 mb-6 max-w-xs">
              Your academic tracking information has updated within our system
              registers.
            </p>
            <button
              onClick={onClose}
              className="bg-gray-900 text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
            >
              Return to Workspace
            </button>
          </div>
        ) : (
          <div className="p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-1">
              Satisfaction Status Update
            </h2>
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-6">
              Mago TVTC Quality Assurance Form
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                  Are you satisfied with your current course?
                </h4>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, is_satisfied: true })}
                    className={`flex-1 py-4 border rounded-xl font-bold text-xs transition-all flex flex-col items-center gap-2 ${
                      form.is_satisfied === true
                        ? "border-[#0a6e4e] bg-[#e6f4ef] text-[#0a6e4e]"
                        : "border-gray-200 text-gray-400 hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-xl">😊</span>
                    <span>YES, HAPPY</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, is_satisfied: false })}
                    className={`flex-1 py-4 border rounded-xl font-bold text-xs transition-all flex flex-col items-center gap-2 ${
                      form.is_satisfied === false
                        ? "border-red-500 bg-red-50 text-red-600"
                        : "border-gray-200 text-gray-400 hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-xl">☹️</span>
                    <span>NOT SATISFIED</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-3">
                  Who chose this course for you?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {["Self", "Parent/Guardian", "Teacher", "Peer/Friend"].map(
                    (inf) => (
                      <label
                        key={inf}
                        className={`p-3 border rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2.5 ${
                          form.influencer === inf
                            ? "border-[#0a6e4e] bg-[#e6f4ef] text-[#0a6e4e]"
                            : "border-gray-200 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="radio"
                          className="hidden"
                          name="influencer"
                          value={inf}
                          checked={form.influencer === inf}
                          onChange={(e) =>
                            setForm({ ...form, influencer: e.target.value })
                          }
                        />
                        <div
                          className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                            form.influencer === inf
                              ? "border-[#0a6e4e]"
                              : "border-gray-300"
                          }`}
                        >
                          {form.influencer === inf && (
                            <div className="w-1.5 h-1.5 bg-[#0a6e4e] rounded-full"></div>
                          )}
                        </div>
                        {inf}
                      </label>
                    ),
                  )}
                </div>
              </div>

              {!form.is_satisfied && (
                <div className="space-y-4 animate-in slide-in-from-top-2 duration-200">
                  <textarea
                    required
                    className="w-full p-4 border border-red-200 rounded-xl bg-red-50/50 outline-none focus:bg-white text-xs text-gray-800 placeholder-red-400"
                    placeholder="Please specify your reasons for dissatisfaction here..."
                    value={form.reason_text}
                    onChange={(e) =>
                      setForm({ ...form, reason_text: e.target.value })
                    }
                  />
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="font-bold text-gray-600 text-xs">
                      Are you willing to change your course?
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setForm({
                          ...form,
                          willing_to_change: !form.willing_to_change,
                        })
                      }
                      className={`w-12 h-6 rounded-full relative transition-all ${form.willing_to_change ? "bg-[#0a6e4e]" : "bg-gray-300"}`}
                    >
                      <div
                        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${form.willing_to_change ? "left-6.5" : "left-0.5"}`}
                        style={{
                          left: form.willing_to_change ? "26px" : "2px",
                        }}
                      ></div>
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all disabled:opacity-50"
              >
                {submitting ? "Processing Update..." : "Commit Feedback Update"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
