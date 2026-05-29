import React, { useState, useEffect } from "react";
import api from "../../api";

export default function CounsellingModal({
  isOpen,
  onClose,
  initialValues = {},
}) {
  const [departments, setDepartments] = useState([]);
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
    if (isOpen) {
      api
        .get("/public/departments")
        .then((res) => setDepartments(res.data.data || res.data));
      setForm((current) => ({
        ...current,
        full_name: initialValues.full_name || current.full_name,
        admission_number:
          initialValues.admission_number || current.admission_number,
        phone: initialValues.phone || current.phone,
      }));
      setSuccess(false);
      setError("");
    }
  }, [isOpen, initialValues]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await api.post("/public/counselling", form);
      setSuccess(true);
    } catch (err) {
      setError("Submission failed. Ensure your Admission Number is valid.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-[50px] shadow-2xl overflow-hidden relative animate-in slide-in-from-bottom-8 duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-8 right-8 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all z-10"
        >
          ×
        </button>

        {success ? (
          <div className="p-20 text-center flex flex-col items-center">
            <div className="w-24 h-24 bg-[#0a6e4e] text-white rounded-full flex items-center justify-center text-5xl mb-8 animate-bounce">
              🕊️
            </div>
            <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter">
              Request Received
            </h2>
            <p className="text-gray-500 text-lg mb-10 leading-relaxed">
              Your request has been securely logged. A counsellor will reach out
              to you privately very soon. You are not alone.
            </p>
            <button
              onClick={onClose}
              className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-black uppercase text-sm tracking-widest hover:scale-105 transition-all"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="p-12">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-gray-900 mb-2 italic tracking-tighter">
                Private Support Request
              </h2>
              <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">
                Confidential Counselling Services
              </p>
            </div>

            {error && (
              <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-center font-bold text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">
                    Full Name
                  </label>
                  <input
                    required
                    placeholder="Your Name"
                    className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-4 focus:ring-[#0a6e4e]/5 transition-all"
                    value={form.full_name}
                    onChange={(e) =>
                      setForm({ ...form, full_name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">
                    Admission Number
                  </label>
                  <input
                    required
                    placeholder="MG..."
                    className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-4 focus:ring-[#0a6e4e]/5 transition-all font-mono"
                    value={form.admission_number}
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
                    Phone Number
                  </label>
                  <input
                    required
                    placeholder="07..."
                    className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-4 focus:ring-[#0a6e4e]/5 transition-all"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">
                    Department
                  </label>
                  <select
                    required
                    className="w-full p-4 bg-gray-50 rounded-2xl outline-none"
                    value={form.department_id}
                    onChange={(e) =>
                      setForm({ ...form, department_id: e.target.value })
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
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">
                  Reason for Counselling (Optional)
                </label>
                <textarea
                  className="w-full p-4 bg-gray-50 rounded-2xl outline-none min-h-[120px] focus:ring-4 focus:ring-[#0a6e4e]/5 transition-all"
                  placeholder="Briefly describe what's on your mind..."
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-5 bg-[#0a6e4e] text-white rounded-[25px] font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-[#0a6e4e]/30 hover:scale-[1.02] active:scale-95 transition-all mt-4"
              >
                {submitting
                  ? "Sending Request..."
                  : "Transmit Request Securely"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
