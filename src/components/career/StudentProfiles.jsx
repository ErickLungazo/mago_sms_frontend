import React, { useState, useEffect, useMemo } from "react";
import api from "../../api";

export default function StudentProfiles() {
  const [departments, setDepartments] = useState([]);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/departments")
      .then((res) => setDepartments(res.data.data || res.data || []))
      .catch(() => setDepartments([]));
  }, []);

  useEffect(() => {
    const params = {
      page: currentPage,
      search: searchTerm || undefined,
      department_id: selectedDept || undefined,
    };
    setLoading(true);
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
  }, [currentPage, searchTerm, selectedDept]);

  const openProfile = async (student) => {
    setSelectedStudent(student);
    setStudentDetails(null);
    setDetailLoading(true);
    try {
      const res = await api.get(`/students/${student.id}`);
      const payload = res.data.data || res.data || {};
      setStudentDetails(payload);
    } catch (err) {
      setError("Unable to load student dossier details.");
    } finally {
      setDetailLoading(false);
    }
  };

  const filteredLabel = useMemo(() => {
    if (!selectedDept) return "All Departments";
    const dept = departments.find(
      (deptItem) => String(deptItem.id) === String(selectedDept),
    );
    return dept?.name || "Filtered Department";
  }, [departments, selectedDept]);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-black text-gray-900">
              Student Profiles
            </h1>
            <p className="text-sm text-gray-500">
              Paginated student fetch, search, and student dossier review.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by student name or MG ID"
              className="h-14 w-full rounded-[26px] border border-gray-200 bg-white px-4 text-sm outline-none focus:border-[#0a6e4e]"
            />
            <select
              value={selectedDept}
              onChange={(e) => {
                setSelectedDept(e.target.value);
                setCurrentPage(1);
              }}
              className="h-14 w-full rounded-[26px] border border-gray-200 bg-white px-4 text-sm outline-none focus:border-[#0a6e4e]"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="rounded-[32px] border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
                Viewing
              </p>
              <h2 className="text-xl font-black text-gray-900">
                {filteredLabel}
              </h2>
            </div>
            <p className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </p>
          </div>

          {loading ? (
            <div className="py-16 text-center text-gray-400">
              Loading student records...
            </div>
          ) : students.length === 0 ? (
            <div className="py-16 text-center text-gray-400">
              No student profiles found.
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-3">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="group rounded-[30px] border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-xl"
                >
                  <div className="flex justify-between items-start mb-5">
                    <div className="rounded-[24px] bg-[#0a6e4e]/10 p-4 text-2xl">
                      🎓
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] ${student.satisfaction === "Happy" ? "bg-emerald-100 text-emerald-700" : student.satisfaction === "Unhappy" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"}`}
                    >
                      {student.satisfaction || "No Survey"}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-gray-900 mb-1">
                    {student.name}
                  </h3>
                  <p className="text-xs font-mono uppercase tracking-[0.2em] text-gray-400 mb-4">
                    {student.id}
                  </p>
                  <p className="text-sm text-gray-500 mb-8">
                    {student.course?.name || "Course pending assignment"}
                  </p>
                  <button
                    type="button"
                    onClick={() => openProfile(student)}
                    className="h-14 w-full rounded-[26px] bg-[#0a6e4e] text-white font-black uppercase tracking-[0.18em] hover:bg-black transition-all"
                  >
                    Open Dossier
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="h-12 rounded-3xl border border-gray-200 bg-white px-5 text-sm font-semibold disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              className="h-12 rounded-3xl bg-[#0a6e4e] px-5 text-sm font-semibold text-white disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        {selectedStudent && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-4 backdrop-blur-sm">
            <div className="mx-auto max-w-5xl overflow-hidden rounded-[40px] bg-white shadow-2xl">
              <div className="flex flex-col gap-4 border-b border-gray-100 bg-gray-50 p-8 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
                    Student Dossier
                  </p>
                  <h2 className="mt-3 text-3xl font-black text-gray-900">
                    {selectedStudent.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {selectedStudent.id} •{" "}
                    {selectedStudent.course?.department?.name ||
                      "Department N/A"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedStudent(null);
                    setStudentDetails(null);
                  }}
                  className="h-14 w-14 rounded-full bg-white text-gray-600 shadow-sm hover:bg-red-50 hover:text-red-500 transition-all"
                >
                  ×
                </button>
              </div>

              <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr] p-8">
                <div className="space-y-6">
                  <div className="rounded-[32px] border border-gray-100 bg-[#f8fafc] p-6">
                    <h3 className="text-sm font-black uppercase tracking-[0.3em] text-gray-400">
                      Demographic Profile
                    </h3>
                    <div className="mt-5 space-y-4 text-sm text-gray-700">
                      <div>
                        <span className="font-black">Gender:</span>{" "}
                        {studentDetails?.gender ||
                          selectedStudent.gender ||
                          "N/A"}
                      </div>
                      <div>
                        <span className="font-black">Phone:</span>{" "}
                        {studentDetails?.phone || "N/A"}
                      </div>
                      <div>
                        <span className="font-black">Location:</span>{" "}
                        {studentDetails?.location || "N/A"}
                      </div>
                      <div>
                        <span className="font-black">Residence:</span>{" "}
                        {studentDetails?.residence || "N/A"}
                      </div>
                      <div>
                        <span className="font-black">Home Address:</span>{" "}
                        {studentDetails?.home_address || "N/A"}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[32px] border border-gray-100 bg-[#f8fafc] p-6">
                    <h3 className="text-sm font-black uppercase tracking-[0.3em] text-gray-400">
                      Academic Journey
                    </h3>
                    <div className="mt-5 space-y-4 text-sm text-gray-700">
                      <div>
                        <span className="font-black">Intake Year:</span>{" "}
                        {studentDetails?.intake_year || "N/A"}
                      </div>
                      <div>
                        <span className="font-black">Course:</span>{" "}
                        {studentDetails?.course?.name ||
                          selectedStudent.course?.name ||
                          "N/A"}
                      </div>
                      <div>
                        <span className="font-black">Department:</span>{" "}
                        {studentDetails?.course?.department?.name ||
                          selectedStudent.course?.department?.name ||
                          "N/A"}
                      </div>
                      <div>
                        <span className="font-black">Status:</span>{" "}
                        {studentDetails?.status || "N/A"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[32px] border border-gray-100 bg-white p-6">
                  <h3 className="text-base font-black text-gray-900">
                    Unified Student Timeline
                  </h3>
                  {detailLoading ? (
                    <div className="py-16 text-center text-gray-400">
                      Loading dossier...
                    </div>
                  ) : studentDetails ? (
                    <div className="space-y-8">
                      <section>
                        <div className="flex items-center justify-between gap-4 mb-4">
                          <h4 className="text-sm font-black uppercase tracking-[0.3em] text-gray-400">
                            Satisfaction History
                          </h4>
                          <span className="text-xs text-gray-500">
                            {studentDetails.satisfaction_surveys?.length || 0}{" "}
                            entries
                          </span>
                        </div>
                        <div className="space-y-4">
                          {studentDetails.satisfaction_surveys?.length > 0 ? (
                            studentDetails.satisfaction_surveys.map(
                              (survey) => (
                                <div
                                  key={survey.id}
                                  className="rounded-[28px] border border-gray-100 bg-[#f8fafc] p-5"
                                >
                                  <div className="flex items-center justify-between gap-4 mb-2">
                                    <span className="font-black text-gray-900">
                                      {survey.satisfaction_rating}
                                    </span>
                                    <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500">
                                      {new Date(
                                        survey.created_at,
                                      ).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600">
                                    Influencer: {survey.influencer || "N/A"}
                                  </p>
                                  <p className="mt-2 text-sm text-gray-700">
                                    {survey.reason_text ||
                                      "No comments provided."}
                                  </p>
                                </div>
                              ),
                            )
                          ) : (
                            <p className="text-gray-400 italic">
                              No satisfaction survey history.
                            </p>
                          )}
                        </div>
                      </section>

                      <section>
                        <div className="flex items-center justify-between gap-4 mb-4">
                          <h4 className="text-sm font-black uppercase tracking-[0.3em] text-gray-400">
                            Intervention Cases
                          </h4>
                          <span className="text-xs text-gray-500">
                            {studentDetails.interventions?.length || 0} cases
                          </span>
                        </div>
                        <div className="space-y-4">
                          {studentDetails.interventions?.length > 0 ? (
                            studentDetails.interventions.map((item) => (
                              <div
                                key={item.id}
                                className="rounded-[28px] border border-amber-100 bg-amber-50 p-5"
                              >
                                <div className="flex items-center justify-between gap-4 mb-2">
                                  <span className="font-black text-amber-900">
                                    {item.type}
                                  </span>
                                  <span className="text-[10px] uppercase tracking-[0.2em] text-amber-700">
                                    {item.status}
                                  </span>
                                </div>
                                <p className="text-sm text-amber-800">
                                  {item.action_notes || "No notes provided."}
                                </p>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-400 italic">
                              No intervention records available.
                            </p>
                          )}
                        </div>
                      </section>

                      <section>
                        <div className="flex items-center justify-between gap-4 mb-4">
                          <h4 className="text-sm font-black uppercase tracking-[0.3em] text-gray-400">
                            Job Placements
                          </h4>
                          <span className="text-xs text-gray-500">
                            {studentDetails.job_placements?.length || 0}{" "}
                            placements
                          </span>
                        </div>
                        <div className="space-y-4">
                          {studentDetails.job_placements?.length > 0 ? (
                            studentDetails.job_placements.map((placement) => (
                              <div
                                key={placement.id}
                                className="rounded-[28px] border border-gray-100 p-5"
                              >
                                <div className="flex items-center justify-between gap-4 mb-2">
                                  <span className="font-black text-gray-900">
                                    {placement.employer_name}
                                  </span>
                                  <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500">
                                    {placement.placement_type}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600">
                                  {placement.position_role} • Ksh{" "}
                                  {Number(placement.salary).toLocaleString()}
                                </p>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-400 italic">
                              No placement history available.
                            </p>
                          )}
                        </div>
                      </section>
                    </div>
                  ) : (
                    <div className="py-16 text-center text-gray-400">
                      Select a student to load the complete dossier.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
