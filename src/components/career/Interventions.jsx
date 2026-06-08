import { useState, useEffect, useMemo, useCallback } from "react";
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

export default function Interventions({ onRefresh }) {
  const { user, hasRole } = useAuth();
  const [interventions, setInterventions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedIntervention, setSelectedIntervention] = useState(null);
  const [actionTypes, setActionTypes] = useState(["One-on-one counseling"]);
  const [actionStatus, setActionStatus] = useState("Pending Assessment");
  const [actionNotes, setActionNotes] = useState("");
  const [assignedStaffId, setAssignedStaffId] = useState("");
  const [validationError, setValidationError] = useState("");
  const [updating, setUpdating] = useState(false);

  // SIMPLIFIED ROLE LOGIC
  const canAssign = hasRole(["admin", "principal", "dean", "career_officer", "hod"]);
  const isHod = hasRole("hod");
  const isCounselor = hasRole("counsellor");
  const isManagement = hasRole(["admin", "principal", "dean", "career_officer"]);

  const departmentCode = user?.staff?.department?.code || user?.department_code || "";
  const currentUserStaffId = user?.staff?.id || user?.staff_id || null;

  const fetchInterventions = useCallback(() => {
    const params = {};
    if (isHod && departmentCode) params.department_code = departmentCode;
    if (isCounselor) params.assigned_to = currentUserStaffId;
    if (isManagement && selectedDepartment) params.department_id = selectedDepartment;
    if (selectedStatus !== "All") params.status = selectedStatus;

    setLoading(true);
    api.get("/interventions", { params })
      .then((res) => setInterventions(res.data.data || res.data || []))
      .catch(() => setInterventions([]))
      .finally(() => setLoading(false));
  }, [currentUserStaffId, departmentCode, isManagement, isCounselor, isHod, selectedDepartment, selectedStatus]);

  useEffect(() => {
    if (!canAssign) return;
    
    api.get("/departments").then((res) => setDepartments(res.data.data || res.data || []));
    api.get("/staff").then((res) => setStaffList(res.data.data || res.data || []));
  }, [canAssign]);

  useEffect(() => {
    fetchInterventions();
  }, [fetchInterventions]);

  const openDrawer = (intervention) => {
    setSelectedIntervention(intervention);
    setActionTypes(intervention.action_types || ["One-on-one counseling"]);
    setActionStatus(intervention.status || "Pending Assessment");
    setActionNotes(intervention.action_notes || "");
    setAssignedStaffId(intervention.logged_by_staff_id || "");
    setValidationError("");
    setDrawerOpen(true);
  };

  const handleSave = async () => {
    if (actionNotes.trim().length < 15) {
      setValidationError("Action notes must be at least 15 characters.");
      return;
    }
    setUpdating(true);
    try {
      await api.put(`/interventions/${selectedIntervention.id}`, {
        action_types: actionTypes,
        status: actionStatus,
        action_notes: actionNotes.trim(),
        logged_by_staff_id: assignedStaffId || null,
      });
      setDrawerOpen(false);
      fetchInterventions();
      if (onRefresh) onRefresh();
    } catch (err) {
      setValidationError("Failed to save. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black">Intervention Tracker</h1>
        <div className="flex gap-2">
           <select className="p-2 rounded-lg border" value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)}>
              <option value="All">All Statuses</option>
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
           </select>
           {isManagement && (
             <select className="p-2 rounded-lg border" value={selectedDepartment} onChange={e => setSelectedDepartment(e.target.value)}>
                <option value="">All Departments</option>
                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
             </select>
           )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-4">Student</th>
              <th className="p-4">Assigned To</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {interventions.map(item => (
              <tr key={item.id} className="border-b">
                <td className="p-4 font-bold">{item.student?.name}</td>
                <td className="p-4">{item.logged_by?.name || item.loggedBy?.name || "Unassigned"}</td>
                <td className="p-4"><span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-bold">{item.status}</span></td>
                <td className="p-4 text-right">
                  <button onClick={() => openDrawer(item)} className="px-3 py-1 bg-slate-900 text-white rounded font-bold">Manage</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-xl p-8 flex flex-col gap-6">
            <div className="flex justify-between items-center">
               <h2 className="text-xl font-black">Manage Case</h2>
               <button onClick={() => setDrawerOpen(false)} className="text-2xl">×</button>
            </div>

            {/* DEBUG BADGE */}
            <div className="text-[10px] font-bold bg-yellow-100 p-2 rounded border border-yellow-200">
               DEBUG: Roles detected: {user?.roles?.join(', ') || 'None'}
            </div>

            <div className="space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400">Status</label>
                <select className="w-full p-3 rounded-xl border mt-1" value={actionStatus} onChange={e => setActionStatus(e.target.value)}>
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {canAssign && (
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400">Assign Professional</label>
                  <select className="w-full p-3 rounded-xl border mt-1" value={assignedStaffId} onChange={e => setAssignedStaffId(e.target.value)}>
                    <option value="">Handle Personally</option>
                    {staffList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              )}

              <div>
                <label className="text-[10px] font-black uppercase text-gray-400">Evaluation Notes</label>
                <textarea className="w-full p-4 rounded-xl border mt-1" rows={5} value={actionNotes} onChange={e => setActionNotes(e.target.value)} />
                {validationError && <p className="text-red-500 text-xs font-bold mt-2">{validationError}</p>}
              </div>
            </div>

            <button onClick={handleSave} disabled={updating} className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold">
              {updating ? "Saving..." : "Update Case File"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
