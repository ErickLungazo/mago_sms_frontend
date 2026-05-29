import React, { useState, useEffect, useMemo } from "react";
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

  const isAdmin = hasRole("Admin");
  const isHod = hasRole("HOD");
  const isCounselor = hasRole("Counselor");
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

    setLoading(true);
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
    } catch (err) {
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
  }, [departmentCode, isAdmin, isCounselor, isHod]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900">
            Intervention Management
          </h1>
          <p className="text-sm text-gray-500">{visibleTitle}</p>
        </div>
        {isAdmin && (
          <select
            className="h-14 rounded-3xl border border-gray-200 bg-white px-4 text-sm font-semibold outline-none"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
        <div className="bg-white overflow-hidden rounded-[30px] border border-gray-100 shadow-sm">
          <div className="w-full overflow-x-auto whitespace-nowrap">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 font-black uppercase tracking-[0.18em] text-gray-400">
                    Student
                  </th>
                  <th className="px-6 py-4 font-black uppercase tracking-[0.18em] text-gray-400">
                    Department
                  </th>
                  <th className="px-6 py-4 font-black uppercase tracking-[0.18em] text-gray-400">
                    Assigned
                  </th>
                  <th className="px-6 py-4 font-black uppercase tracking-[0.18em] text-gray-400">
                    Status
                  </th>
                  <th className="px-6 py-4 font-black uppercase tracking-[0.18em] text-gray-400">
                    Opened
                  </th>
                  <th className="px-6 py-4 font-black uppercase tracking-[0.18em] text-gray-400">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      className="px-6 py-10 text-center text-gray-400"
                      colSpan={6}
                    >
                      Loading intervention rows...
                    </td>
                  </tr>
                ) : interventions.length === 0 ? (
                  <tr>
                    <td
                      className="px-6 py-10 text-center text-gray-400"
                      colSpan={6}
                    >
                      No interventions available for your view.
                    </td>
                  </tr>
                ) : (
                  interventions.map((item) => (
                    <tr
                      key={item.id}
                      className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 font-bold text-gray-900">
                        {item.student?.name || "Unknown"}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {item.student?.course?.department?.name ||
                          item.department?.name ||
                          "N/A"}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {item.assigned_to?.name ||
                          item.assigned_to ||
                          "Unassigned"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] ${
                            item.status === "Resolved & Closed"
                              ? "bg-emerald-100 text-emerald-700"
                              : item.status === "In Progress"
                                ? "bg-blue-100 text-blue-700"
                                : item.status === "Escalated to HOD"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {item.created_at
                          ? new Date(item.created_at).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() => openDrawer(item)}
                          className="h-12 rounded-2xl bg-[#0a6e4e] px-5 text-sm font-black text-white hover:bg-black transition-all"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[30px] border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-black text-gray-900 mb-4">
              Action Summary
            </h2>
            <div className="space-y-4 text-sm text-gray-600">
              <p>
                <span className="font-black text-gray-900">
                  View Isolation:
                </span>{" "}
                {isHod
                  ? "HOD-only department records"
                  : isCounselor
                    ? "Counselor assigned requests"
                    : "Full admin access"}
              </p>
              <p>
                <span className="font-black text-gray-900">Row Safeguard:</span>{" "}
                Responsive table wrapper ensures horizontal scroll with intact
                row alignment.
              </p>
              <p>
                <span className="font-black text-gray-900">
                  Drawer Workflow:
                </span>{" "}
                Open a record to apply accountable action logging and status
                progression.
              </p>
            </div>
          </div>

          <div className="rounded-[30px] border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-[0.25em] text-gray-400 mb-3">
              Legend
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span>Resolved Files</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                <span>In Progress</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span>Escalated</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-slate-300"></span>
                <span>Pending Assessment</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {drawerOpen && selectedIntervention && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm px-4 py-6 overflow-y-auto">
          <div className="mx-auto max-w-5xl rounded-[40px] bg-white shadow-2xl border border-gray-100 overflow-hidden">
            <div className="flex flex-col gap-6 p-8 md:p-10">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.28em] text-gray-400">
                    Intervention Tracker
                  </p>
                  <h2 className="text-3xl font-black text-gray-900">
                    {selectedIntervention.student?.name || "Student Record"}
                  </h2>
                  <p className="mt-2 text-sm text-gray-500">
                    {selectedIntervention.student?.id ||
                      selectedIntervention.student_id}{" "}
                    ·{" "}
                    {selectedIntervention.student?.course?.name ||
                      "Course Unknown"}
                  </p>
                </div>
                <button
                  onClick={closeDrawer}
                  className="h-14 w-14 rounded-full bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500 transition-all"
                >
                  ×
                </button>
              </div>

              <div className="grid gap-6 lg:grid-cols-3">
                <div className="rounded-[28px] border border-gray-100 bg-gray-50 p-6">
                  <p className="text-xs font-black uppercase tracking-[0.28em] text-gray-500">
                    Current Status
                  </p>
                  <p className="mt-4 text-xl font-black text-gray-900">
                    {selectedIntervention.status}
                  </p>
                </div>
                <div className="rounded-[28px] border border-gray-100 bg-gray-50 p-6">
                  <p className="text-xs font-black uppercase tracking-[0.28em] text-gray-500">
                    Assigned Counselor
                  </p>
                  <p className="mt-4 text-xl font-black text-gray-900">
                    {selectedIntervention.assigned_to?.name || "Unassigned"}
                  </p>
                </div>
                <div className="rounded-[28px] border border-gray-100 bg-gray-50 p-6">
                  <p className="text-xs font-black uppercase tracking-[0.28em] text-gray-500">
                    Department
                  </p>
                  <p className="mt-4 text-xl font-black text-gray-900">
                    {selectedIntervention.student?.course?.department?.name ||
                      "N/A"}
                  </p>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-[28px] border border-gray-100 p-6">
                  <p className="text-xs font-black uppercase tracking-[0.28em] text-gray-500 mb-4">
                    Action Types
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {ACTION_TYPES.map((type) => {
                      const active = actionTypes.includes(type);
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => toggleActionType(type)}
                          className={`rounded-full px-4 py-3 text-sm font-black transition-all ${active ? "bg-[#0a6e4e] text-white" : "bg-gray-100 text-gray-600"}`}
                        >
                          {type}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-[28px] border border-gray-100 p-6">
                  <label className="text-xs font-black uppercase tracking-[0.28em] text-gray-500">
                    Operational Status
                  </label>
                  <select
                    value={actionStatus}
                    onChange={(e) => setActionStatus(e.target.value)}
                    className="mt-4 h-14 w-full rounded-[26px] border border-gray-200 bg-white px-4 text-base font-semibold outline-none"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="rounded-[28px] border border-gray-100 p-6 bg-gray-50">
                <label className="block text-xs font-black uppercase tracking-[0.28em] text-gray-500 mb-3">
                  Detailed Evaluation Notes
                </label>
                <textarea
                  rows={6}
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  className="w-full rounded-[26px] border border-gray-200 bg-white px-4 py-4 text-base font-semibold outline-none focus:border-[#0a6e4e]"
                  placeholder="Enter at least 15 characters of notes describing your evaluation and next steps."
                />
                {validationError && (
                  <p className="mt-3 text-sm text-red-600">{validationError}</p>
                )}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row justify-end">
                <button
                  type="button"
                  onClick={closeDrawer}
                  className="h-14 rounded-[26px] border border-gray-200 bg-white text-gray-700 font-black"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={updating}
                  className="h-14 rounded-[26px] bg-[#0a6e4e] px-6 text-white font-black shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updating ? "Saving..." : "Log & Resolve"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
