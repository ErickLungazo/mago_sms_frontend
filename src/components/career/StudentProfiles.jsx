import { useState, useEffect, useMemo } from "react";
import api from "../../api";

export default function StudentProfiles() {
  const [departments, setDepartments] = useState([]);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedSatisfaction, setSelectedSatisfaction] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [error, setError] = useState("");

  // Fetch Departments on Mount
  useEffect(() => {
    api
      .get("/departments")
      .then((res) => setDepartments(res.data.data || res.data || []))
      .catch(() => setDepartments([]));
  }, []);

  // Main Dynamic Paginated Fetch Pipeline
  useEffect(() => {
    const params = {
      page: currentPage,
      search: searchTerm || undefined,
      department_id: selectedDept || undefined,
      gender: selectedGender || undefined,
      satisfaction: selectedSatisfaction || undefined,
    };
    queueMicrotask(() => setLoading(true));
    api
      .get("/students", { params })
      .then((res) => {
        const payload = res.data.data || res.data || {};
        const rows = payload.data || payload;
        setStudents(Array.isArray(rows) ? rows : []);
        setTotalPages(payload.meta?.last_page || payload.meta?.lastPage || 1);
      })
      .catch(() => {
        setStudents([]);
        setError("Unable to load student profiles.");
      })
      .finally(() => setLoading(false));
  }, [
    currentPage,
    searchTerm,
    selectedDept,
    selectedGender,
    selectedSatisfaction,
  ]);

  const openProfile = async (student) => {
    setSelectedStudent(student);
    setStudentDetails(null);
    setDetailLoading(true);
    try {
      const res = await api.get(`/students/${student.id}`);
      const payload = res.data.data || res.data || {};
      setStudentDetails(payload);
    } catch {
      setError("Unable to load student dossier details.");
    } finally {
      setDetailLoading(false);
    }
  };

  const filteredLabel = useMemo(() => {
    let label = "All Records Matrix";
    if (selectedDept) {
      const dept = departments.find(
        (deptItem) => String(deptItem.id) === String(selectedDept),
      );
      label = dept?.name || "Filtered Department";
    }

    const modifiers = [];
    if (selectedGender) modifiers.push(selectedGender);
    if (selectedSatisfaction) modifiers.push(`Status: ${selectedSatisfaction}`);

    return modifiers.length > 0 ? `${label} (${modifiers.join(" • ")})` : label;
  }, [departments, selectedDept, selectedGender, selectedSatisfaction]);

  const handlePrint = () => {
    window.print();
  };

  return (
    // Added unique 'id="isolated-print-registry-root"' class to isolate the print layout
    <div
      id="isolated-print-registry-root"
      className="min-h-screen bg-slate-50 text-slate-800 antialiased p-6 md:p-8"
    >
      {/* Global CSS Print Structural Overrides */}
      <style>{`
        @media print {
          /* Step 1: Hide everything else on the page (menus, sidebars, headers, app layouts) */
          body, html, #root, .app-layout, .sidebar, .navbar, header, nav {
            visibility: hidden !important;
            background: #ffffff !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          /* Step 2: Force only our data component zone to be visible */
          #isolated-print-registry-root, #isolated-print-registry-root * {
            visibility: visible;
          }

          /* Step 3: Absolute positioning reset so data prints at the very top of the page */
          #isolated-print-registry-root {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: transparent !important;
          }

          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          @page {
            size: portrait;
            margin: 15mm 15mm 15mm 15mm;
          }
          .no-print {
            display: none !important;
          }
          .print-split-layout {
            display: block !important;
          }
          .print-full-width {
            width: 100% !important;
            max-width: 100% !important;
          }
          .print-break-avoid {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          ${
            selectedStudent
              ? `
            .print-hide-table-on-dossier {
              display: none !important;
            }
          `
              : `
            .print-hide-dossier-on-table {
              display: none !important;
            }
          `
          }
        }
      `}</style>

      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Top Control Utility Bar */}
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between no-print border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Student Records Registry
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Filter by department, demographics, or satisfaction thresholds,
              and generate system printouts.
            </p>
          </div>

          {/* Filters Matrix block */}
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search ID or Name..."
              className="h-10 w-48 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition"
            />

            {/* Department Dropdown Filter */}
            <select
              value={selectedDept}
              onChange={(e) => {
                setSelectedDept(e.target.value);
                setCurrentPage(1);
              }}
              className="h-10 w-48 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium outline-none focus:border-slate-400 transition"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>

            {/* Gender Dropdown Filter */}
            <select
              value={selectedGender}
              onChange={(e) => {
                setSelectedGender(e.target.value);
                setCurrentPage(1);
              }}
              className="h-10 w-32 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium outline-none focus:border-slate-400 transition"
            >
              <option value="">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            {/* Satisfaction Filter */}
            <select
              value={selectedSatisfaction}
              onChange={(e) => {
                setSelectedSatisfaction(e.target.value);
                setCurrentPage(1);
              }}
              className="h-10 w-36 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium outline-none focus:border-slate-400 transition"
            >
              <option value="">All Satisfaction</option>
              <option value="Happy">Happy</option>
              <option value="Unhappy">Unhappy</option>
              <option value="Neutral">Neutral</option>
            </select>

            {/* Context-aware Print Action Triggers */}
            <button
              type="button"
              onClick={handlePrint}
              className="h-10 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold tracking-wide text-xs transition shadow-sm"
            >
              {selectedStudent
                ? "🖨️ Print Dossier View"
                : "🖨️ Print Registry List"}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-lg bg-red-50 border border-red-100 text-xs font-semibold text-red-600 no-print">
            {error}
          </div>
        )}

        {/* Master Content Split Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start print-split-layout">
          {/* Registry Table List View */}
          <div
            className={`bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm print-full-width print-hide-table-on-dossier
            ${selectedStudent ? "lg:col-span-7" : "lg:col-span-12"}`}
          >
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block print:hidden">
                  Active Workspace Scope
                </span>
                <h2 className="text-sm font-bold text-slate-800 mt-0.5">
                  {filteredLabel}
                </h2>
              </div>
              <span className="text-xs font-semibold text-slate-500 bg-white px-2.5 py-1 rounded border border-slate-200 print:border-none">
                Index Page {currentPage} of {totalPages}
              </span>
            </div>

            {loading ? (
              <div className="py-20 text-center text-xs font-medium text-slate-400 tracking-wider">
                Querying backend records...
              </div>
            ) : students.length === 0 ? (
              <div className="py-20 text-center text-xs text-slate-400 font-medium">
                No matching student configurations found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="py-3 px-4">Identification</th>
                      <th className="py-3 px-4">Full Name</th>
                      <th className="py-3 px-4">Academic Assignment</th>
                      <th className="py-3 px-4 text-center">Satisfaction</th>
                      <th className="py-3 px-4 text-right no-print">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {students.map((student) => {
                      const isTarget = selectedStudent?.id === student.id;
                      return (
                        <tr
                          key={student.id}
                          className={`transition ${isTarget ? "bg-slate-100/80 font-medium" : "hover:bg-slate-50/60"}`}
                        >
                          <td className="py-3 px-4 font-mono text-slate-500 font-semibold">
                            {student.id}
                          </td>
                          <td className="py-3 px-4 text-slate-900 font-bold">
                            <div>{student.name}</div>
                            <div className="text-[10px] text-slate-400 font-normal mt-0.5 lg:hidden">
                              {student.gender || "Unspecified Gender"}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-slate-900 font-medium">
                              {student.course?.name || "No Course Assigned"}
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-wide font-semibold">
                              {student.course?.department?.name ||
                                student.department?.name ||
                                "General Registry"}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${
                                student.satisfaction === "Happy"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : student.satisfaction === "Unhappy"
                                    ? "bg-rose-50 text-rose-700 border-rose-200"
                                    : "bg-slate-50 text-slate-600 border-slate-200"
                              }`}
                            >
                              {student.satisfaction || "None"}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right no-print">
                            <button
                              type="button"
                              onClick={() => openProfile(student)}
                              className={`px-3 py-1.5 rounded-md font-bold text-[11px] transition outline-none border ${
                                isTarget
                                  ? "bg-slate-800 text-white border-slate-800"
                                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                              }`}
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination controls block */}
            <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between no-print">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="px-3 py-1.5 rounded border border-slate-200 bg-white text-xs font-bold text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                className="px-3 py-1.5 rounded border border-slate-200 bg-white text-xs font-bold text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition"
              >
                Next
              </button>
            </div>
          </div>

          {/* Persistent Sidebar Dossier Panel View Component */}
          {selectedStudent && (
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm print-full-width print-hide-dossier-on-table">
              {/* Dossier Header panel */}
              <div className="p-5 border-b border-slate-100 bg-slate-900 text-white flex items-center justify-between">
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold block">
                    Document Inspection Dossier
                  </span>
                  <h3 className="text-base font-bold tracking-tight mt-0.5">
                    {selectedStudent.name}
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">
                    {selectedStudent.id}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedStudent(null);
                    setStudentDetails(null);
                  }}
                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-bold transition no-print"
                >
                  Close ×
                </button>
              </div>

              {/* Dossier Data Track Content */}
              <div className="p-5 space-y-6">
                {/* Profile Grid metadata sections */}
                <div className="grid grid-cols-2 gap-4 print-break-avoid">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Demographic Profile
                    </h4>
                    <div className="space-y-1 text-xs">
                      <div>
                        <span className="text-slate-500 font-medium">
                          Gender:
                        </span>{" "}
                        {studentDetails?.gender ||
                          selectedStudent.gender ||
                          "N/A"}
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium">
                          Phone:
                        </span>{" "}
                        {studentDetails?.phone || "N/A"}
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium">
                          Location:
                        </span>{" "}
                        {studentDetails?.location || "N/A"}
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium">
                          Residence:
                        </span>{" "}
                        {studentDetails?.residence || "N/A"}
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Academic Profile
                    </h4>
                    <div className="space-y-1 text-xs">
                      <div>
                        <span className="text-slate-500 font-medium">
                          Intake Year:
                        </span>{" "}
                        {studentDetails?.intake_year || "N/A"}
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium">
                          Course:
                        </span>{" "}
                        {studentDetails?.course?.name ||
                          selectedStudent.course?.name ||
                          "N/A"}
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium">
                          Dept:
                        </span>{" "}
                        {studentDetails?.course?.department?.name ||
                          selectedStudent.department?.name ||
                          "N/A"}
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium">
                          Status:
                        </span>{" "}
                        <span className="font-semibold text-emerald-700">
                          {studentDetails?.status || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subsystem Audit Timeline Track */}
                <div className="space-y-5">
                  <h4 className="text-xs font-bold text-slate-800 border-b border-slate-100 pb-1.5 uppercase tracking-wide">
                    Historical Audit Logs
                  </h4>

                  {detailLoading ? (
                    <div className="py-10 text-center text-xs font-medium text-slate-400 animate-pulse">
                      Syncing record timeline snapshots...
                    </div>
                  ) : studentDetails ? (
                    <div className="space-y-5">
                      {/* Sub-track 1: Satisfaction */}
                      <div className="print-break-avoid">
                        <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400 mb-2">
                          <span>Survey Matrices</span>
                          <span>
                            {studentDetails.satisfaction_surveys?.length || 0}{" "}
                            Records
                          </span>
                        </div>
                        <div className="space-y-2">
                          {studentDetails.satisfaction_surveys?.length > 0 ? (
                            studentDetails.satisfaction_surveys.map(
                              (survey) => (
                                <div
                                  key={survey.id}
                                  className="p-2.5 rounded border border-slate-100 bg-slate-50/50"
                                >
                                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                                    <span className="text-[#0a6e4e]">
                                      {survey.satisfaction_rating}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-mono">
                                      {survey.created_at
                                        ? new Date(
                                            survey.created_at,
                                          ).toLocaleDateString()
                                        : ""}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-600 leading-relaxed italic">
                                    "
                                    {survey.reason_text ||
                                      "No descriptive notes submitted."}
                                    "
                                  </p>
                                </div>
                              ),
                            )
                          ) : (
                            <p className="text-[11px] text-slate-400 italic">
                              No historical survey paths recorded.
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Sub-track 2: Cases */}
                      <div className="print-break-avoid">
                        <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400 mb-2">
                          <span>Interventions Logs</span>
                          <span>
                            {studentDetails.interventions?.length || 0} Open
                          </span>
                        </div>
                        <div className="space-y-2">
                          {studentDetails.interventions?.length > 0 ? (
                            studentDetails.interventions.map((item) => (
                              <div
                                key={item.id}
                                className="p-2.5 rounded border border-amber-200 bg-amber-50/40 text-xs"
                              >
                                <div className="flex items-center justify-between font-bold text-[11px] mb-1">
                                  <span className="text-amber-900">
                                    {item.type}
                                  </span>
                                  <span className="text-amber-700 tracking-wider font-mono text-[9px] uppercase bg-amber-100 px-1 rounded">
                                    {item.status}
                                  </span>
                                </div>
                                <p className="text-[11px] text-amber-900/90 leading-normal">
                                  {item.action_notes || "No notes indexed."}
                                </p>
                              </div>
                            ))
                          ) : (
                            <p className="text-[11px] text-slate-400 italic">
                              No formal administrative cases active.
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Sub-track 3: Placements */}
                      <div className="print-break-avoid">
                        <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400 mb-2">
                          <span>Corporate Tracking</span>
                          <span>
                            {studentDetails.job_placements?.length || 0} Tracks
                          </span>
                        </div>
                        <div className="space-y-2">
                          {studentDetails.job_placements?.length > 0 ? (
                            studentDetails.job_placements.map((placement) => (
                              <div
                                key={placement.id}
                                className="p-2.5 rounded border border-slate-200 text-xs bg-white"
                              >
                                <div className="flex items-center justify-between font-bold mb-0.5 text-slate-800">
                                  <span>{placement.employer_name}</span>
                                  <span className="text-[10px] text-slate-400 font-normal">
                                    {placement.placement_type}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-500">
                                  {placement.position_role} •{" "}
                                  <span className="font-semibold text-slate-900">
                                    Ksh{" "}
                                    {placement.salary
                                      ? Number(
                                          placement.salary,
                                        ).toLocaleString()
                                      : "0"}
                                  </span>
                                </p>
                              </div>
                            ))
                          ) : (
                            <p className="text-[11px] text-slate-400 italic">
                              No industrial placements registered.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-10 text-center text-xs text-slate-400 italic">
                      Select a profile index row to stream contextual dossier
                      arrays.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
