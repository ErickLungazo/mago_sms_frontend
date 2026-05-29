import { useState, useEffect } from "react";
import api from "../../api";

export default function SurveyModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [credentials, setCredentials] = useState(null);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    admission_number: "",
    full_name: "",
    phone: "",
    national_id_or_birth_cert: "",
    gender: "Male",
    age: "",
    dob: "",
    location: "",
    home_address: "",
    residence: "Day Scholar",
    funding: "Self-paying",
    department_id: "",
    course_id: "",
    intake_year: new Date().getFullYear(),
    is_satisfied: true,
    influencer: "Self",
    reason_text: "",
    preferred_course: "",
    willing_to_change: false,
    retention_intent: "Yes",
    // Course-specific structural fields
    practical_theory_ratio: "Perfect Balance (70/30)",
    workshop_equipment_status: "Sufficient & Modern",
    learning_materials_access: true,
    curriculum_pace: "Optimal Pace",
    attachment_confidence: 5,
    primary_academic_roadblock: "None",
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setStep(1);
      setIsSubmitted(false);
      setCredentials(null);
      setError("");
      setForm({
        admission_number: "",
        full_name: "",
        phone: "",
        national_id_or_birth_cert: "",
        gender: "Male",
        age: "",
        dob: "",
        location: "",
        home_address: "",
        residence: "Day Scholar",
        funding: "Self-paying",
        department_id: "",
        course_id: "",
        intake_year: new Date().getFullYear(),
        is_satisfied: true,
        influencer: "Self",
        reason_text: "",
        willing_to_change: false,
        retention_intent: "Yes",
        practical_theory_ratio: "Perfect Balance (70/30)",
        workshop_equipment_status: "Sufficient & Modern",
        learning_materials_access: true,
        curriculum_pace: "Optimal Pace",
        attachment_confidence: 5,
        primary_academic_roadblock: "None",
      });
      api
        .get("/public/departments")
        .then((res) => setDepartments(res.data.data || res.data));
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [isOpen]);

  useEffect(() => {
    if (form.department_id) {
      api
        .get(`/public/courses?department_id=${form.department_id}`)
        .then((res) => setCourses(res.data.data || res.data));
      return;
    }

    const timeoutId = setTimeout(() => setCourses([]), 0);
    return () => clearTimeout(timeoutId);
  }, [form.department_id]);

  const handleStep1Next = () => {
    if (
      form.admission_number &&
      form.full_name &&
      form.phone &&
      form.department_id &&
      form.course_id &&
      form.age &&
      form.location &&
      form.home_address
    ) {
      setStep(2);
    } else {
      setError("Please complete all fields in Step 1.");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleStep2Next = () => {
    setStep(3);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const payload = {
        // Registration Fields
        admission_number: form.admission_number.trim().toUpperCase(),
        full_name: form.full_name,
        phone: form.phone,
        gender: form.gender,
        age: Number(form.age),
        dob: form.dob,
        location: form.location,
        home_address: form.home_address,
        residence: form.residence,
        funding: form.funding,
        course_id: form.course_id,
        national_id_or_birth_cert: form.national_id_or_birth_cert,
        intake_year: Number(form.intake_year),

        // Survey Fields
        is_satisfied: form.is_satisfied,
        influencer: form.influencer,
        retention_intent: form.retention_intent,
        preferred_course:
          !form.is_satisfied && form.willing_to_change
            ? form.preferred_course || "Unspecified"
            : null,
        alternative_course_id: null,
        primary_challenge: form.is_satisfied
          ? "None"
          : form.reason_text || "Dissatisfaction",
        reason_text: form.reason_text,

        // Course-specific structural fields
        practical_theory_ratio: form.practical_theory_ratio,
        workshop_equipment_status: form.workshop_equipment_status,
        learning_materials_access: form.learning_materials_access,
        curriculum_pace: form.curriculum_pace,
        attachment_confidence: form.attachment_confidence,
        primary_academic_roadblock: form.primary_academic_roadblock,
      };

      const response = await api.post("/public/survey", payload);
      setCredentials(response.data.data?.credentials ?? null);
      setIsSubmitted(true);
    } catch (err) {
      console.error("Submission Error:", err);
      const serverMessage = err.response?.data?.message || err.message;
      setError(`Submission Error: ${serverMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-4 md:p-10 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-[40px] shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-8 right-8 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all z-10"
        >
          ×
        </button>

        {isSubmitted ? (
          // Success State - Complete form replacement
          <div className="p-12 md:p-20 text-center flex flex-col items-center justify-center min-h-[500px] md:min-h-[600px] bg-gradient-to-b from-green-50 to-white">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-6xl md:text-7xl mb-8 md:mb-12 animate-bounce shadow-lg">
              ✓
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 md:mb-6 tracking-tighter leading-tight">
              Thank You for Your Feedback
            </h2>
            <p className="text-gray-500 text-lg md:text-xl mb-4 md:mb-6 max-w-lg leading-relaxed font-medium">
              Thank you for your confidential feedback. Your response has been
              recorded departmentally.
            </p>
            {credentials ? (
              <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 mb-6">
                <p className="text-sm text-slate-500 mb-3">
                  Your student account has been created. Use the credentials
                  below to log in.
                </p>
                <p className="text-base font-black">
                  Admission Number: {credentials.admission_number}
                </p>
                <p className="text-base font-black">
                  Password: {credentials.password}
                </p>
                <p className="text-sm text-slate-500 mt-2">
                  Log in using your admission number and the default password
                  above.
                </p>
              </div>
            ) : null}
            <p className="text-gray-400 text-sm md:text-base mb-10 md:mb-14 font-bold">
              Your insights help us improve academic delivery and institutional
              services.
            </p>
            <button
              onClick={onClose}
              className="bg-[#0a6e4e] text-white px-12 md:px-16 py-4 md:py-5 rounded-2xl font-black uppercase text-xs md:text-sm tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
            >
              Close Survey Terminal
            </button>
          </div>
        ) : (
          // Form View
          <div className="flex flex-col md:flex-row h-full">
            {/* Sidebar Info */}
            <div className="md:w-1/3 bg-[#0a6e4e] p-12 text-white flex flex-col justify-between">
              <div>
                <div className="text-2xl font-black mb-2 tracking-tighter italic">
                  MAGO TVTC
                </div>
                <div className="text-[10px] font-bold opacity-60 uppercase tracking-[0.2em] mb-12">
                  Quality Assurance Unit
                </div>

                <h3 className="text-3xl font-black leading-none mb-6">
                  Course Satisfaction Survey
                </h3>
                <p className="opacity-80 text-sm leading-relaxed mb-8 font-medium">
                  Your honest feedback helps the institution align resources
                  with student needs.
                </p>

                <div className="space-y-4">
                  <div
                    className={`flex items-center gap-4 transition-all ${step === 1 ? "scale-110" : "opacity-50"}`}
                  >
                    <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-black">
                      01
                    </div>
                    <div className="text-xs font-black uppercase tracking-widest">
                      Personal Info
                    </div>
                  </div>
                  <div
                    className={`flex items-center gap-4 transition-all ${step === 2 ? "scale-110" : "opacity-50"}`}
                  >
                    <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-black">
                      02
                    </div>
                    <div className="text-xs font-black uppercase tracking-widest">
                      Satisfaction & Support
                    </div>
                  </div>
                  <div
                    className={`flex items-center gap-4 transition-all ${step === 3 ? "scale-110" : "opacity-50"}`}
                  >
                    <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-black">
                      03
                    </div>
                    <div className="text-xs font-black uppercase tracking-widest">
                      Program Structure
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-[10px] font-bold opacity-40 uppercase tracking-widest">
                Secure Terminal Session 2026
              </div>
            </div>

            {/* Form Area */}
            <div className="flex-1 p-8 md:p-12 overflow-y-auto max-h-[85vh]">
              {error && (
                <div className="mb-8 p-6 bg-red-100 border-4 border-red-500 rounded-3xl flex flex-col gap-2 text-red-900 animate-in bounce-in">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">🚫</span>
                    <h4 className="text-xl font-black uppercase">
                      System Error
                    </h4>
                  </div>
                  <p className="font-bold text-lg">{error}</p>
                  <p className="text-sm opacity-70">
                    Please report this error to the administrator.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                {step === 1 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 animate-in fade-in slide-in-from-right-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">
                        Admission Number
                      </label>
                      <input
                        required
                        placeholder="e.g. MG2024001"
                        className="w-full h-14 p-4 bg-gray-50 rounded-2xl outline-none focus:ring-4 focus:ring-[#0a6e4e]/5 transition-all font-mono text-base"
                        value={form.admission_number || ""}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            admission_number: e.target.value.toUpperCase(),
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">
                        Full Name
                      </label>
                      <input
                        required
                        placeholder="Legal Name"
                        className="w-full h-14 p-4 bg-gray-50 rounded-2xl outline-none focus:ring-4 focus:ring-[#0a6e4e]/5 transition-all text-base"
                        value={form.full_name || ""}
                        onChange={(e) =>
                          setForm({ ...form, full_name: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">
                        National ID / Birth Cert (Optional)
                      </label>
                      <input
                        placeholder="ID Number"
                        className="w-full h-14 p-4 bg-gray-50 rounded-2xl outline-none focus:ring-4 focus:ring-[#0a6e4e]/5 transition-all text-base"
                        value={form.national_id_or_birth_cert || ""}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            national_id_or_birth_cert: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">
                        Phone Number
                      </label>
                      <input
                        required
                        type="tel"
                        placeholder="07..."
                        className="w-full h-14 p-4 bg-gray-50 rounded-2xl outline-none focus:ring-4 focus:ring-[#0a6e4e]/5 transition-all text-base"
                        value={form.phone || ""}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">
                        Gender
                      </label>
                      <select
                        className="w-full h-14 p-4 bg-gray-50 rounded-2xl outline-none text-base"
                        value={form.gender || "Male"}
                        onChange={(e) =>
                          setForm({ ...form, gender: e.target.value })
                        }
                      >
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">
                        Age
                      </label>
                      <input
                        required
                        type="number"
                        placeholder="Years"
                        className="w-full h-14 p-4 bg-gray-50 rounded-2xl outline-none text-base"
                        value={form.age || ""}
                        onChange={(e) =>
                          setForm({ ...form, age: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">
                        Date of Birth (Optional)
                      </label>
                      <input
                        type="date"
                        className="w-full h-14 p-4 bg-gray-50 rounded-2xl outline-none text-base"
                        value={form.dob || ""}
                        onChange={(e) =>
                          setForm({ ...form, dob: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">
                        County
                      </label>
                      <input
                        required
                        placeholder="e.g. Vihiga"
                        className="w-full h-14 p-4 bg-gray-50 rounded-2xl outline-none text-base"
                        value={form.location || ""}
                        onChange={(e) =>
                          setForm({ ...form, location: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">
                        Home Address
                      </label>
                      <input
                        required
                        placeholder="e.g. 123 Main St"
                        className="w-full h-14 p-4 bg-gray-50 rounded-2xl outline-none text-base"
                        value={form.home_address || ""}
                        onChange={(e) =>
                          setForm({ ...form, home_address: e.target.value })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">
                          Residence
                        </label>
                        <select
                          className="w-full h-14 p-4 bg-gray-50 rounded-2xl outline-none text-base"
                          value={form.residence}
                          onChange={(e) =>
                            setForm({ ...form, residence: e.target.value })
                          }
                        >
                          <option value="Day Scholar">Day Scholar</option>
                          <option value="Boarder">Boarder</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">
                          Funding Source
                        </label>
                        <select
                          className="w-full h-14 p-4 bg-gray-50 rounded-2xl outline-none text-base"
                          value={form.funding}
                          onChange={(e) =>
                            setForm({ ...form, funding: e.target.value })
                          }
                        >
                          <option value="Self-paying">Self-paying</option>
                          <option value="Sponsored">Sponsored</option>
                          <option value="Loan">Loan</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">
                        Department
                      </label>
                      <select
                        required
                        className="w-full h-14 p-4 bg-gray-50 rounded-2xl outline-none text-base"
                        value={form.department_id || ""}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            department_id: e.target.value,
                            course_id: "",
                          })
                        }
                      >
                        <option value="">Select Dept...</option>
                        {departments.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">
                        Course Enrolled
                      </label>
                      <select
                        required
                        className="w-full h-14 p-4 bg-gray-50 rounded-2xl outline-none text-base"
                        value={form.course_id || ""}
                        onChange={(e) =>
                          setForm({ ...form, course_id: e.target.value })
                        }
                        disabled={!form.department_id}
                      >
                        <option value="">Select Course...</option>
                        {courses.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">
                        Intake Year
                      </label>
                      <input
                        required
                        type="number"
                        min="2020"
                        max="2100"
                        className="w-full h-14 p-4 bg-gray-50 rounded-2xl outline-none text-base"
                        value={form.intake_year || ""}
                        onChange={(e) =>
                          setForm({ ...form, intake_year: e.target.value })
                        }
                      />
                    </div>

                    <div className="col-span-full pt-6">
                      <button
                        type="button"
                        onClick={handleStep1Next}
                        className="w-full h-16 bg-[#0a6e4e] text-white rounded-[25px] font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
                      >
                        Next: Satisfaction & Support →
                      </button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-10 animate-in fade-in slide-in-from-right-4">
                    <div className="text-center space-y-4">
                      <h4 className="text-sm font-black uppercase tracking-widest text-gray-400">
                        Are you satisfied with your current course?
                      </h4>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <button
                          type="button"
                          onClick={() =>
                            setForm({ ...form, is_satisfied: true })
                          }
                          className={`w-full py-8 md:py-10 rounded-[30px] md:rounded-[35px] border-2 transition-all flex flex-col items-center gap-3 ${form.is_satisfied === true ? "border-[#0a6e4e] bg-[#0a6e4e]/5 text-[#0a6e4e]" : "border-gray-100 text-gray-300"}`}
                        >
                          <span className="text-5xl md:text-6xl">😊</span>
                          <span className="font-black uppercase tracking-widest text-[10px] md:text-xs">
                            Yes, I am Happy
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setForm({ ...form, is_satisfied: false })
                          }
                          className={`w-full py-8 md:py-10 rounded-[30px] md:rounded-[35px] border-2 transition-all flex flex-col items-center gap-3 ${form.is_satisfied === false ? "border-red-500 bg-red-50 text-red-600" : "border-gray-100 text-gray-300"}`}
                        >
                          <span className="text-5xl md:text-6xl">☹️</span>
                          <span className="font-black uppercase tracking-widest text-[10px] md:text-xs">
                            No, Not Satisfied
                          </span>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-sm font-black uppercase tracking-widest text-gray-400">
                        Who chose this course for you?
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {[
                          "Self",
                          "Parent/Guardian",
                          "Teacher",
                          "Peer/Friend",
                          "Grade Placement",
                        ].map((inf) => (
                          <label
                            key={inf}
                            className={`h-14 px-5 rounded-2xl border-2 text-sm font-bold transition-all cursor-pointer flex items-center gap-3 ${form.influencer === inf ? "border-[#0a6e4e] bg-[#0a6e4e]/5 text-[#0a6e4e]" : "border-gray-100 text-gray-400"}`}
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
                        ))}
                      </div>
                    </div>

                    {!form.is_satisfied && (
                      <div className="space-y-6 animate-in slide-in-from-top-4 p-6 bg-red-50 rounded-[25px] border-2 border-red-100">
                        <div className="space-y-2">
                          <label className="text-sm font-black uppercase tracking-widest text-red-600 ml-2">
                            Reason for dissatisfaction
                          </label>
                          <textarea
                            required
                            className="w-full p-4 bg-white rounded-[20px] outline-none border-2 border-red-200 focus:border-red-400 transition-all min-h-[100px] text-base"
                            placeholder="Tell us what is wrong..."
                            value={form.reason_text}
                            onChange={(e) =>
                              setForm({ ...form, reason_text: e.target.value })
                            }
                          />
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white rounded-[20px]">
                          <span className="font-bold text-gray-600 text-sm">
                            Willing to change course?
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
                        {form.willing_to_change && (
                          <div className="space-y-2 animate-in slide-in-from-top-2">
                            <label className="text-sm font-black uppercase tracking-widest text-red-600 ml-2">
                              What course would you prefer?
                            </label>
                            <input
                              required
                              className="w-full h-14 p-4 bg-white rounded-[20px] outline-none border-2 border-red-200 focus:border-red-400 transition-all text-base"
                              placeholder="e.g. Electrical Engineering"
                              value={form.preferred_course || ""}
                              onChange={(e) =>
                                setForm({
                                  ...form,
                                  preferred_course: e.target.value,
                                })
                              }
                            />
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4 pt-6">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="h-16 px-8 bg-gray-100 text-gray-500 rounded-[25px] font-black uppercase text-xs hover:bg-gray-200 transition-all"
                      >
                        ← Back
                      </button>
                      <button
                        type="button"
                        onClick={handleStep2Next}
                        className="flex-1 h-16 bg-[#0a6e4e] text-white rounded-[25px] font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
                      >
                        Next: Program Structure →
                      </button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-10 animate-in fade-in slide-in-from-right-4">
                    <div className="bg-[#0a6e4e]/5 border-2 border-[#0a6e4e]/10 rounded-[25px] p-6 md:p-8">
                      <h4 className="text-lg md:text-xl font-black text-[#0a6e4e] mb-2 tracking-tight">
                        Course Structure Assessment
                      </h4>
                      <p className="text-sm text-gray-600 font-medium">
                        Help us understand how your course is organized and
                        delivered.
                      </p>
                    </div>

                    {/* Practical vs Theory Ratio */}
                    <div className="space-y-4">
                      <label className="text-sm font-black uppercase tracking-widest text-gray-600 ml-2">
                        Practical vs Theory Balance
                      </label>
                      <div className="grid grid-cols-2 gap-3 md:gap-4">
                        {[
                          "Perfect Balance (70/30)",
                          "More Theory Needed",
                          "More Practical Needed",
                          "Way Too Theoretical",
                        ].map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() =>
                              setForm({
                                ...form,
                                practical_theory_ratio: option,
                              })
                            }
                            className={`py-5 md:py-6 px-4 md:px-6 rounded-[20px] text-sm md:text-base font-black uppercase tracking-widest transition-all ${
                              form.practical_theory_ratio === option
                                ? "bg-[#0a6e4e] text-white shadow-lg scale-105"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-150"
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Workshop Equipment Status */}
                    <div className="space-y-4">
                      <label className="text-sm font-black uppercase tracking-widest text-gray-600 ml-2">
                        Workshop & Equipment Status
                      </label>
                      <div className="grid grid-cols-2 gap-3 md:gap-4">
                        {[
                          "Sufficient & Modern",
                          "Outdated But Functional",
                          "Severely Deficient / Broken",
                          "No Workshop Access",
                        ].map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() =>
                              setForm({
                                ...form,
                                workshop_equipment_status: option,
                              })
                            }
                            className={`py-5 md:py-6 px-4 md:px-6 rounded-[20px] text-sm md:text-base font-black uppercase tracking-widest transition-all ${
                              form.workshop_equipment_status === option
                                ? option.includes("Deficient")
                                  ? "bg-red-500 text-white shadow-lg scale-105"
                                  : "bg-[#0a6e4e] text-white shadow-lg scale-105"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-150"
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Attachment Confidence */}
                    <div className="space-y-4">
                      <label className="text-sm font-black uppercase tracking-widest text-gray-600 ml-2">
                        Confidence for Attachment/Internship (1-5 Scale)
                      </label>
                      <div className="flex justify-between items-center gap-3 md:gap-4">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() =>
                              setForm({
                                ...form,
                                attachment_confidence: num,
                              })
                            }
                            className={`w-full h-16 md:h-20 rounded-[20px] font-black text-xl md:text-2xl transition-all ${
                              form.attachment_confidence === num
                                ? "bg-[#0a6e4e] text-white shadow-lg scale-110"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-150"
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                      <div className="text-center text-xs md:text-sm text-gray-500 font-bold mt-2">
                        {form.attachment_confidence === 1 && "Very Uncertain"}
                        {form.attachment_confidence === 2 &&
                          "Somewhat Uncertain"}
                        {form.attachment_confidence === 3 && "Neutral"}
                        {form.attachment_confidence === 4 && "Mostly Confident"}
                        {form.attachment_confidence === 5 && "Very Confident"}
                      </div>
                    </div>

                    {/* Learning Materials */}
                    <div className="space-y-4">
                      <label className="text-sm font-black uppercase tracking-widest text-gray-600 ml-2">
                        Access to Learning Materials
                      </label>
                      <div className="flex gap-4">
                        <button
                          type="button"
                          onClick={() =>
                            setForm({
                              ...form,
                              learning_materials_access: true,
                            })
                          }
                          className={`flex-1 py-5 md:py-6 rounded-[20px] font-black uppercase text-xs md:text-sm tracking-widest transition-all ${
                            form.learning_materials_access === true
                              ? "bg-green-500 text-white shadow-lg scale-105"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          ✓ Readily Available
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setForm({
                              ...form,
                              learning_materials_access: false,
                            })
                          }
                          className={`flex-1 py-5 md:py-6 rounded-[20px] font-black uppercase text-xs md:text-sm tracking-widest transition-all ${
                            form.learning_materials_access === false
                              ? "bg-red-500 text-white shadow-lg scale-105"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          ✗ Limited Access
                        </button>
                      </div>
                    </div>

                    {/* Curriculum Pace */}
                    <div className="space-y-4">
                      <label className="text-sm font-black uppercase tracking-widest text-gray-600 ml-2">
                        Curriculum Pace
                      </label>
                      <div className="grid grid-cols-2 gap-3 md:gap-4">
                        {[
                          "Optimal Pace",
                          "Too Fast",
                          "Too Slow",
                          "Inconsistent",
                        ].map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() =>
                              setForm({
                                ...form,
                                curriculum_pace: option,
                              })
                            }
                            className={`py-5 md:py-6 px-4 md:px-6 rounded-[20px] text-sm md:text-base font-black uppercase tracking-widest transition-all ${
                              form.curriculum_pace === option
                                ? "bg-[#0a6e4e] text-white shadow-lg scale-105"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-150"
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Primary Academic Roadblock */}
                    <div className="space-y-4">
                      <label className="text-sm font-black uppercase tracking-widest text-gray-600 ml-2">
                        Primary Academic Challenge
                      </label>
                      <div className="grid grid-cols-1 gap-3 md:gap-4">
                        {[
                          "None",
                          "Lack of Practicals",
                          "Lack of Workshop Time",
                          "Poor Lab Facilities",
                          "Insufficient Instructors",
                          "Course Content Mismatch",
                        ].map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() =>
                              setForm({
                                ...form,
                                primary_academic_roadblock: option,
                              })
                            }
                            className={`py-4 md:py-5 px-4 md:px-6 rounded-[20px] text-sm md:text-base font-black uppercase tracking-widest transition-all text-left ${
                              form.primary_academic_roadblock === option
                                ? "bg-[#0a6e4e] text-white shadow-lg scale-[1.02]"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-150"
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t-2 border-gray-100">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="h-16 px-8 bg-gray-100 text-gray-500 rounded-[25px] font-black uppercase text-xs hover:bg-gray-200 transition-all"
                      >
                        ← Back
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 h-16 bg-gray-900 text-white rounded-[25px] font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submitting
                          ? "⏳ Transmitting Survey..."
                          : "✓ Submit Confidential Survey"}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
