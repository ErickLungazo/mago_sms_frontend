import { useState, useEffect, useMemo, useCallback } from "react";
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

  const fetchData = useCallback(async () => {
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
    } catch {
      setError("Unable to load placement records.");
      setPlacements([]);
    } finally {
      setLoading(false);
    }
  }, [page, placementTypeFilter, searchTerm]);

  useEffect(() => {
    queueMicrotask(fetchData);
  }, [fetchData]);

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
    } catch {
      setError("There was an error saving the placement.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 antialiased text-slate-800 bg-slate-50/50 min-h-screen">
      {/* Top Section: Quick Metric Cards */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 lg:p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
            Placement Coverage
          </p>
          <p className="mt-2 text-3xl lg:text-4xl font-black text-emerald-600">
            {stats.employment_rate}%
          </p>
          <p className="mt-2 text-xs font-medium text-slate-500">
            Employment placement rate across filtered records.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 lg:p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
            Self-Employed Rate
          </p>
          <p className="mt-2 text-3xl lg:text-4xl font-black text-sky-600">
            {stats.self_employed_rate}%
          </p>
          <p className="mt-2 text-xs font-medium text-slate-500">
            Share of self-employed graduates in the dataset.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 lg:p-6 shadow-sm sm:col-span-2 lg:col-span-1">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
            Average Salary
          </p>
          <p className="mt-2 text-3xl lg:text-4xl font-black text-slate-900">
            Ksh {Math.round(stats.average_salary).toLocaleString()}
          </p>
          <p className="mt-2 text-xs font-medium text-slate-500">
            Average starting income across placement submissions.
          </p>
        </div>
      </div>

      {/* Main Workspace: Actions Dashboard Grid */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Controls Header Component */}
        <div className="p-5 lg:p-6 border-b border-slate-100 bg-slate-50/40 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-0.5">
            <h2 className="text-lg font-black tracking-tight text-slate-900">
              Live Placement Registry
            </h2>
            <p className="text-xs font-medium text-slate-500">
              Filter and analyze student career pathways and classification
              tracking logs.
            </p>
          </div>
          <button
            onClick={() => setShowForm((prev) => !prev)}
            className={`h-10 rounded-lg px-4 text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 ${
              showForm
                ? "bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100"
                : "bg-[#0a6e4e] hover:bg-[#085a40] text-white"
            }`}
          >
            {showForm ? "✕ Close Form Panel" : "＋ Log New Placement"}
          </button>
        </div>

        {/* Dynamic Inner Workspace (Table vs. Form Split Panel) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200/80 items-start">
          {/* Main List Column */}
          <div
            className={`${showForm ? "lg:col-span-7" : "lg:col-span-12"} w-full transition-all duration-300`}
          >
            {/* Inline Sub-Filter Area */}
            <div className="p-4 bg-slate-50/30 border-b border-slate-100 flex flex-col sm:flex-row gap-3">
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search student or employer..."
                className="h-10 w-full sm:max-w-xs rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:border-[#0a6e4e] focus:ring-1 focus:ring-[#0a6e4e] transition shadow-sm"
              />
              <select
                value={placementTypeFilter}
                onChange={(e) => setPlacementTypeFilter(e.target.value)}
                className="h-10 w-full sm:w-44 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none focus:border-[#0a6e4e] focus:ring-1 focus:ring-[#0a6e4e] transition shadow-sm"
              >
                <option value="">All Classifications</option>
                {PLACEMENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Core Responsive Data Layout */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-bold uppercase tracking-wider font-mono">
                    <th className="p-4 pl-5">Student / Entity</th>
                    <th className="p-4">Classification</th>
                    <th className="p-4">Timeline Opened</th>
                    <th className="p-4 pr-5 text-right">Starting Income</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
                  {loading ? (
                    <tr>
                      <td
                        className="p-10 text-center text-slate-400 font-mono tracking-wider uppercase"
                        colSpan={4}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-slate-200 border-t-[#0a6e4e]"></div>
                          <span>Parsing Ledger Arrays...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredRows.length === 0 ? (
                    <tr>
                      <td
                        className="p-10 text-center text-slate-400 italic"
                        colSpan={4}
                      >
                        No placement records discovered within active query
                        configurations.
                      </td>
                    </tr>
                  ) : (
                    filteredRows.map((placement) => (
                      <tr
                        key={placement.id}
                        className="hover:bg-slate-50/40 transition-colors group"
                      >
                        <td className="p-4 pl-5">
                          <span className="block font-bold text-slate-900 text-sm group-hover:text-[#0a6e4e] transition-colors">
                            {placement.student?.name || placement.student_id}
                          </span>
                          <span className="text-[11px] text-slate-400 block mt-0.5">
                            at {placement.employer_name} ·{" "}
                            <span className="italic">
                              {placement.position_role}
                            </span>
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase border ${
                              placement.placement_type === "Self-Employed"
                                ? "bg-sky-50 text-sky-700 border-sky-200/40"
                                : "bg-emerald-50 text-emerald-700 border-emerald-200/40"
                            }`}
                          >
                            {placement.placement_type}
                          </span>
                        </td>
                        <td className="p-4 font-mono text-slate-400">
                          {placement.start_date
                            ? new Date(placement.start_date).toLocaleDateString(
                                undefined,
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )
                            : "—"}
                        </td>
                        <td className="p-4 pr-5 text-right font-mono font-bold text-slate-900">
                          Ksh {Number(placement.salary).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls Footer */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/20">
              <p className="text-xs font-semibold text-slate-400 font-mono">
                Page {page} / {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  className="h-8 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  className="h-8 rounded-lg bg-[#0a6e4e] text-white px-3 text-xs font-bold shadow-sm transition hover:bg-[#085a40] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Form Dynamic Panel Side Tray Container */}
          {showForm && (
            <div className="lg:col-span-5 p-5 lg:p-6 bg-slate-50/50 w-full h-full">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide font-mono">
                    Log Entry Profile
                  </h3>
                  <p className="text-xs text-slate-400">
                    Input secure metrics verified against student registration
                    tokens.
                  </p>
                </div>

                {error && (
                  <div className="rounded-lg bg-rose-50 border border-rose-100 p-3.5 text-xs font-semibold text-rose-700 flex items-center gap-2">
                    ⚠️ {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider font-mono">
                      Student Identifier Token
                    </label>
                    <input
                      required
                      placeholder="e.g., STU-99831"
                      className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium outline-none focus:border-[#0a6e4e] transition shadow-sm"
                      value={form.student_id}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          student_id: e.target.value.toUpperCase(),
                        })
                      }
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider font-mono">
                      Employer Corporate Entity
                    </label>
                    <input
                      required
                      placeholder="Entity Name or Self"
                      className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium outline-none focus:border-[#0a6e4e] transition shadow-sm"
                      value={form.employer_name}
                      onChange={(e) =>
                        setForm({ ...form, employer_name: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider font-mono">
                        Position / Role Title
                      </label>
                      <input
                        required
                        placeholder="Corporate Capacity"
                        className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium outline-none focus:border-[#0a6e4e] transition shadow-sm"
                        value={form.position_role}
                        onChange={(e) =>
                          setForm({ ...form, position_role: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider font-mono">
                        Commencement Date
                      </label>
                      <input
                        required
                        type="date"
                        max={maxStartDate}
                        className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium outline-none focus:border-[#0a6e4e] transition shadow-sm"
                        value={form.start_date}
                        onChange={(e) =>
                          setForm({ ...form, start_date: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider font-mono">
                        Base Starting Salary (Ksh)
                      </label>
                      <input
                        required
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Income Amount"
                        className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium outline-none focus:border-[#0a6e4e] transition shadow-sm"
                        value={form.salary}
                        onChange={(e) =>
                          setForm({ ...form, salary: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider font-mono">
                        Placement Vector Type
                      </label>
                      <select
                        className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 outline-none focus:border-[#0a6e4e] transition shadow-sm"
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
                  </div>

                  <button
                    type="submit"
                    className="h-10 w-full rounded-lg bg-[#0a6e4e] hover:bg-[#085a40] text-white text-xs font-bold uppercase tracking-wider transition shadow-md pt-0.5"
                  >
                    Commit Record Changes
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Layout Layer: Income Pulse Demographics Breaks */}
      <div className="grid gap-6 md:grid-cols-2 w-full">
        {/* Left Card: Gender Cohorts */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 lg:p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-400 font-mono">
              Gender Distribution Pulses
            </h3>
            <p className="text-xs text-slate-400">
              Demographic income scaling analysis grids.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {avgByGender.map((group) => (
              <div
                key={group.gender}
                className="rounded-xl border border-slate-200/60 bg-slate-50/50 p-4"
              >
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  {group.gender} Cohort
                </div>
                <div className="mt-1.5 text-xl font-black text-slate-900 tracking-tight">
                  Ksh {group.average.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Card: Departmental Node Cohorts */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 lg:p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-400 font-mono">
              Departmental Node Yields
            </h3>
            <p className="text-xs text-slate-400">
              Top tracking operational pipeline revenue splits.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {avgByDepartment.slice(0, 4).map((group) => (
              <div
                key={group.department}
                className="rounded-xl border border-slate-200/60 bg-slate-50/50 p-4 min-w-0"
              >
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono truncate">
                  {group.department}
                </div>
                <div className="mt-1.5 text-xl font-black text-slate-900 tracking-tight">
                  Ksh {group.average.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
