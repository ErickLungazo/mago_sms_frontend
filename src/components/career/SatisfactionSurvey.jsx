import { useState, useEffect } from "react";
import api from "../../api";

export default function SatisfactionSurvey() {
  const [id, setId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    satisfaction_rating: "Happy",
    influencer: "Self",
    retention_intent: "Yes",
    alternative_course_id: "",
    primary_challenge: "None",
    reason_text: "",
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    api
      .get("/courses")
      .then((res) => setCourses(res.data.data || res.data || []));
  }, []);

  const checkStudent = async (val) => {
    setId(val);
    if (val.length > 4) {
      try {
        const res = await api.get(`/students?search=${val}`);
        if (res.data.data?.[0]) setStudentName(res.data.data[0].name);
        else setStudentName("");
      } catch (error) {
        console.error("Unable to resolve student lookup", error);
      }
    } else {
      setStudentName("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        student_id: id,
        admission_number: id,
        ...form,
        alternative_course_id:
          form.alternative_course_id === "" ? null : form.alternative_course_id,
      };

      await api.post("/satisfaction-surveys", payload);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setId("");
        setStudentName("");
        setForm({
          satisfaction_rating: "Happy",
          influencer: "Self",
          retention_intent: "Yes",
          alternative_course_id: "",
          primary_challenge: "None",
          reason_text: "",
        });
      }, 5000);
    } catch (err) {
      const serverMessage =
        err.response?.data?.message ||
        "Survey submission failed. Please check Student ID.";
      alert(serverMessage);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="text-6xl mb-4 animate-bounce">🌟</div>
        <h2 className="text-3xl font-bold text-emerald-800 mb-2">
          Feedback Received
        </h2>
        <p className="text-slate-500 max-w-sm text-sm">
          Your institutional metrics have been safely synchronized. Thank you
          for helping optimize our academic pipelines.
        </p>
        <p className="mt-12 text-xs text-slate-400 font-mono tracking-widest animate-pulse">
          SYSTEM AUTO-RESETTING...
        </p>
      </div>
    );
  }

  // Find selected course name for print validation purposes
  const chosenAlternativeCourse =
    courses.find((c) => String(c.id) === String(form.alternative_course_id))
      ?.name || "Stay in Current Course";

  return (
    <div
      id="survey-print-root"
      className="max-w-4xl mx-auto p-4 md:p-6 text-slate-800 antialiased"
    >
      {/* Precision Print Architecture */}
      <style>{`
        @media print {
          body, html, #root {
            visibility: hidden !important;
            background: #ffffff !important;
          }
          #survey-print-root, #survey-print-root * {
            visibility: visible !important;
          }
          #survey-print-root {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            padding: 0 !important;
          }
          .no-print {
            display: none !important;
          }
          .print-border-clean {
            border: 1px solid #cbd5e1 !important;
            border-radius: 8px !important;
          }
          .print-title {
            font-size: 24px !important;
            color: #000000 !important;
          }
        }
      `}</style>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden print-border-clean">
        {/* Header Block */}
        <div className="p-6 md:p-8 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight print-title">
              Institutional Satisfaction Survey
            </h2>
            <p className="text-slate-400 text-xs uppercase font-semibold tracking-wider mt-1">
              Term 2 · 2026 Academic Metric Gathering
            </p>
          </div>
          <button
            type="button"
            onClick={handlePrint}
            className="no-print self-start sm:self-auto px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 transition"
          >
            🖨️ Print Form State
          </button>
        </div>

        {/* Workspace Matrix */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
          {/* Identity Matrix Grid */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Verification Pipeline
              </label>
              <input
                required
                className="w-full px-4 py-3 text-base rounded-lg border border-slate-200 bg-white focus:border-slate-400 outline-none transition font-mono uppercase tracking-wide placeholder:text-slate-300"
                placeholder="ENTER STUDENT ID (e.g. MG2024001)"
                value={id}
                onChange={(e) => checkStudent(e.target.value)}
              />
            </div>

            {studentName && (
              <div className="p-3 bg-emerald-50 rounded-lg flex items-center gap-2.5 border border-emerald-100">
                <span className="text-sm">👤</span>
                <span className="text-xs font-bold text-emerald-800">
                  Authenticated Record:{" "}
                  <span className="underline">{studentName}</span>
                </span>
              </div>
            )}
          </div>

          {/* Form Matrix Layout Engine Table (Visible Everywhere, Highly Stable for Print Layouts) */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <tbody className="divide-y divide-slate-100 text-xs md:text-sm">
                {/* Sentiment Mapping */}
                <tr>
                  <td className="py-4 pr-4 font-semibold text-slate-500 w-full sm:w-1/3 align-top">
                    1. Course Sentiment
                  </td>
                  <td className="py-4">
                    <div className="flex gap-2 no-print">
                      {[
                        {
                          val: "Happy",
                          emoji: "😊",
                          active:
                            "bg-emerald-50 border-emerald-300 text-emerald-700 font-bold",
                        },
                        {
                          val: "Neutral",
                          emoji: "😐",
                          active:
                            "bg-slate-100 border-slate-300 text-slate-700 font-bold",
                        },
                        {
                          val: "Unhappy",
                          emoji: "☹️",
                          active:
                            "bg-rose-50 border-rose-300 text-rose-700 font-bold",
                        },
                      ].map((item) => (
                        <button
                          key={item.val}
                          type="button"
                          onClick={() =>
                            setForm({ ...form, satisfaction_rating: item.val })
                          }
                          className={`flex-1 p-3 rounded-lg border transition text-center flex flex-col items-center gap-1 ${
                            form.satisfaction_rating === item.val
                              ? item.active
                              : "bg-white border-slate-200 text-slate-400 hover:bg-slate-50"
                          }`}
                        >
                          <span className="text-xl">{item.emoji}</span>
                          <span className="text-[10px] uppercase tracking-wider">
                            {item.val}
                          </span>
                        </button>
                      ))}
                    </div>
                    {/* Fallback layout representation strictly captured during raw browser print actions */}
                    <div className="hidden print:block font-bold text-slate-900">
                      {form.satisfaction_rating}
                    </div>
                  </td>
                </tr>

                {/* Core Influence Factor */}
                <tr>
                  <td className="py-4 pr-4 font-semibold text-slate-500 align-top">
                    2. Primary Decision Influencer
                  </td>
                  <td className="py-4">
                    <div className="flex flex-wrap gap-1.5 no-print">
                      {[
                        "Self",
                        "Parent/Guardian",
                        "Teacher",
                        "Peer/Friend",
                        "Grade Placement",
                      ].map((inf) => (
                        <button
                          key={inf}
                          type="button"
                          onClick={() => setForm({ ...form, influencer: inf })}
                          className={`px-3 py-1.5 rounded-md border text-xs font-medium transition ${
                            form.influencer === inf
                              ? "border-slate-800 bg-slate-800 text-white font-semibold"
                              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {inf}
                        </button>
                      ))}
                    </div>
                    <div className="hidden print:block font-bold text-slate-900">
                      {form.influencer}
                    </div>
                  </td>
                </tr>

                {/* Retention Roadmap */}
                <tr>
                  <td className="py-4 pr-4 font-semibold text-slate-500 align-top">
                    3. Completion Intent Status
                  </td>
                  <td className="py-4">
                    <div className="flex gap-2 max-w-xs no-print">
                      {["Yes", "No", "Uncertain"].map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() =>
                            setForm({ ...form, retention_intent: v })
                          }
                          className={`flex-1 py-1.5 rounded border text-xs font-medium transition ${
                            form.retention_intent === v
                              ? "bg-slate-900 text-white border-slate-900 font-semibold"
                              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                    <div className="hidden print:block font-bold text-slate-900">
                      {form.retention_intent}
                    </div>
                  </td>
                </tr>

                {/* Alternative Alignment Matrix */}
                <tr>
                  <td className="py-4 pr-4 font-semibold text-slate-500 align-top">
                    4. Preferred Course Alternative
                  </td>
                  <td className="py-4">
                    <select
                      className="w-full max-w-md p-2 bg-white rounded-lg border border-slate-200 outline-none focus:border-slate-400 text-xs md:text-sm no-print"
                      value={form.alternative_course_id}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          alternative_course_id: e.target.value,
                        })
                      }
                    >
                      <option value="">STAY IN CURRENT COURSE</option>
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <div className="hidden print:block font-bold text-slate-900">
                      {chosenAlternativeCourse}
                    </div>
                  </td>
                </tr>

                {/* Roadblocks Tracking */}
                <tr>
                  <td className="py-4 pr-4 font-semibold text-slate-500 align-top">
                    5. Primary Roadblock Tracker
                  </td>
                  <td className="py-4">
                    <select
                      className="w-full max-w-md p-2 bg-white rounded-lg border border-slate-200 outline-none focus:border-slate-400 text-xs md:text-sm no-print"
                      value={form.primary_challenge}
                      onChange={(e) =>
                        setForm({ ...form, primary_challenge: e.target.value })
                      }
                    >
                      <option>None</option>
                      <option>Academic Difficulty</option>
                      <option>Financial Struggles</option>
                      <option>Lack of Interest</option>
                      <option>Career Prospects Doubt</option>
                      <option>Family Pressure</option>
                    </select>
                    <div className="hidden print:block font-bold text-slate-900">
                      {form.primary_challenge}
                    </div>
                  </td>
                </tr>

                {/* Deep-Dive Narrative Textarea */}
                <tr>
                  <td className="py-4 pr-4 font-semibold text-slate-500 align-top">
                    6. Contextual Notes / Explanations
                  </td>
                  <td className="py-4">
                    <textarea
                      rows={3}
                      className="w-full p-3 bg-white rounded-lg border border-slate-200 outline-none focus:border-slate-400 text-xs md:text-sm no-print placeholder:text-slate-300"
                      placeholder="Provide raw breakdown or specific structural reasons behind selection mappings..."
                      value={form.reason_text}
                      onChange={(e) =>
                        setForm({ ...form, reason_text: e.target.value })
                      }
                    />
                    <p className="hidden print:block font-medium text-slate-700 whitespace-pre-wrap italic">
                      {form.reason_text || "No notes submitted."}
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Form Actions submission Block */}
          <button
            type="submit"
            className="no-print w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-sm tracking-wide transition shadow-sm"
          >
            SUBMIT CONFIDENTIAL DATA MATRIX
          </button>
        </form>
      </div>
    </div>
  );
}
