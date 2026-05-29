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
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Clean payload to ensure empty selection values are transmitted as clean null markers
      const payload = {
        student_id: id,
        admission_number: id, // Fallback support for public store validation parameters
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

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-bounce">
        <div className="text-8xl mb-6">🌟</div>
        <h2 className="text-4xl font-black text-[#0a6e4e] mb-4">Thank You!</h2>
        <p className="text-xl text-gray-500">
          Your feedback has been recorded securely.
        </p>
        <p className="mt-12 text-sm text-gray-400 font-mono">
          System auto-resetting...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white p-10 rounded-[40px] shadow-2xl shadow-[#0a6e4e]/5 border border-gray-100">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-gray-900 mb-2">
            Institutional Satisfaction Survey
          </h2>
          <p className="text-gray-400 font-medium tracking-tight uppercase text-xs">
            Term 2 · 2026 Academic Year
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Section 1: Identity */}
          <div className="space-y-4">
            <label className="text-sm font-black uppercase tracking-widest text-gray-400">
              1. Your Identity
            </label>
            <input
              required
              className="w-full p-6 text-2xl rounded-3xl bg-gray-50 border-2 border-transparent focus:border-[#0a6e4e] focus:bg-white outline-none transition-all font-mono placeholder:text-gray-300"
              placeholder="ENTER STUDENT ID (e.g. MG2024001)"
              value={id}
              onChange={(e) => checkStudent(e.target.value)}
            />
            {studentName && (
              <div className="p-4 bg-green-50 rounded-2xl flex items-center gap-3 border border-green-100 animate-in slide-in-from-top-2">
                <span className="text-xl">👤</span>
                <span className="font-bold text-[#0a6e4e]">
                  Welcome back, {studentName}!
                </span>
              </div>
            )}
          </div>

          {/* Section 2: Sentiment */}
          <div className="space-y-4 text-center">
            <label className="text-sm font-black uppercase tracking-widest text-gray-400">
              2. How do you feel about your current course?
            </label>
            <div className="flex gap-4">
              {[
                {
                  val: "Happy",
                  emoji: "😊",
                  bg: "hover:bg-green-50",
                  active: "bg-green-600 text-white",
                },
                {
                  val: "Neutral",
                  emoji: "😐",
                  bg: "hover:bg-gray-100",
                  active: "bg-gray-600 text-white",
                },
                {
                  val: "Unhappy",
                  emoji: "☹️",
                  bg: "hover:bg-red-50",
                  active: "bg-red-600 text-white",
                },
              ].map((item) => (
                <button
                  key={item.val}
                  type="button"
                  onClick={() =>
                    setForm({ ...form, satisfaction_rating: item.val })
                  }
                  className={`flex-1 p-6 rounded-3xl border-2 border-gray-100 transition-all flex flex-col items-center gap-2 ${form.satisfaction_rating === item.val ? item.active : `bg-white ${item.bg} text-gray-400`}`}
                >
                  <span className="text-4xl">{item.emoji}</span>
                  <span className="font-black uppercase text-xs tracking-widest">
                    {item.val}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Influence */}
          <div className="space-y-4">
            <label className="text-sm font-black uppercase tracking-widest text-gray-400">
              3. Who primarily influenced your choice?
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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
                  className={`p-4 rounded-2xl border-2 text-sm font-bold transition-all ${form.influencer === inf ? "border-[#0a6e4e] bg-[#0a6e4e]/5 text-[#0a6e4e]" : "border-gray-100 text-gray-400"}`}
                >
                  {inf}
                </button>
              ))}
            </div>
          </div>

          {/* Section 4: Retention */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-sm font-black uppercase tracking-widest text-gray-400">
                4. Do you want to finish?
              </label>
              <div className="flex gap-2">
                {["Yes", "No", "Uncertain"].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setForm({ ...form, retention_intent: v })}
                    className={`flex-1 py-4 rounded-2xl font-bold border-2 transition-all ${form.retention_intent === v ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-400 border-gray-100"}`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-sm font-black uppercase tracking-widest text-gray-400">
                5. Preferred Alternative?
              </label>
              <select
                className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent outline-none focus:bg-white focus:border-gray-200"
                value={form.alternative_course_id}
                onChange={(e) =>
                  setForm({ ...form, alternative_course_id: e.target.value })
                }
              >
                <option value="">STAY IN CURRENT COURSE</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Section 5: Roadblocks */}
          <div className="space-y-4">
            <label className="text-sm font-black uppercase tracking-widest text-gray-400">
              6. Primary roadblock or challenge?
            </label>
            <select
              className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent outline-none"
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
          </div>

          <button
            type="submit"
            className="w-full py-6 bg-[#0a6e4e] text-white rounded-[30px] font-black text-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-[#0a6e4e]/30"
          >
            SUBMIT CONFIDENTIAL FEEDBACK
          </button>
        </form>
      </div>
    </div>
  );
}
