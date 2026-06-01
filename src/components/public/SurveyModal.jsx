import { useState, useEffect } from "react";
import api from "../../api";

export default function SurveyModal({
  isOpen,
  onClose,
  studentData,
  existingSurvey,
}) {
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
    practical_theory_ratio: "Perfect Balance (70/30)",
    workshop_equipment_status: "Sufficient & Modern",
    learning_materials_access: true,
    curriculum_pace: "Optimal Pace",
    attachment_confidence: 5,
    primary_academic_roadblock: "None",
  });

  // Reset form when modal opens or closes
  useEffect(() => {
    if (!isOpen) return;

    queueMicrotask(() => {
      setStep(1);
      setIsSubmitted(false);
      setCredentials(null);
      setError("");

      const initialForm = {
        admission_number: studentData?.id || "",
        full_name: studentData?.name || "",
        phone: studentData?.phone || "",
        national_id_or_birth_cert: studentData?.national_id_or_birth_cert || "",
        gender: studentData?.gender || "Male",
        age: studentData?.age || "",
        dob: studentData?.dob || "",
        location: studentData?.county || "",
        home_address: studentData?.home_address || "",
        residence: studentData?.residence || "Day Scholar",
        funding: studentData?.funding || "Self-paying",
        department_id: studentData?.course?.department_id || "",
        course_id: studentData?.course_id || "",
        intake_year: studentData?.intake_year || new Date().getFullYear(),
        is_satisfied: existingSurvey
          ? existingSurvey.satisfaction_rating === "Happy"
          : true,
        influencer: existingSurvey?.influencer || "Self",
        reason_text: existingSurvey?.reason_text || "",
        preferred_course: existingSurvey?.preferred_course || "",
        willing_to_change: existingSurvey?.preferred_course ? true : false,
        retention_intent: existingSurvey?.retention_intent || "Yes",
        practical_theory_ratio:
          existingSurvey?.practical_theory_ratio || "Perfect Balance (70/30)",
        workshop_equipment_status:
          existingSurvey?.workshop_equipment_status || "Sufficient & Modern",
        learning_materials_access:
          existingSurvey?.learning_materials_access ?? true,
        curriculum_pace: existingSurvey?.curriculum_pace || "Optimal Pace",
        attachment_confidence: existingSurvey?.attachment_confidence || 5,
        primary_academic_roadblock:
          existingSurvey?.primary_academic_roadblock || "None",
      };
      setForm(initialForm);
    });

    api
      .get("/public/departments")
      .then((res) => setDepartments(res.data.data || res.data))
      .catch((err) => console.error("Error fetching departments:", err));
  }, [isOpen, studentData, existingSurvey]);

  // Handle department course sync
  useEffect(() => {
    if (form.department_id) {
      api
        .get(`/public/courses?department_id=${form.department_id}`)
        .then((res) => setCourses(res.data.data || res.data))
        .catch((err) => console.error("Error fetching courses:", err));
    } else {
      queueMicrotask(() => setCourses([]));
    }
  }, [form.department_id]);

  // AUTOMATIC AGE CALCULATION LOGIC BASED ON DOB
  useEffect(() => {
    if (!form.dob) {
      queueMicrotask(() => setForm((prev) => ({ ...prev, age: "" })));
      return;
    }

    const birthDate = new Date(form.dob);
    const today = new Date();

    if (isNaN(birthDate.getTime())) return;

    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      calculatedAge--;
    }

    queueMicrotask(() =>
      setForm((prev) => ({
        ...prev,
        age: calculatedAge >= 0 ? calculatedAge.toString() : "0",
      })),
    );
  }, [form.dob]);

  const isValidPhone = (value) => /^(?:07|01)\d{8}$/.test(value.trim());
  const isValidNationalIdOrBirthCert = (value) =>
    !value || /^\d{8}$/.test(value.trim());
  const isAtLeastFifteenYearsOld = (dob) => {
    if (!dob) return false;
    const birthDate = new Date(dob);
    if (isNaN(birthDate.getTime())) return false;
    const today = new Date();
    const threshold = new Date(
      today.getFullYear() - 15,
      today.getMonth(),
      today.getDate(),
    );
    return birthDate <= threshold;
  };

  const handleStep1Next = () => {
    if (
      !form.admission_number ||
      !form.full_name ||
      !form.phone ||
      !form.dob ||
      !form.age ||
      !form.location ||
      !form.home_address ||
      !form.department_id ||
      !form.course_id
    ) {
      setError("Please complete all required fields in Step 1.");
      setTimeout(() => setError(""), 4000);
      return;
    }

    if (!isValidPhone(form.phone)) {
      setError(
        "Phone number must be 10 digits and start with 07 or 01 (e.g. 0700000000 or 0111111111).",
      );
      setTimeout(() => setError(""), 4000);
      return;
    }

    if (!isValidNationalIdOrBirthCert(form.national_id_or_birth_cert)) {
      setError("National ID / Birth Cert must be exactly 8 digits.");
      setTimeout(() => setError(""), 4000);
      return;
    }

    if (!isAtLeastFifteenYearsOld(form.dob)) {
      setError("Date of birth must be at least 15 years ago.");
      setTimeout(() => setError(""), 4000);
      return;
    }

    setStep(2);
  };

  const handleStep2Next = () => {
    if (
      !form.is_satisfied &&
      form.willing_to_change &&
      !form.preferred_course
    ) {
      setError("Please state your preferred alternative course.");
      setTimeout(() => setError(""), 4000);
      return;
    }
    if (!form.is_satisfied && !form.reason_text) {
      setError("Please provide a reason for your dissatisfaction.");
      setTimeout(() => setError(""), 4000);
      return;
    }
    setStep(3);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const payload = {
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
        practical_theory_ratio: form.practical_theory_ratio,
        workshop_equipment_status: form.workshop_equipment_status,
        learning_materials_access: form.learning_materials_access,
        curriculum_pace: form.curriculum_pace,
        attachment_confidence: Number(form.attachment_confidence),
        primary_academic_roadblock: form.primary_academic_roadblock,
      };

      const response = await api.post("/public/survey", payload);
      setCredentials(response.data?.credentials ?? null);
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
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden relative flex flex-col md:flex-row my-auto max-h-[95vh] md:max-h-[85vh]">
        {/* Close Button Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-xl text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all z-50 shadow-sm"
        >
          ×
        </button>

        {isSubmitted ? (
          /* SUCCESS STATE PANEL */
          <div className="w-full p-8 md:p-16 text-center flex flex-col items-center justify-center bg-gradient-to-b from-emerald-50/50 to-white overflow-y-auto">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-4xl mb-6 shadow-md animate-pulse">
              ✓
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">
              Thank You for Your Feedback
            </h2>
            <p className="text-slate-600 text-base mb-6 max-w-md leading-relaxed font-medium">
              Thank you for your confidential feedback. Your response has been
              safely recorded departmentally.
            </p>

            {credentials && (
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 mb-6 w-full max-w-md text-left shadow-inner">
                <p className="text-xs text-slate-500 mb-3 font-semibold uppercase tracking-wider">
                  System Generated Access Credentials:
                </p>
                <div className="space-y-1.5 font-mono text-sm text-slate-800">
                  <p>
                    <span className="font-sans font-bold text-slate-500">
                      Admission No:
                    </span>{" "}
                    {credentials.admission_number}
                  </p>
                  <p>
                    <span className="font-sans font-bold text-slate-500">
                      Default Password:
                    </span>{" "}
                    {credentials.password}
                  </p>
                </div>
                <p className="text-xs text-amber-600 mt-3 bg-amber-50 p-2 rounded-lg border border-amber-100 font-medium">
                  💡 Log in using these credentials to access your student
                  terminal.
                </p>
              </div>
            )}

            <button
              onClick={onClose}
              className="bg-[#0a6e4e] text-white px-10 py-3.5 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-[#085a40] transition-colors shadow-lg shadow-emerald-900/10"
            >
              Close Survey Terminal
            </button>
          </div>
        ) : (
          /* ACTIVE FORM ELEMENT VIEW */
          <>
            {/* Sidebar Branding and Stepper */}
            <div className="w-full md:w-1/3 bg-[#0a6e4e] p-8 md:p-10 text-white flex flex-col justify-between shrink-0 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-10 -translate-y-10 pointer-events-none" />
              <div className="relative z-10">
                <div className="text-xl font-black tracking-tighter italic mb-1">
                  MAGO TVTC
                </div>
                <div className="text-[9px] font-bold opacity-60 uppercase tracking-[0.2em] mb-8 md:mb-14">
                  Quality Assurance Unit
                </div>

                <h3 className="text-2xl md:text-3xl font-black leading-tight mb-4 tracking-tight">
                  Course Satisfaction Survey
                </h3>
                <p className="opacity-75 text-xs leading-relaxed mb-8 font-medium">
                  Your voice matters. Honest feedback assists administration in
                  streamlining resource delivery.
                </p>

                {/* Progress Indicators */}
                <div className="space-y-4 md:space-y-5 hidden sm:block">
                  {[
                    { idx: 1, label: "Personal Info" },
                    { idx: 2, label: "Satisfaction & Support" },
                    { idx: 3, label: "Program Structure" },
                  ].map((stepItem) => (
                    <div
                      key={stepItem.idx}
                      className={`flex items-center gap-3.5 transition-all duration-300 ${
                        step === stepItem.idx
                          ? "translate-x-2 font-bold"
                          : "opacity-40"
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-[11px] font-black transition-colors ${
                          step >= stepItem.idx
                            ? "bg-white text-[#0a6e4e]"
                            : "border-white/40 text-white"
                        }`}
                      >
                        {stepItem.idx}
                      </div>
                      <div className="text-[10px] font-bold uppercase tracking-widest">
                        {stepItem.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-[9px] font-semibold opacity-40 uppercase tracking-widest pt-8 border-t border-white/10 mt-6 sm:mt-0">
                Terminal Session &copy; 2026
              </div>
            </div>

            {/* Core Scrollable Questionnaire Space */}
            <div className="flex-1 p-6 md:p-10 overflow-y-auto bg-slate-50/50 flex flex-col justify-between">
              <div>
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-900">
                    <span className="text-lg">⚠️</span>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-red-700">
                        Missing Information
                      </h4>
                      <p className="text-sm font-medium mt-0.5">{error}</p>
                    </div>
                  </div>
                )}

                <form
                  onSubmit={handleSubmit}
                  className="space-y-5 md:space-y-6"
                >
                  {/* STEP 1: PERSONAL INFORMATION */}
                  {step === 1 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block ml-1">
                          Admission Number *
                        </label>
                        <input
                          required
                          type="text"
                          placeholder="e.g. MG2024001"
                          className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#0a6e4e] focus:ring-2 focus:ring-[#0a6e4e]/10 transition-all font-mono text-sm"
                          value={form.admission_number || ""}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              admission_number: e.target.value.toUpperCase(),
                            })
                          }
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block ml-1">
                          Full Name *
                        </label>
                        <input
                          required
                          type="text"
                          placeholder="Legal Profile Name"
                          className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#0a6e4e] focus:ring-2 focus:ring-[#0a6e4e]/10 transition-all text-sm"
                          value={form.full_name || ""}
                          onChange={(e) =>
                            setForm({ ...form, full_name: e.target.value })
                          }
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block ml-1">
                          Phone Number *
                        </label>
                        <input
                          required
                          type="tel"
                          placeholder="e.g. 0712345678"
                          className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#0a6e4e] focus:ring-2 focus:ring-[#0a6e4e]/10 transition-all text-sm"
                          value={form.phone || ""}
                          onChange={(e) =>
                            setForm({ ...form, phone: e.target.value })
                          }
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block ml-1">
                          National ID / Birth Cert (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="Identification Reference"
                          className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#0a6e4e] focus:ring-2 focus:ring-[#0a6e4e]/10 transition-all text-sm"
                          value={form.national_id_or_birth_cert || ""}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              national_id_or_birth_cert: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block ml-1">
                          Gender *
                        </label>
                        <select
                          className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#0a6e4e] text-sm"
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

                      {/* DATE OF BIRTH FIRST */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block ml-1">
                          Date of Birth *
                        </label>
                        <input
                          required
                          type="date"
                          className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#0a6e4e] focus:ring-2 focus:ring-[#0a6e4e]/10 transition-all text-sm"
                          value={form.dob || ""}
                          onChange={(e) =>
                            setForm({ ...form, dob: e.target.value })
                          }
                        />
                      </div>

                      {/* AGE CALCULATED BY SYSTEM AUTOMATICALLY */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block ml-1">
                          Age (Auto-Calculated)
                        </label>
                        <input
                          readOnly
                          type="text"
                          placeholder="Calculates from DOB"
                          className="w-full h-11 px-4 bg-slate-100 border border-slate-200 rounded-xl outline-none text-slate-600 font-bold text-sm cursor-not-allowed"
                          value={form.age ? `${form.age} Years Old` : ""}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block ml-1">
                          County / Location *
                        </label>
                        <input
                          required
                          type="text"
                          placeholder="e.g. Vihiga"
                          className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#0a6e4e] focus:ring-2 focus:ring-[#0a6e4e]/10 transition-all text-sm"
                          value={form.location || ""}
                          onChange={(e) =>
                            setForm({ ...form, location: e.target.value })
                          }
                        />
                      </div>

                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block ml-1">
                          Home Address *
                        </label>
                        <input
                          required
                          type="text"
                          placeholder="Detailed Residential Address / Village / Town"
                          className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#0a6e4e] focus:ring-2 focus:ring-[#0a6e4e]/10 transition-all text-sm"
                          value={form.home_address || ""}
                          onChange={(e) =>
                            setForm({ ...form, home_address: e.target.value })
                          }
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block ml-1">
                          Residence *
                        </label>
                        <select
                          className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#0a6e4e] text-sm"
                          value={form.residence}
                          onChange={(e) =>
                            setForm({ ...form, residence: e.target.value })
                          }
                        >
                          <option value="Day Scholar">Day Scholar</option>
                          <option value="Boarder">Boarder</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block ml-1">
                          Funding Source *
                        </label>
                        <select
                          className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#0a6e4e] text-sm"
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

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block ml-1">
                          Department *
                        </label>
                        <select
                          required
                          className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#0a6e4e] text-sm"
                          value={form.department_id || ""}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              department_id: e.target.value,
                              course_id: "",
                            })
                          }
                        >
                          <option value="">Select Department...</option>
                          {departments.map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block ml-1">
                          Course Enrolled *
                        </label>
                        <select
                          required
                          className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#0a6e4e] text-sm disabled:bg-slate-100 disabled:text-slate-400"
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

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block ml-1">
                          Intake Year *
                        </label>
                        <input
                          required
                          type="number"
                          min="2020"
                          max="2100"
                          className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#0a6e4e] focus:ring-2 focus:ring-[#0a6e4e]/10 transition-all text-sm"
                          value={form.intake_year || ""}
                          onChange={(e) =>
                            setForm({ ...form, intake_year: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  )}

                  {/* STEP 2: SATISFACTION & SUPPORT */}
                  {step === 2 && (
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block text-center mb-1">
                          Are you satisfied with your current course?
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                          <button
                            type="button"
                            onClick={() =>
                              setForm({ ...form, is_satisfied: true })
                            }
                            className={`p-5 rounded-2xl border-2 text-center transition-all flex flex-col items-center gap-2 ${
                              form.is_satisfied === true
                                ? "border-[#0a6e4e] bg-[#0a6e4e]/5 text-[#0a6e4e]"
                                : "border-slate-200 bg-white text-slate-400 hover:border-slate-300"
                            }`}
                          >
                            <span className="text-3xl">😊</span>
                            <span className="font-bold uppercase tracking-wider text-[10px]">
                              Yes, I am Happy
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setForm({ ...form, is_satisfied: false })
                            }
                            className={`p-5 rounded-2xl border-2 text-center transition-all flex flex-col items-center gap-2 ${
                              form.is_satisfied === false
                                ? "border-red-500 bg-red-50 text-red-600"
                                : "border-slate-200 bg-white text-slate-400 hover:border-slate-300"
                            }`}
                          >
                            <span className="text-3xl">☹️</span>
                            <span className="font-bold uppercase tracking-wider text-[10px]">
                              No, Dissatisfied
                            </span>
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block ml-1">
                          Who chose this course for you?
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {[
                            "Self",
                            "Parent/Guardian",
                            "Teacher",
                            "Peer/Friend",
                            "Grade Placement",
                          ].map((inf) => (
                            <label
                              key={inf}
                              className={`h-11 px-4 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex items-center gap-2.5 ${
                                form.influencer === inf
                                  ? "border-[#0a6e4e] bg-[#0a6e4e]/5 text-[#0a6e4e]"
                                  : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                              }`}
                            >
                              <input
                                type="radio"
                                className="hidden"
                                name="influencer"
                                value={inf}
                                checked={form.influencer === inf}
                                onChange={(e) =>
                                  setForm({
                                    ...form,
                                    influencer: e.target.value,
                                  })
                                }
                              />
                              <div
                                className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                                  form.influencer === inf
                                    ? "border-[#0a6e4e]"
                                    : "border-slate-300"
                                }`}
                              >
                                {form.influencer === inf && (
                                  <div className="w-2 h-2 rounded-full bg-[#0a6e4e]" />
                                )}
                              </div>
                              {inf}
                            </label>
                          ))}
                        </div>
                      </div>

                      {!form.is_satisfied && (
                        <div className="space-y-4 p-4 bg-red-50 border border-red-100 rounded-2xl">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-red-700 block ml-1">
                              Reason for dissatisfaction *
                            </label>
                            <textarea
                              required={!form.is_satisfied}
                              rows={3}
                              className="w-full p-3 bg-white rounded-xl outline-none border border-red-200 focus:border-red-400 text-sm"
                              placeholder="Tell us what bottlenecks or resource gaps you have encountered..."
                              value={form.reason_text}
                              onChange={(e) =>
                                setForm({
                                  ...form,
                                  reason_text: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="flex items-center justify-between gap-4 p-3 bg-white rounded-xl border border-red-100/50">
                            <span className="font-semibold text-slate-700 text-xs">
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
                              className={`w-12 h-6 rounded-full relative transition-colors ${
                                form.willing_to_change
                                  ? "bg-[#0a6e4e]"
                                  : "bg-slate-300"
                              }`}
                            >
                              <div
                                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
                                  form.willing_to_change ? "left-6" : "left-1"
                                }`}
                              />
                            </button>
                          </div>

                          {form.willing_to_change && (
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold uppercase tracking-wider text-red-700 block ml-1">
                                What course would you prefer? *
                              </label>
                              <input
                                required={form.willing_to_change}
                                type="text"
                                className="w-full h-11 px-4 bg-white rounded-xl outline-none border border-red-200 focus:border-red-400 text-sm"
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
                    </div>
                  )}

                  {/* STEP 3: CURRICULUM & PROGRAM STRUCTURE */}
                  {step === 3 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block ml-1">
                          Practical to Theory Ratio
                        </label>
                        <select
                          className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#0a6e4e] text-sm"
                          value={form.practical_theory_ratio}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              practical_theory_ratio: e.target.value,
                            })
                          }
                        >
                          <option>Perfect Balance (70/30)</option>
                          <option>Too Much Theory</option>
                          <option>Insufficient Practical Sessions</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block ml-1">
                          Workshop Equipment Status
                        </label>
                        <select
                          className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#0a6e4e] text-sm"
                          value={form.workshop_equipment_status}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              workshop_equipment_status: e.target.value,
                            })
                          }
                        >
                          <option>Sufficient & Modern</option>
                          <option>Outdated Infrastructure</option>
                          <option>Congested / Missing Tools</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block ml-1">
                          Curriculum Pace
                        </label>
                        <select
                          className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#0a6e4e] text-sm"
                          value={form.curriculum_pace}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              curriculum_pace: e.target.value,
                            })
                          }
                        >
                          <option>Optimal Pace</option>
                          <option>Too Fast / Overwhelming</option>
                          <option>Delayed / Slow Term Coverage</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block ml-1">
                          Primary Academic Roadblock
                        </label>
                        <select
                          className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#0a6e4e] text-sm"
                          value={form.primary_academic_roadblock}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              primary_academic_roadblock: e.target.value,
                            })
                          }
                        >
                          <option>None</option>
                          <option>Financial Strain</option>
                          <option>Instructor Absenteeism</option>
                          <option>Language Barrier</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block ml-1">
                          Attachment Readiness Confidence (1-10)
                        </label>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          className="w-full h-11 accent-[#0a6e4e]"
                          value={form.attachment_confidence}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              attachment_confidence: e.target.value,
                            })
                          }
                        />
                        <span className="text-xs font-bold text-slate-600 block text-right mt-1">
                          Level: {form.attachment_confidence} / 10
                        </span>
                      </div>

                      <div className="space-y-1.5 flex flex-col justify-center">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block ml-1 mb-1">
                          Learning Material Access
                        </label>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                            <input
                              type="radio"
                              name="materials"
                              className="accent-[#0a6e4e]"
                              checked={form.learning_materials_access === true}
                              onChange={() =>
                                setForm({
                                  ...form,
                                  learning_materials_access: true,
                                })
                              }
                            />
                            Unrestricted Access
                          </label>
                          <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                            <input
                              type="radio"
                              name="materials"
                              className="accent-[#0a6e4e]"
                              checked={form.learning_materials_access === false}
                              onChange={() =>
                                setForm({
                                  ...form,
                                  learning_materials_access: false,
                                })
                              }
                            />
                            Limited Access
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </form>
              </div>

              {/* FOOTER CONTROL BUTTON ACTIONS */}
              <div className="flex gap-3 pt-6 border-t border-slate-100 mt-6 bg-white">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep((p) => p - 1)}
                    className="h-11 px-6 bg-slate-100 text-slate-600 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-slate-200 transition-colors"
                  >
                    Back
                  </button>
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={step === 1 ? handleStep1Next : handleStep2Next}
                    className="flex-1 h-11 bg-[#0a6e4e] text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#085a40] transition-colors shadow-lg shadow-emerald-950/10"
                  >
                    Continue &rarr;
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex-1 h-11 bg-[#0a6e4e] text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#085a40] transition-colors shadow-lg shadow-emerald-950/10 disabled:bg-slate-300 disabled:cursor-not-allowed"
                  >
                    {submitting
                      ? "Submitting Ledger Data..."
                      : "Complete & Submit Survey"}
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
