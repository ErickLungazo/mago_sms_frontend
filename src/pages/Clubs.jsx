import { useState, useEffect, useCallback } from "react";
import api from "../api";

export default function Clubs() {
  const [clubs, setClubs] = useState([]);
  const [staff, setStaff] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingClub, setEditingClub] = useState(null);
  const [form, setForm] = useState({
    name: "",
    patron_staff_id: "",
    department_scope: "",
  });

  const fetchData = useCallback(async () => {
    try {
      const [cRes, sRes, dRes] = await Promise.all([
        api.get("/clubs"),
        api.get("/staff"),
        api.get("/departments"),
      ]);

      setClubs(cRes.data.data || cRes.data || []);
      setStaff(sRes.data.data || sRes.data || []);
      setDepartments(dRes.data.data || dRes.data || []);
    } catch (err) {
      console.error("Error synchronizing organization data pathways:", err);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(fetchData);
  }, [fetchData]);

  const resetForm = () => {
    setForm({ name: "", patron_staff_id: "", department_scope: "" });
    setEditingClub(null);
    setShowForm(false);
  };

  const handleEdit = (club) => {
    setEditingClub(club);
    setForm({
      name: club.name || "",
      patron_staff_id: club.patron_staff_id || "",
      department_scope: club.department_scope || "",
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingClub ? `/clubs/${editingClub.id}` : "/clubs";
      const method = editingClub ? "put" : "post";
      const payload = {
        name: form.name,
        patron_staff_id: form.patron_staff_id,
        department_scope: form.department_scope || "",
      };

      await api[method](url, payload);
      resetForm();
      fetchData();
    } catch (err) {
      console.error(
        "Failed to commit organizational matrix modifications:",
        err,
      );
    }
  };

  const handleDelete = async (id) => {
    if (
      !confirm("Are you sure you want to permanently delete this club record?")
    )
      return;
    try {
      await api.delete(`/clubs/${id}`);
      fetchData();
    } catch (err) {
      console.error("Delete breakdown failed:", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 antialiased text-slate-800">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">
            Clubs & Societies
          </h2>
          <p className="text-xs font-medium text-slate-400 mt-0.5">
            Manage institutional student organizations and operational personnel
            scopes.
          </p>
        </div>
        <button
          onClick={() => {
            if (showForm && editingClub) {
              resetForm();
            } else {
              setShowForm(!showForm);
            }
          }}
          className="h-10 inline-flex items-center justify-center gap-2 px-4 rounded-lg bg-[#0a6e4e] hover:bg-[#085a40] text-white text-xs font-bold tracking-wide transition shadow-sm"
        >
          {showForm ? (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              CLOSE FORM
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              REGISTER NEW CLUB
            </>
          )}
        </button>
      </div>

      {/* Dynamic Form Management Block */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-sm space-y-5"
        >
          <div className="border-b border-slate-100 pb-3 flex items-center gap-2 text-[#0a6e4e]">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              {editingClub
                ? "Modify Organization Details"
                : "Register New Organization"}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                Official Club Name
              </label>
              <input
                required
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-800 outline-none focus:border-[#0a6e4e] focus:ring-1 focus:ring-[#0a6e4e] transition shadow-sm"
                placeholder="e.g. Entrepreneurship Club"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                Assigned Patron (Staff)
              </label>
              <select
                required
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 outline-none focus:border-[#0a6e4e] focus:ring-1 focus:ring-[#0a6e4e] transition shadow-sm cursor-pointer"
                value={form.patron_staff_id}
                onChange={(e) =>
                  setForm({ ...form, patron_staff_id: e.target.value })
                }
              >
                <option value="">Select Patron...</option>
                {staff.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.department?.name || "No Division"})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                Departmental Scope
              </label>
              <select
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 outline-none focus:border-[#0a6e4e] focus:ring-1 focus:ring-[#0a6e4e] transition shadow-sm cursor-pointer"
                value={form.department_scope}
                onChange={(e) =>
                  setForm({ ...form, department_scope: e.target.value })
                }
              >
                <option value="">All Departments (Global)</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <button
              type="submit"
              className="h-9 rounded-lg bg-[#0a6e4e] hover:bg-[#085a40] text-white px-4 text-xs font-bold transition shadow-sm"
            >
              {editingClub ? "Update Details" : "Save Record"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Responsive Ledger Data Architecture Frame */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {clubs.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-xs font-medium italic">
            No active club organizations found in the database directory.
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            {/* Desktop Table View */}
            <table className="w-full text-left border-collapse hidden md:table">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                  <th className="py-3 px-5">Club Profile</th>
                  <th className="py-3 px-5">Functional Department Scope</th>
                  <th className="py-3 px-5">Accountable Patron</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {clubs.map((c) => {
                  const contextualDept = c.department_scope
                    ? departments.find(
                        (dept) =>
                          String(dept.id) === String(c.department_scope),
                      )?.name
                    : null;

                  return (
                    <tr
                      key={c.id}
                      className="hover:bg-slate-50/40 transition duration-150"
                    >
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-md bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-500 shadow-inner">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                              />
                            </svg>
                          </div>
                          <span className="font-bold text-slate-900">
                            {c.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <span
                          className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold border ${
                            contextualDept
                              ? "bg-slate-50 text-slate-600 border-slate-200/80"
                              : "bg-emerald-50 text-[#0a6e4e] border-emerald-200/40"
                          }`}
                        >
                          {contextualDept || "Global Scope"}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-slate-600 font-medium">
                        {c.patron?.name || (
                          <span className="text-amber-600 font-bold">
                            ⚠️ Vacant
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-5 text-right">
                        <div className="inline-flex items-center gap-3">
                          <button
                            onClick={() => handleEdit(c)}
                            className="text-slate-400 hover:text-[#0a6e4e] transition-colors p-1"
                            title="Edit Record"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(c.id)}
                            className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                            title="Delete Record"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Mobile Adaptive Collapsed Rows */}
            <div className="grid grid-cols-1 divide-y divide-slate-100 md:hidden">
              {clubs.map((c) => {
                const contextualDept = c.department_scope
                  ? departments.find(
                      (dept) => String(dept.id) === String(c.department_scope),
                    )?.name
                  : null;

                return (
                  <div key={c.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-0.5">
                        <h4 className="font-bold text-slate-900">{c.name}</h4>
                        <span className="text-[10px] text-slate-400 font-mono">
                          ID Target: #{c.id}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(c)}
                          className="h-8 w-8 rounded-md bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="h-8 w-8 rounded-md bg-slate-50 border border-slate-200 flex items-center justify-center text-rose-600"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] font-medium border-t border-slate-50">
                      <div>
                        <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                          Scope
                        </span>
                        <span className="text-slate-700">
                          {contextualDept || "Global Access"}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                          Patron
                        </span>
                        <span className="text-slate-700">
                          {c.patron?.name || "⚠️ Vacant"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
