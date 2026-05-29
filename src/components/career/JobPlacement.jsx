import React, { useState, useEffect, useMemo } from "react";
import api from "../../api";

const PLACEMENT_TYPES = ["Employment", "Self-Employed"];

export default function JobPlacement() {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [placementTypeFilter, setPlacementTypeFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    student_id: "",
    employer_name: "",
    position_role: "",
    start_date: "",
    salary: "",
    placement_type: "Employment",
  });
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    employment_rate: 0,
    self_employed_rate: 0,
    average_salary: 0,
  });

  const maxStartDate = new Date().toISOString().split("T")[0];

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/job-placements", {
        params: {
          page,
          search: searchTerm || undefined,
          placement_type: placementTypeFilter || undefined,
        },
      });
      const payload = res.data.data || res.data || {};
      const dataRows = payload.data || payload;
      setPlacements(Array.isArray(dataRows) ? dataRows : []);
      setTotalPages(payload.meta?.last_page || payload.meta?.lastPage || 1);
      setStats({
        employment_rate: res.data.stats?.employment_rate || 0,
        self_employed_rate: res.data.stats?.self_employed_rate || 0,
        average_salary: res.data.stats?.average_salary || 0,
      });
    } catch (err) {
      setError("Unable to load placement records.");
      setPlacements([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, searchTerm, placementTypeFilter]);

  const filteredRows = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();
    if (!normalized) return placements;
    return placements.filter((item) => {
      const studentName = item.student?.name || "";
      const employer = item.employer_name || "";
      const type = item.placement_type || "";
      return [studentName, employer, type].some((value) =>
        value.toLowerCase().includes(normalized),
      );
    });
  }, [placements, searchTerm]);

  const avgByGender = useMemo(() => {
    const groups = {};
    filteredRows.forEach((placement) => {
      const gender = placement.student?.gender || "Unknown";
      const salary = Number(placement.salary) || 0;
      if (!groups[gender]) groups[gender] = { total: 0, count: 0 };
      groups[gender].total += salary;
      groups[gender].count += 1;
    });
    return Object.entries(groups).map(([gender, stats]) => ({
      gender,
      average: stats.count ? Math.round(stats.total / stats.count) : 0,
    }));
  }, [filteredRows]);

  const avgByDepartment = useMemo(() => {
    const groups = {};
    filteredRows.forEach((placement) => {
      const department =
        placement.student?.course?.department?.name || "Unknown";
      const salary = Number(placement.salary) || 0;
      if (!groups[department]) groups[department] = { total: 0, count: 0 };
      groups[department].total += salary;
      groups[department].count += 1;
    });
    return Object.entries(groups).map(([department, stats]) => ({
      department,
      average: stats.count ? Math.round(stats.total / stats.count) : 0,
    }));
  }, [filteredRows]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const salaryValue = Number(form.salary);
    if (
      !form.student_id.trim() ||
      !form.employer_name.trim() ||
      !form.position_role.trim() ||
      !form.start_date ||
      !salaryValue
    ) {
      setError(
        "Please provide valid student, employer, role, date, and salary values.",
      );
      return;
    }
    if (new Date(form.start_date) > new Date()) {
      setError("Start date cannot be in the future.");
      return;
    }
    if (salaryValue <= 0) {
      setError("Salary must be a positive number.");
      return;
    }
    try {
      await api.post("/job-placements", {
        student_id: form.student_id.trim().toUpperCase(),
        employer_name: form.employer_name.trim(),
        position_role: form.position_role.trim(),
        start_date: form.start_date,
        salary: salaryValue,
        placement_type: form.placement_type,
      });
      setShowForm(false);
      setForm({
        student_id: "",
        employer_name: "",
        position_role: "",
        start_date: "",
        salary: "",
        placement_type: "Employment",
      });
      fetchData();
    } catch (err) {
      setError("There was an error saving the placement.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-[32px] border border-gray-100 bg-white p-6 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">
            Placement Coverage
          </p>
          <p className="mt-4 text-4xl font-black text-[#0a6e4e]">
            {stats.employment_rate}%
          </p>
          <p className="mt-3 text-sm text-gray-500">
            Employment placement rate across filtered records.
          </p>
        </div>
        <div className="rounded-[32px] border border-gray-100 bg-white p-6 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">
            Self-Employed Rate
          </p>
          <p className="mt-4 text-4xl font-black text-blue-600">
            {stats.self_employed_rate}%
          </p>
          <p className="mt-3 text-sm text-gray-500">
            Share of self-employed graduates in the data set.
          </p>
        </div>
        <div className="rounded-[32px] border border-gray-100 bg-white p-6 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">
            Average Salary
          </p>
          <p className="mt-4 text-4xl font-black text-gray-900">
            Ksh {Math.round(stats.average_salary).toLocaleString()}
          </p>
          <p className="mt-3 text-sm text-gray-500">
            Average starting income across placement submissions.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-[32px] border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-black text-gray-900">
                Live Placement Search
              </h2>
              <p className="text-sm text-gray-500">
                Search by student, employer, or classification.
              </p>
            </div>
            <button
              onClick={() => setShowForm((prev) => !prev)}
              className="h-14 rounded-3xl bg-[#0a6e4e] px-6 text-sm font-black text-white hover:bg-black transition-all"
            >
              {showForm ? "Hide Form" : "+ Log New Placement"}
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search student, employer, type"
              className="h-14 w-full rounded-[26px] border border-gray-200 bg-gray-50 px-4 text-sm outline-none focus:border-[#0a6e4e]"
            />
            <select
              value={placementTypeFilter}
              onChange={(e) => setPlacementTypeFilter(e.target.value)}
              className="h-14 w-full rounded-[26px] border border-gray-200 bg-gray-50 px-4 text-sm outline-none focus:border-[#0a6e4e]"
            >
              <option value="">All Types</option>
              {PLACEMENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {showForm && (
            <form
              onSubmit={handleSubmit}
              className="mt-8 grid gap-4 rounded-[30px] border border-gray-100 bg-gray-50 p-6"
            >
              {error && (
                <div className="rounded-3xl bg-red-50 border border-red-100 p-4 text-sm text-red-700">
                  {error}
                </div>
              )}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <input
                  required
                  placeholder="Student ID"
                  className="h-14 rounded-[26px] border border-gray-200 bg-white px-4 text-sm outline-none"
                  value={form.student_id}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      student_id: e.target.value.toUpperCase(),
                    })
                  }
                />
                <input
                  required
                  placeholder="Employer Entity"
                  className="h-14 rounded-[26px] border border-gray-200 bg-white px-4 text-sm outline-none"
                  value={form.employer_name}
                  onChange={(e) =>
                    setForm({ ...form, employer_name: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <input
                  required
                  placeholder="Position / Role"
                  className="h-14 rounded-[26px] border border-gray-200 bg-white px-4 text-sm outline-none"
                  value={form.position_role}
                  onChange={(e) =>
                    setForm({ ...form, position_role: e.target.value })
                  }
                />
                <input
                  required
                  type="date"
                  max={maxStartDate}
                  className="h-14 rounded-[26px] border border-gray-200 bg-white px-4 text-sm outline-none"
                  value={form.start_date}
                  onChange={(e) =>
                    setForm({ ...form, start_date: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Salary (Ksh)"
                  className="h-14 rounded-[26px] border border-gray-200 bg-white px-4 text-sm outline-none"
                  value={form.salary}
                  onChange={(e) => setForm({ ...form, salary: e.target.value })}
                />
                <select
                  className="h-14 rounded-[26px] border border-gray-200 bg-white px-4 text-sm outline-none"
                  value={form.placement_type}
                  onChange={(e) =>
                    setForm({ ...form, placement_type: e.target.value })
                  }
                >
                  {PLACEMENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="h-14 rounded-[26px] bg-[#0a6e4e] text-white font-black uppercase tracking-[0.2em] shadow-lg"
              >
                Save Placement
              </button>
            </form>
          )}
        </div>

        <div className="rounded-[32px] border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-black text-gray-900">Income Pulse</h2>
          <p className="text-sm text-gray-500">
            Average salary groups by gender and department.
          </p>

          <div className="mt-6 space-y-4">
            {avgByGender.map((group) => (
              <div
                key={group.gender}
                className="rounded-[28px] border border-gray-100 bg-gray-50 p-4"
              >
                <div className="text-xs uppercase tracking-[0.2em] text-gray-500">
                  {group.gender}
                </div>
                <div className="mt-2 text-2xl font-black text-gray-900">
                  Ksh {group.average.toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-4">
            {avgByDepartment.slice(0, 4).map((group) => (
              <div
                key={group.department}
                className="rounded-[28px] border border-gray-100 bg-gray-50 p-4"
              >
                <div className="text-xs uppercase tracking-[0.2em] text-gray-500">
                  {group.department}
                </div>
                <div className="mt-2 text-2xl font-black text-gray-900">
                  Ksh {group.average.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-[32px] border border-gray-100 bg-white p-6 shadow-sm">
        <div className="overflow-x-auto w-full whitespace-nowrap">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 font-black uppercase tracking-[0.18em] text-gray-400">
                  Student
                </th>
                <th className="px-6 py-4 font-black uppercase tracking-[0.18em] text-gray-400">
                  Employer
                </th>
                <th className="px-6 py-4 font-black uppercase tracking-[0.18em] text-gray-400">
                  Type
                </th>
                <th className="px-6 py-4 font-black uppercase tracking-[0.18em] text-gray-400">
                  Start Date
                </th>
                <th className="px-6 py-4 font-black uppercase tracking-[0.18em] text-gray-400 text-right">
                  Salary
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    className="px-6 py-8 text-center text-gray-400"
                    colSpan={5}
                  >
                    Loading placements...
                  </td>
                </tr>
              ) : filteredRows.length === 0 ? (
                <tr>
                  <td
                    className="px-6 py-8 text-center text-gray-400"
                    colSpan={5}
                  >
                    No placement records found.
                  </td>
                </tr>
              ) : (
                filteredRows.map((placement) => (
                  <tr
                    key={placement.id}
                    className="border-t border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 font-black text-gray-900">
                      {placement.student?.name || placement.student_id}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {placement.employer_name}
                    </td>
                    <td className="px-6 py-4 text-gray-600 uppercase tracking-[0.1em]">
                      {placement.placement_type}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {placement.start_date
                        ? new Date(placement.start_date).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-gray-900">
                      Ksh {Number(placement.salary).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
          <p className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              className="h-12 rounded-3xl border border-gray-200 bg-white px-5 text-sm font-semibold disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              className="h-12 rounded-3xl bg-[#0a6e4e] px-5 text-sm font-semibold text-white disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
