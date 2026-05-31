import { useState, useEffect, useMemo } from "react";
import api from "../../api";
import { useAuth } from "../../useAuth";

const ACTION_TYPES = [
  "One-on-one counseling",
  "Academic Tutorial Referral",
  "Course Transfer Processing",
  "Financial Sponsor Liaison",
];

const STATUS_OPTIONS = [
  "Pending Assessment",
  "In Progress",
  "Escalated to HOD",
  "Resolved & Closed",
];

export default function Interventions() {
  const { user, hasRole } = useAuth();
  const [interventions, setInterventions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedIntervention, setSelectedIntervention] = useState(null);
  const [actionTypes, setActionTypes] = useState(["One-on-one counseling"]);
  const [actionStatus, setActionStatus] = useState("Pending Assessment");
  const [actionNotes, setActionNotes] = useState("");
  const [validationError, setValidationError] = useState("");
  const [updating, setUpdating] = useState(false);

  const isAdmin = hasRole("admin");
  const isHod = hasRole("hod");
  const isCounselor = hasRole("counsellor");

  const departmentCode =
    user?.department?.code ||
    user?.department_code ||
    user?.department?.name ||
    "";
  const assignedTo = user?.id || null;

  useEffect(() => {
    if (!isAdmin) return;
    api
      .get("/departments")
      .then((res) => {
        setDepartments(res.data.data || res.data || []);
      })
      .catch(() => {
        setDepartments([]);
      });
  }, [isAdmin]);

  useEffect(() => {
    const params = {};
    if (isHod && departmentCode) {
      params.department_code = departmentCode;
    }
    if (isCounselor) {
      params.assigned_to = assignedTo;
    }
    if (isAdmin && selectedDepartment) {
      params.department_id = selectedDepartment;
    }

    queueMicrotask(() => setLoading(true));
    api
      .get("/interventions", { params })
      .then((res) => {
        setInterventions(res.data.data || res.data || []);
      })
      .catch(() => {
        setInterventions([]);
      })
      .finally(() => setLoading(false));
  }, [
    assignedTo,
    departmentCode,
    isAdmin,
    isCounselor,
    isHod,
    selectedDepartment,
  ]);

  const openDrawer = (intervention) => {
    setSelectedIntervention(intervention);
    setActionTypes(intervention.action_types || ["One-on-one counseling"]);
    setActionStatus(intervention.status || "Pending Assessment");
    setActionNotes(intervention.action_notes || "");
    setValidationError("");
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedIntervention(null);
  };

  const toggleActionType = (type) => {
    setActionTypes((prev) =>
      prev.includes(type)
        ? prev.filter((item) => item !== type)
        : [...prev, type],
    );
  };

  const handleSave = async () => {
    if (!selectedIntervention) return;
    if (actionNotes.trim().length < 15) {
      setValidationError(
        "Please add at least 15 characters of action notes before logging the update.",
      );
      return;
    }
    if (!actionTypes.length) {
      setValidationError("Select at least one action type before saving.");
      return;
    }

    setUpdating(true);
    setValidationError("");

    try {
      await api.put(`/interventions/${selectedIntervention.id}`, {
        action_types: actionTypes,
        status: actionStatus,
        action_notes: actionNotes.trim(),
        updated_by: assignedTo,
      });
      closeDrawer();
      const fresh = interventions.map((item) =>
        item.id === selectedIntervention.id
          ? {
              ...item,
              action_types: actionTypes,
              status: actionStatus,
              action_notes: actionNotes,
            }
          : item,
      );
      setInterventions(fresh);
    } catch {
      setValidationError(
        "Unable to save action. Please refresh and try again.",
      );
    } finally {
      setUpdating(false);
    }
  };

  const visibleTitle = useMemo(() => {
    if (isHod) return `HOD View · ${departmentCode || "Department"} Only`;
    if (isCounselor) return "Counselor Personal Pipeline";
    return "Admin Multi-Department Tracker";
  }, [departmentCode, isCounselor, isHod]);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 antialiased text-slate-800 bg-slate-50/50 min-h-screen print:bg-white print:p-0 print:space-y-6">
      {/* Executive Clean Print Engine Style Layer */}
      <style>{`
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            box-shadow: none !important;
          }
          @page {
            size: letter portrait;
            margin: 12mm 15mm 12mm 15mm;
          }
          body {
            background: #ffffff !important;
            color: #0f172a !important;
            font-size: 11px !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .no-print, select, button, .interactive-actions-column { 
            display: none !important; 
            height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
          }
          .print-top-header {
            margin-top: 0 !important;
            padding-top: 0 !important;
            padding-bottom: 20px !important;
            border-bottom: 3px solid #0a6e4e !important;
            display: block !important;
            width: 100% !important;
          }
          .print-full-layout {
            width: 100% !important;
            max-width: 100% !important;
            display: block !important;
          }
          .print-avoid-break { 
            page-break-inside: avoid !important; 
            break-inside: avoid !important; 
          }
          .print-border { 
            border: 1px solid #cbd5e1 !important; 
            border-radius: 8px !important; 
          }
          .print-title-text {
            font-size: 26px !important;
            font-weight: 900 !important;
            color: #000000 !important;
            text-transform: uppercase !important;
          }
          .print-official-header {
            display: none !important;
          }
          .print-only {
            display: none;
          }
        }
        @media print {
          .print-only {
            display: block !important;
          }
        }
      `}</style>

      {/* Official Management Header (Print Only) */}
      <div className="hidden print-only print-top-header text-center mb-6">
        <div className="text-2xl font-black text-[#0a6e4e]">MAGO TECHNICAL & VOCATIONAL COLLEGE</div>
        <div className="text-sm font-bold text-gray-600 uppercase tracking-widest mt-1">Institutional Intervention & Guidance Report</div>
        <div className="flex justify-between items-end mt-6 border-t pt-4 border-gray-100">
          <div className="text-left">
            <div className="text-[10px] text-gray-400 font-bold uppercase">Report Class</div>
            <div className="text-xs font-bold text-black">OFFICIAL MANAGEMENT AUDIT</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-gray-400 font-bold uppercase">Date Generated</div>
            <div className="text-xs font-bold text-black">{new Date().toLocaleDateString(undefined, { dateStyle: 'long' })}</div>
          </div>
        </div>
      </div>

      {/* Re-engineered Header Block (Anchored Straight to Top) */}
      <div className="print-top-header flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-6 print:hidden">
        <div className="space-y-1">
          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl print-title-text">
            Intervention Management
          </h1>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 print:text-slate-800">
            <span>Active Context:</span>
            <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-mono font-bold print:bg-transparent print:p-0 print:text-black print:underline">
              {visibleTitle}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 no-print">
          {isAdmin && (
            <select
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-sm min-w-[180px]"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              <option value="">All Academic Divisions</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          )}
          <button
            onClick={() => window.print()}
            className="h-10 inline-flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-4 text-xs font-bold transition shadow-sm"
          >
            🖨️ Print Data Ledger
          </button>
        </div>
      </div>

      {/* Top Section: Full-Width Registry Table */}
      <div className="w-full print-full-layout">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden print-border print-avoid-break">
          <div className="p-5 border-b border-slate-100 bg-slate-50/40">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              Open Pipeline Case Registry
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase tracking-wider font-mono">
                  <th className="p-4 pl-5">Student Parameters</th>
                  <th className="p-4">Departmental Node</th>
                  <th className="p-4">Assigned Professional</th>
                  <th className="p-4 text-center">Status Flag</th>
                  <th className="p-4">Timeline Opened</th>
                  <th className="p-4 pr-5 text-right no-print">
                    Workspace Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
                {loading ? (
                  <tr>
                    <td
                      className="p-12 text-center text-slate-400 font-mono tracking-widest uppercase"
                      colSpan={6}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-slate-200 border-t-slate-800"></div>
                        <span>Parsing Operational Log Arrays...</span>
                      </div>
                    </td>
                  </tr>
                ) : interventions.length === 0 ? (
                  <tr>
                    <td
                      className="p-12 text-center text-slate-400 italic"
                      colSpan={6}
                    >
                      No active operational intervention records map to your
                      credential clearances.
                    </td>
                  </tr>
                ) : (
                  interventions.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="p-4 pl-5">
                        <span className="block font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
                          {item.student?.name || "Unknown"}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                          Ref: #{item.id}
                        </span>
                      </td>
                      <td className="p-4 text-slate-700 font-medium max-w-[200px] truncate">
                        {item.student?.course?.department?.name ||
                          item.department?.name ||
                          "N/A"}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/80"></span>
                          {item.logged_by?.name ||
                            item.logged_by ||
                            "Unassigned"}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span
                          className={`inline-flex rounded-md px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase border ${
                            item.status === "Resolved & Closed"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200/50"
                              : item.status === "In Progress"
                                ? "bg-sky-50 text-sky-700 border-sky-200/50"
                                : item.status === "Escalated to HOD"
                                  ? "bg-amber-50 text-amber-700 border-amber-200/50"
                                  : "bg-slate-50 text-slate-600 border-slate-200"
                          } print:bg-transparent print:border-none print:p-0 print:text-slate-900 print:font-black`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-slate-400">
                        {item.created_at
                          ? new Date(item.created_at).toLocaleDateString(
                              undefined,
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )
                          : "—"}
                      </td>
                      <td className="p-4 pr-5 text-right no-print">
                        <button
                          type="button"
                          onClick={() => openDrawer(item)}
                          className="h-8 rounded-lg bg-white border border-slate-200 hover:border-slate-900 hover:bg-slate-900 text-slate-700 hover:text-white px-3 text-xs font-bold transition shadow-sm"
                        >
                          Manage File
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bottom Section: Side-by-Side Metadata Information Blocks */}
      <div className="grid gap-6 md:grid-cols-2 no-print w-full">
        {/* Left Card: Action Metrics Scope */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 font-mono mb-3">
            Action Metrics Scope
          </h2>
          <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
            <p>
              <strong className="text-slate-900 block font-bold mb-0.5">
                Isolation Parameter:
              </strong>{" "}
              {isHod
                ? "Filtering HOD-only department records."
                : isCounselor
                  ? "Restricted to your specific assigned targets."
                  : "Full uninhibited multi-tenant data logs."}
            </p>
            <p>
              <strong className="text-slate-900 block font-bold mb-0.5">
                Accountability Guard:
              </strong>{" "}
              All notes logged require unique parameters to maintain formal
              chain-of-custody audit logs.
            </p>
          </div>
        </div>

        {/* Right Card: Pipeline State Flags */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 font-mono mb-3">
            Pipeline State Flags
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold">
            {[
              { label: "Resolved System Logs", color: "bg-emerald-500" },
              { label: "In Active Treatment", color: "bg-sky-500" },
              { label: "Escalated Core Context", color: "bg-amber-500" },
              { label: "Pending Verification", color: "bg-slate-400" },
            ].map((legendItem, index) => (
              <div
                key={index}
                className="flex items-center gap-2.5 text-slate-700"
              >
                <span
                  className={`w-2 h-2 rounded-md ${legendItem.color}`}
                ></span>
                <span>{legendItem.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Slide-In Drawer Overlay Panel */}
      {drawerOpen && selectedIntervention && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/40 backdrop-blur-sm p-4 no-print">
          <div className="h-full max-h-[90vh] w-full max-w-2xl rounded-xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 font-mono bg-indigo-50 px-2 py-0.5 rounded">
                  Secure Identity Scope
                </span>
                <h2 className="text-xl font-black text-slate-900 mt-1">
                  {selectedIntervention.student?.name || "Student Record"}
                </h2>
                <p className="text-xs font-semibold text-slate-400 mt-0.5">
                  ID Token: #
                  {selectedIntervention.student?.id ||
                    selectedIntervention.student_id}{" "}
                  ·{" "}
                  {selectedIntervention.student?.course?.name ||
                    "Course Unassigned"}
                </p>
              </div>
              <button
                onClick={closeDrawer}
                className="h-9 w-9 rounded-lg bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 transition flex items-center justify-center font-bold text-lg"
              >
                ×
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {/* Metadata Badges Row */}
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { title: "Status State", data: selectedIntervention.status },
                  {
                    title: "Assigned Agent",
                    data:
                      selectedIntervention.logged_by?.name || "Unassigned",
                  },
                  {
                    title: "Departmental Node",
                    data:
                      selectedIntervention.student?.course?.department?.name ||
                      "N/A",
                  },
                ].map((badge, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-200/80 bg-slate-50/30 p-3"
                  >
                    <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 font-mono block">
                      {badge.title}
                    </span>
                    <p className="mt-0.5 text-xs font-bold text-slate-800 truncate">
                      {badge.data}
                    </p>
                  </div>
                ))}
              </div>

              {/* Action Vector Matrix */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono block">
                  Select Action Vector Matrix Target
                </label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {ACTION_TYPES.map((type) => {
                    const active = actionTypes.includes(type);
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => toggleActionType(type)}
                        className={`rounded-xl p-3 text-xs text-left font-bold transition-all border ${
                          active
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${active ? "bg-white" : "bg-slate-300"}`}
                          ></span>
                          {type}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Status Selector Dropdown */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono block">
                  Operational Pipeline Assignment Shift
                </label>
                <select
                  value={actionStatus}
                  onChange={(e) => setActionStatus(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-sm"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              {/* Evaluation Logging Input Area */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono">
                  Detailed Operational Log Evaluation Notes
                </label>
                <textarea
                  rows={4}
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-medium text-slate-800 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none shadow-sm placeholder:text-slate-400"
                  placeholder="Provide precise descriptions detailing changes to this student's case profile (minimum 15 characters required)."
                />
                {validationError && (
                  <p className="text-xs font-semibold text-rose-600 flex items-center gap-1 mt-1 animate-pulse">
                    ⚠️ {validationError}
                  </p>
                )}
              </div>
            </div>

            {/* Sticky Drawer Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeDrawer}
                className="h-10 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 font-bold px-4 text-xs transition"
              >
                Close View
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={updating}
                className="h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 text-xs shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updating
                  ? "Committing Vector State..."
                  : "Commit Logs & Resolve Profile"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
