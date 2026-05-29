import React, { useState, useEffect } from "react";
import api from "../api";
import SurveyModal from "../components/public/SurveyModal";
import CounsellingModal from "../components/public/CounsellingModal";

const BRAND = "#0a6e4e";

export default function StudentDashboard({ user, onLogout }) {
  const [profile, setStudentProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [surveyModalOpen, setSurveyModalOpen] = useState(false);
  const [counsellingOpen, setCounsellingOpen] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/student/profile");
      setStudentProfile(res.data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#f8fafc]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#0a6e4e] mb-4"></div>
        <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">
          Loading Student Portal...
        </div>
      </div>
    );

  const student = profile?.student;
  const survey = profile?.latest_survey;

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-12">
      <div className="max-w-6xl mx-auto pt-20 lg:pt-0">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter leading-none mb-2">
              Student Portal
            </h1>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[9px] md:text-[10px]">
              Academic Year 2026 · Term 2
            </p>
          </div>
          <button
            onClick={onLogout}
            className="w-full md:w-auto h-12 px-8 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all shadow-sm"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 md:p-10 rounded-[35px] md:rounded-[40px] border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#0a6e4e]/5 rounded-full -mr-16 -mt-16"></div>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8 text-center sm:text-left">
                <div className="w-20 h-20 bg-gray-50 rounded-[25px] flex items-center justify-center text-3xl">
                  🎓
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900">
                    {student?.name}
                  </h2>
                  <div className="text-xs font-mono text-gray-400 uppercase tracking-widest">
                    {student?.id}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <div className="text-[9px] md:text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">
                    Enrolled Program
                  </div>
                  <div className="font-bold text-gray-800 leading-tight">
                    {student?.course?.name}
                  </div>
                </div>
                <div>
                  <div className="text-[9px] md:text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">
                    Department
                  </div>
                  <div className="font-bold text-gray-800 leading-tight">
                    {student?.course?.department?.name}
                  </div>
                </div>
                <div>
                  <div className="text-[9px] md:text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">
                    Phone Number
                  </div>
                  <div className="font-bold text-gray-800">
                    {student?.phone}
                  </div>
                </div>
                <div>
                  <div className="text-[9px] md:text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">
                    Status
                  </div>
                  <div>
                    <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase">
                      {student?.status}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-[9px] md:text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">
                    Satisfaction
                  </div>
                  <div>
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${student?.satisfaction === "Unhappy" ? "bg-red-50 text-red-600" : student?.satisfaction === "Neutral" ? "bg-amber-50 text-amber-700" : "bg-green-50 text-green-600"}`}
                    >
                      {student?.satisfaction || "Unknown"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Survey Summary Card */}
            <div className="bg-white p-8 md:p-10 rounded-[35px] md:rounded-[40px] border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-black text-gray-900 italic tracking-tighter">
                  Your Feedback Status
                </h3>
                <div
                  className={`w-3 h-3 rounded-full ${survey ? "bg-green-500" : "bg-amber-500 animate-pulse"}`}
                ></div>
              </div>

              {survey ? (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 bg-gray-50 rounded-3xl">
                    <div className="text-center sm:text-left">
                      <div className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                        Course Satisfaction
                      </div>
                      <div
                        className={`text-xl font-black ${survey.satisfaction_rating === "Unhappy" ? "text-red-500" : "text-[#0a6e4e]"}`}
                      >
                        {survey.satisfaction_rating === "Happy"
                          ? "😊 Happy"
                          : survey.satisfaction_rating === "Unhappy"
                            ? "☹️ Unsatisfied"
                            : "😐 Neutral"}
                      </div>
                    </div>
                    <button
                      onClick={() => setSurveyModalOpen(true)}
                      className="w-full sm:w-auto h-12 px-8 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
                    >
                      Update Status
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="p-6 border border-gray-50 rounded-3xl">
                      <div className="text-[9px] md:text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">
                        Influence Source
                      </div>
                      <div className="font-bold">{survey.influencer}</div>
                    </div>
                    <div className="p-6 border border-gray-50 rounded-3xl">
                      <div className="text-[9px] md:text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">
                        Retention Intent
                      </div>
                      <div className="font-bold">{survey.retention_intent}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-400 mb-8 font-medium">
                    You haven't completed the satisfaction survey yet.
                  </p>
                  <button
                    onClick={() => setSurveyModalOpen(true)}
                    className="h-14 px-10 bg-[#0a6e4e] text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-[#0a6e4e]/20"
                  >
                    Take Survey Now
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar / Quick Links */}
          <div className="space-y-6">
            <div className="bg-gray-900 p-8 rounded-[35px] md:rounded-[40px] text-white shadow-2xl">
              <h4 className="font-black text-lg mb-4 italic tracking-tighter">
                Support Services
              </h4>
              <p className="text-white/50 text-xs mb-8 font-medium leading-relaxed">
                Need help with your studies or personal well-being? Our
                counselling team is available 24/7.
              </p>
              <button
                onClick={() => setCounsellingOpen(true)}
                className="h-12 w-full bg-[#0a6e4e] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-[#0a6e4e]/30 hover:scale-105 transition-all"
              >
                Request Counselling
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for updating/taking survey */}
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

// ── CUSTOM MODAL FOR STUDENTS ──────────────────────────────────────────────

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
      setError("Update failed. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-[50px] shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300">
        <button
          onClick={onClose}
          className="absolute top-8 right-8 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all z-10"
        >
          ×
        </button>

        {success ? (
          <div className="p-20 text-center flex flex-col items-center">
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-5xl mb-8 animate-bounce">
              ✓
            </div>
            <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter">
              Profile Updated
            </h2>
            <p className="text-gray-500 text-lg mb-10">
              Your satisfaction status has been successfully updated in the
              institutional database.
            </p>
            <button
              onClick={onClose}
              className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-black uppercase text-sm tracking-widest hover:scale-105 transition-all"
            >
              Back to Dashboard
            </button>
          </div>
        ) : (
          <div className="p-12">
            <h2 className="text-3xl font-black text-gray-900 mb-2 italic tracking-tighter text-center">
              Satisfaction Update
            </h2>
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest text-center mb-10">
              Academic Quality Loop
            </p>

            {error && (
              <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-2xl text-center font-bold text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="text-center space-y-4">
                <h4 className="text-sm font-black uppercase tracking-widest text-gray-400">
                  Are you satisfied with your current course?
                </h4>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, is_satisfied: true })}
                    className={`flex-1 py-10 rounded-[35px] border-2 transition-all flex flex-col items-center gap-3 ${form.is_satisfied === true ? "border-[#0a6e4e] bg-[#0a6e4e]/5 text-[#0a6e4e]" : "border-gray-100 text-gray-300"}`}
                  >
                    <span className="text-5xl">😊</span>
                    <span className="font-black uppercase tracking-widest text-[10px]">
                      Yes, I am Happy
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, is_satisfied: false })}
                    className={`flex-1 py-10 rounded-[35px] border-2 transition-all flex flex-col items-center gap-3 ${form.is_satisfied === false ? "border-red-500 bg-red-50 text-red-600" : "border-gray-100 text-gray-300"}`}
                  >
                    <span className="text-5xl">☹️</span>
                    <span className="font-black uppercase tracking-widest text-[10px]">
                      No, Not Satisfied
                    </span>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-black uppercase tracking-widest text-gray-400 ml-2">
                  Who chose this course for you?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {["Self", "Parent/Guardian", "Teacher", "Peer/Friend"].map(
                    (inf) => (
                      <label
                        key={inf}
                        className={`p-4 rounded-2xl border-2 text-sm font-bold transition-all cursor-pointer flex items-center gap-3 ${form.influencer === inf ? "border-[#0a6e4e] bg-[#0a6e4e]/5 text-[#0a6e4e]" : "border-gray-100 text-gray-400"}`}
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
                          className={`w-4 h-4 rounded-full border-2 ${form.influencer === inf ? "border-[#0a6e4e] bg-[#0a6e4e]" : "border-gray-200"}`}
                        ></div>
                        {inf}
                      </label>
                    ),
                  )}
                </div>
              </div>

              {!form.is_satisfied && (
                <div className="space-y-6 animate-in slide-in-from-top-4">
                  <textarea
                    required
                    className="w-full p-6 bg-red-50 rounded-[30px] outline-none border-2 border-red-100 focus:bg-white transition-all min-h-[120px]"
                    placeholder="Specific reason for dissatisfaction..."
                    value={form.reason_text}
                    onChange={(e) =>
                      setForm({ ...form, reason_text: e.target.value })
                    }
                  />
                  <div className="flex items-center justify-between p-6 bg-gray-50 rounded-[30px]">
                    <span className="font-bold text-gray-600 text-sm">
                      Are you willing to change the course?
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setForm({
                          ...form,
                          willing_to_change: !form.willing_to_change,
                        })
                      }
                      className={`w-16 h-8 rounded-full relative transition-all ${form.willing_to_change ? "bg-[#0a6e4e]" : "bg-gray-300"}`}
                    >
                      <div
                        className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${form.willing_to_change ? "left-9" : "left-1"}`}
                      ></div>
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-5 bg-gray-900 text-white rounded-[25px] font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
              >
                {submitting ? "Updating Database..." : "Commit Feedback Update"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
