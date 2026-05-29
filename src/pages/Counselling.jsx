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
      setSessions(res.data.data?.data || res.data.data || []);
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
          setSessions(res.data.data?.data || res.data.data || []);
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
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Open":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Follow-up":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Closed":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-gray-900">
            Counselling Session Matrix
          </h2>
          <p className="text-sm text-gray-400">
            Track structural guidance and mental health cases securely
          </p>
        </div>
        <select
          className="p-3 bg-gray-50 border-0 rounded-xl font-bold text-xs tracking-wider text-gray-600 outline-none uppercase"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Pending">⏱️ Pending Approval</option>
          <option value="Open">📖 Active / Open</option>
          <option value="Follow-up">🔄 Scheduled Follow-up</option>
          <option value="Closed">✅ Closed Cases</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0a6e4e]"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {sessions.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 text-gray-400 font-medium">
              No matching counseling session records found.
            </div>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                  <div>
                    <h3 className="font-black text-lg text-gray-900">
                      {session.student?.name || "Unknown Student"}
                    </h3>
                    <p className="text-xs font-mono text-gray-400 uppercase tracking-tight">
                      ID: {session.student_id} · Type: {session.session_type}
                    </p>
                  </div>
                  <span
                    className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${getStatusStyles(session.status)}`}
                  >
                    {session.status}
                  </span>
                </div>

                {updatingSession === session.id ? (
                  <form
                    onSubmit={handleUpdateSubmit}
                    className="space-y-4 pt-2 bg-gray-50 p-4 rounded-2xl border border-gray-100 animate-in fade-in-50"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">
                          Update Status
                        </label>
                        <select
                          className="w-full p-3 bg-white border border-gray-200 rounded-xl font-bold text-sm"
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
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">
                        Confidential Session Notes
                      </label>
                      <textarea
                        className="w-full p-4 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#0a6e4e]"
                        rows="3"
                        value={updateForm.confidential_notes}
                        onChange={(e) =>
                          setUpdateForm({
                            ...updateForm,
                            confidential_notes: e.target.value,
                          })
                        }
                        placeholder="Document milestones, concerns, or remediation measures..."
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setUpdatingSession(null)}
                        className="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-200 rounded-xl transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 text-xs font-black text-white bg-[#0a6e4e] rounded-xl shadow-lg shadow-[#0a6e4e]/20 transition-all"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-2xl italic border border-gray-50 leading-relaxed">
                      "
                      {session.confidential_notes ||
                        "No confidential history documented for this block."}
                      "
                    </p>
                    <div className="flex justify-between items-center text-xs font-medium text-gray-400">
                      <span>
                        📅 Session Date:{" "}
                        <b>
                          {new Date(session.session_date).toLocaleDateString()}
                        </b>
                      </span>
                      <button
                        onClick={() => startUpdate(session)}
                        className="text-[#0a6e4e] font-black uppercase hover:underline tracking-wider text-[11px]"
                      >
                        ✍️ Edit Session
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
