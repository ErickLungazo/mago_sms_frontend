import { useState, useEffect } from "react";
import api from "../api";

export default function CounsellingSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [updatingSession, setUpdatingSession] = useState(null);
  const [updateForm, setUpdateForm] = useState({
    status: "",
    confidential_notes: "",
  });

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const url = statusFilter
        ? `/counselling?status=${statusFilter}`
        : "/counselling";
      const res = await api.get(url);
      const rawData = res.data?.data ?? res.data;
      setSessions(Array.isArray(rawData) ? rawData : (rawData?.data ?? []));
    } catch (error) {
      console.error("Failed to retrieve counselling records", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    const loadSessions = async () => {
      setLoading(true);
      try {
        const url = statusFilter
          ? `/counselling?status=${statusFilter}`
          : "/counselling";
        const res = await api.get(url);
        if (active) {
          const rawData = res.data?.data ?? res.data;
          setSessions(Array.isArray(rawData) ? rawData : (rawData?.data ?? []));
        }
      } catch (error) {
        if (active) {
          console.error("Failed to retrieve counselling records", error);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadSessions();

    return () => {
      active = false;
    };
  }, [statusFilter]);

  const startUpdate = (session) => {
    setUpdatingSession(session.id);
    setUpdateForm({
      status: session.status,
      confidential_notes: session.confidential_notes || "",
    });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/counselling/${updatingSession}`, updateForm);
      setUpdatingSession(null);
      fetchSessions();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save session logs");
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "Pending":
        return "bg-amber-50 text-amber-700 border-amber-200/60";
      case "Open":
        return "bg-sky-50 text-sky-700 border-sky-200/60";
      case "Follow-up":
        return "bg-purple-50 text-purple-700 border-purple-200/60";
      case "Closed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 antialiased text-slate-800">
      {/* Structural Filter Hub Block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 lg:p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="space-y-0.5">
          <h2 className="text-xl font-black tracking-tight text-slate-900">
            Counselling Session Matrix
          </h2>
          <p className="text-xs font-medium text-slate-400">
            Track structural student guidance pathways and confidential mental
            health logs securely.
          </p>
        </div>
        <select
          className="h-10 w-full sm:w-56 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 outline-none transition focus:border-[#0a6e4e] focus:ring-1 focus:ring-[#0a6e4e] shadow-sm uppercase tracking-wide cursor-pointer"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Operational Statuses</option>
          <option value="Pending">⏱️ Pending Approval</option>
          <option value="Open">📖 Active / Open Case</option>
          <option value="Follow-up">🔄 Scheduled Follow-up</option>
          <option value="Closed">✅ Closed Case Archive</option>
        </select>
      </div>

      {/* Dynamic Main Workspace Layer */}
      {loading ? (
        <div className="flex flex-col justify-center items-center py-24 space-y-3">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-200 border-t-[#0a6e4e]"></div>
          <span className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase">
            Synchronizing Ledger Logs...
          </span>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-slate-200 text-slate-400 text-xs font-medium italic">
              No matching counseling session metrics found in this operational
              division.
            </div>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                className="bg-white border border-slate-200 rounded-xl p-5 lg:p-6 shadow-sm hover:border-slate-300 transition duration-200"
              >
                {/* Session Card Info Row */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-3 pb-4 border-b border-slate-100 mb-4">
                  <div>
                    <h3 className="font-black text-base text-slate-900 transition-colors hover:text-[#0a6e4e]">
                      {session.student?.name || "Unknown Identity Specimen"}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-400 font-medium font-mono mt-0.5">
                      <span>Ref Token: #{session.student_id}</span>
                      <span className="text-slate-200">•</span>
                      <span>
                        Vector: {session.session_type || "General Intake"}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-md px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase border ${getStatusStyles(session.status)}`}
                  >
                    {session.status}
                  </span>
                </div>

                {/* Conditional Form State Toggle Panel */}
                {updatingSession === session.id ? (
                  <form
                    onSubmit={handleUpdateSubmit}
                    className="space-y-4 p-4 rounded-xl border border-slate-200/80 bg-slate-50/50"
                  >
                    <div className="w-full max-w-xs space-y-1">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider font-mono">
                        Shift Operational Pipeline Status
                      </label>
                      <select
                        className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 outline-none focus:border-[#0a6e4e] focus:ring-1 focus:ring-[#0a6e4e] transition shadow-sm"
                        value={updateForm.status}
                        onChange={(e) =>
                          setUpdateForm({
                            ...updateForm,
                            status: e.target.value,
                          })
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="Open">Open</option>
                        <option value="Follow-up">Follow-up</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider font-mono">
                        Confidential Case Log Evaluation Notes
                      </label>
                      <textarea
                        className="w-full p-3.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 outline-none focus:border-[#0a6e4e] focus:ring-1 focus:ring-[#0a6e4e] transition resize-none shadow-sm placeholder:text-slate-400"
                        rows="3"
                        value={updateForm.confidential_notes}
                        onChange={(e) =>
                          setUpdateForm({
                            ...updateForm,
                            confidential_notes: e.target.value,
                          })
                        }
                        placeholder="Document qualitative milestone progress indicators or critical structural remediation flags..."
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setUpdatingSession(null)}
                        className="h-9 rounded-lg border border-slate-200 bg-white px-4 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
                      >
                        Abort
                      </button>
                      <button
                        type="submit"
                        className="h-9 rounded-lg bg-[#0a6e4e] hover:bg-[#085a40] text-white px-4 text-xs font-bold shadow-sm transition"
                      >
                        Commit Updates
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-3.5">
                    <p className="text-xs font-medium text-slate-600 bg-slate-50/60 p-4 rounded-lg border border-slate-100 leading-relaxed italic">
                      "
                      {session.confidential_notes ||
                        "No highly classified session background narrative elements documented for this block context."}
                      "
                    </p>
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                      <div className="flex items-center gap-1">
                        <span>📅 Intake Date:</span>
                        <span className="text-slate-700 font-mono font-bold">
                          {session.session_date
                            ? new Date(session.session_date).toLocaleDateString(
                                undefined,
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )
                            : "—"}
                        </span>
                      </div>
                      <button
                        onClick={() => startUpdate(session)}
                        className="text-[#0a6e4e] font-bold uppercase tracking-wider text-[10px] hover:text-[#085a40] transition flex items-center gap-1 group"
                      >
                        <span className="group-hover:underline">
                          ✍️ Modify Case File
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
