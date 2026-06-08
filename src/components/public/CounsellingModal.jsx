import { useState, useEffect } from "react";
import api from "../../api";

export default function CounsellingModal({
  isOpen,
  onClose,
  onSuccess,
  initialValues = {},
}) {
  const [departments, setDepartments] = useState([]);
  const [loadingDepts, setLoadingDepts] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    full_name: "",
    admission_number: "",
    phone: "",
    department_id: "",
    reason: "",
  });

  useEffect(() => {
    if (!isOpen) return;

    const controller = new AbortController();

    // Reset states upon entry
    queueMicrotask(() => {
      setSuccess(false);
      setError("");
      setLoadingDepts(true);
      setForm({
        full_name: initialValues.full_name || "",
        admission_number: initialValues.admission_number || "",
        phone: initialValues.phone || "",
        department_id: initialValues.department_id || "",
        reason: initialValues.reason || "",
      });
    });

    api
      .get("/public/departments", { signal: controller.signal })
      .then((res) => setDepartments(res.data.data || res.data))
      .catch((err) => {
        if (!controller.signal.aborted) {
          console.error("Failed to load departments:", err);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoadingDepts(false);
        }
      });

    return () => controller.abort();
  }, [isOpen]); // Only re-run when modal opens or closes

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await api.post("/public/counselling", form);
      setSuccess(true);
      if (onSuccess) onSuccess();
    } catch {
      setError("Submission failed. Ensure your Admission Number is valid.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4 transition-all duration-300">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden relative max-h-[calc(100vh-2rem)] flex flex-col transform">
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close modal"
          className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-red-50 hover:border-red-100 hover:text-red-500 active:scale-95 transition-all z-10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="overflow-y-auto w-full">
          {success ? (
            <div className="p-8 sm:p-16 text-center flex flex-col items-center justify-center min-h-[350px]">
              <div className="w-20 h-20 bg-emerald-600 text-white rounded-full flex items-center justify-center text-4xl mb-6 shadow-xl shadow-emerald-600/20 animate-fade-in">
                🕊️
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 tracking-tight">
                Request Received
              </h2>
              <p className="text-slate-500 text-base max-w-md mx-auto mb-8 leading-relaxed">
                Your request has been securely logged. A counsellor will reach
                out to you privately very soon. You are not alone.
              </p>
              <button
                onClick={onClose}
                className="bg-slate-900 text-white px-8 py-3.5 rounded-xl font-semibold text-sm tracking-wider hover:bg-slate-800 active:scale-98 transition-all shadow-lg shadow-slate-900/10"
              >
                Done
              </button>
            </div>
          ) : (
            <div className="p-6 sm:p-10">
              <div className="text-center mb-8 pr-8 pl-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1.5 tracking-tight">
                  Private Support Request
                </h2>
                <p className="text-emerald-700 font-semibold tracking-wider uppercase text-xs">
                  Confidential Counselling Services
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-center font-medium text-sm animate-shake">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 ml-1">
                      Full Name
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Your Name"
                      className="w-full px-4 py-3 bg-slate-50/60 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-600/5 transition-all text-slate-800 placeholder-slate-400"
                      value={form.full_name}
                      onChange={(e) =>
                        setForm({ ...form, full_name: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 ml-1">
                      Admission Number
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="MG..."
                      className="w-full px-4 py-3 bg-slate-50/60 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-600/5 transition-all font-mono uppercase text-slate-800 placeholder-slate-400"
                      value={form.admission_number}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          admission_number: e.target.value.toUpperCase(),
                        })
                      }
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 ml-1">
                      Phone Number
                    </label>
                    <input
                      required
                      type="tel"
                      placeholder="07..."
                      className="w-full px-4 py-3 bg-slate-50/60 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-600/5 transition-all text-slate-800 placeholder-slate-400"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 ml-1">
                      Department
                    </label>
                    <div className="relative">
                      <select
                        required
                        className="w-full px-4 py-3 bg-slate-50/60 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-600/5 transition-all text-slate-800 appearance-none"
                        value={form.department_id}
                        onChange={(e) =>
                          setForm({ ...form, department_id: e.target.value })
                        }
                        disabled={loadingDepts}
                      >
                        <option value="" disabled className="text-slate-400">
                          {loadingDepts
                            ? "Loading departments..."
                            : "Select Department..."}
                        </option>
                        {departments.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                        <svg
                          className="fill-current h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 ml-1">
                    Reason for Counselling (Optional)
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-50/60 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-600/5 transition-all text-slate-800 placeholder-slate-400 resize-none min-h-[100px]"
                    placeholder="Briefly describe what's on your mind..."
                    value={form.reason}
                    onChange={(e) =>
                      setForm({ ...form, reason: e.target.value })
                    }
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto sm:float-right px-8 py-4 bg-emerald-700 text-white rounded-xl font-semibold text-sm tracking-wide shadow-xl shadow-emerald-700/10 hover:bg-emerald-800 active:scale-98 disabled:opacity-50 disabled:pointer-events-none transition-all mt-2"
                >
                  {submitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Sending Securely...
                    </div>
                  ) : (
                    "Submit Private Request"
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
