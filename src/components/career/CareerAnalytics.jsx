import React, { useState, useEffect, useMemo } from "react";
import api from "../../api";

const GENDERS = ["All", "Male", "Female", "Other"];
const RESIDENCE_OPTIONS = ["All", "Boarder", "Day Scholar"];
const FUNDING_OPTIONS = ["All", "Sponsored", "Self-paying"];

export default function CareerAnalytics() {
  const [insights, setInsights] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [filters, setFilters] = useState({
    department_id: "",
    gender: "",
    residence: "",
    funding: "",
  });
  const [loading, setLoading] = useState(true);
  const [hoveredInfluencer, setHoveredInfluencer] = useState(null);
  const [hoveredDepartment, setHoveredDepartment] = useState(null);

  useEffect(() => {
    api
      .get("/departments")
      .then((res) => {
        setDepartments(res.data.data || res.data || []);
      })
      .catch(() => {
        setDepartments([]);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (filters.department_id) params.department_id = filters.department_id;
    if (filters.gender) params.gender = filters.gender;
    if (filters.residence) params.residence = filters.residence;
    if (filters.funding) params.funding = filters.funding;

    api
      .get("/analytics/career-insights", { params })
      .then((res) => {
        const data = res.data || {};
        setInsights({
          total_students: data.total_students || 0,
          happy_students: data.happy_students || 0,
          unhappy_students: data.unhappy_students || 0,
          external_influence_unhappy: data.external_influence_unhappy || 0,
          employment_index: data.employment_index || 0,
          self_employment_count: data.self_employment_count || 0,
          placement_opportunities: data.placement_opportunities || 0,
          pending_interventions: data.pending_interventions || 0,
          influencer_distribution: Array.isArray(data.influencer_distribution)
            ? data.influencer_distribution
            : [],
          departmental_risk: Array.isArray(data.departmental_stats)
            ? data.departmental_stats.map((d) => ({
                name: d.name || "Unknown",
                risk_level: d.risk_level ?? 0,
                unhappy: d.unhappy_count || 0,
                total: d.total_students || 0,
              }))
            : [],
          high_risk_trends: Array.isArray(data.high_risk_trends)
            ? data.high_risk_trends
            : [],
        });
      })
      .finally(() => setLoading(false));
  }, [filters]);

  const queryLabel = useMemo(() => {
    const parts = [];
    if (filters.department_id) {
      const department = departments.find(
        (dept) => String(dept.id) === String(filters.department_id),
      );
      parts.push(department?.name || "Department");
    }
    if (filters.gender) parts.push(filters.gender);
    if (filters.residence) parts.push(filters.residence);
    if (filters.funding) parts.push(filters.funding);
    return parts.length ? parts.join(" · ") : "All Tenants";
  }, [filters, departments]);

  const satisfactionIndex = useMemo(() => {
    if (!insights) return 0;
    const total = insights.happy_students + insights.unhappy_students;
    return total ? Math.round((insights.happy_students / total) * 100) : 0;
  }, [insights]);

  const coercionRiskRate = useMemo(() => {
    if (!insights) return 0;
    const denominator = insights.unhappy_students || 1;
    return Math.round(
      (insights.external_influence_unhappy / denominator) * 100,
    );
  }, [insights]);

  const placementVelocityRate = useMemo(() => {
    if (!insights) return 0;
    const base = insights.placement_opportunities || 1;
    const velocity =
      insights.employment_index + insights.self_employment_count * 0.6;
    return Math.min(100, Math.round((velocity / base) * 100));
  }, [insights]);

  const activeBacklog = insights?.pending_interventions ?? 0;

  const maxInfluencerCount = useMemo(() => {
    if (!insights?.influencer_distribution?.length) return 1;
    return Math.max(
      ...insights.influencer_distribution.map((item) => item.count || 0),
      1,
    );
  }, [insights]);

  const maxRiskValue = useMemo(() => {
    if (!insights?.departmental_risk?.length) return 1;
    return Math.max(
      ...insights.departmental_risk.map((item) => item.risk_level || 0),
      1,
    );
  }, [insights]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value === "All" ? "" : value }));
  };

  const printReport = () => window.print();

  if (loading || !insights) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-14 w-14 border-4 border-b-4 border-[#0a6e4e]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 print-sharp">
      <style>{`
        @media print {
          .no-print, .screen-only { display: none !important; }
          body, html { background: white !important; color: #111 !important; font-size: 12pt !important; }
          .print-block { width: 100% !important; display: block !important; page-break-inside: avoid !important; }
          .print-fluid { margin: 0 !important; padding: 0 !important; box-shadow: none !important; border: none !important; }
          .print-layout { display: block !important; width: 100% !important; }
          .print-signature { display: grid !important; grid-template-columns: repeat(2, 1fr) !important; gap: 1rem !important; }
          .print-section { page-break-after: avoid !important; }
          .print-hide { display: none !important; }
        }
      `}</style>

      <div className="flex flex-col gap-6 print-block">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-black text-gray-900">
              Career Analytics Dashboard
            </h2>
            <p className="text-gray-500 font-medium">
              TVET oversight with multi-tenant demographic intelligence.
            </p>
            <p className="mt-2 text-sm text-gray-400">
              Current view: {queryLabel}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 no-print">
            <button
              onClick={printReport}
              className="inline-flex items-center justify-center rounded-2xl bg-gray-900 px-6 py-3 text-sm font-black text-white shadow-lg transition hover:bg-black"
            >
              🖨️ Print Board Report
            </button>
          </div>
        </div>

        <div className="sticky top-0 z-20 print-hide bg-white/95 backdrop-blur-sm border-b border-gray-200 py-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <label className="flex flex-col gap-2 text-xs font-black uppercase tracking-[0.18em] text-gray-500">
              Department
              <select
                className="h-12 rounded-3xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-800 shadow-sm"
                value={filters.department_id}
                onChange={(event) =>
                  handleFilterChange("department_id", event.target.value)
                }
              >
                <option value="">All Departments</option>
                {departments.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2 text-xs font-black uppercase tracking-[0.18em] text-gray-500">
              Gender
              <select
                className="h-12 rounded-3xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-800 shadow-sm"
                value={filters.gender || "All"}
                onChange={(event) =>
                  handleFilterChange("gender", event.target.value)
                }
              >
                {GENDERS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2 text-xs font-black uppercase tracking-[0.18em] text-gray-500">
              Residence
              <select
                className="h-12 rounded-3xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-800 shadow-sm"
                value={filters.residence || "All"}
                onChange={(event) =>
                  handleFilterChange("residence", event.target.value)
                }
              >
                {RESIDENCE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2 text-xs font-black uppercase tracking-[0.18em] text-gray-500">
              Funding
              <select
                className="h-12 rounded-3xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-800 shadow-sm"
                value={filters.funding || "All"}
                onChange={(event) =>
                  handleFilterChange("funding", event.target.value)
                }
              >
                {FUNDING_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 print-layout print-block">
        <div className="rounded-[32px] border border-gray-100 bg-white p-6 shadow-sm print-fluid">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">
            Institutional Satisfaction Index
          </p>
          <p className="mt-3 text-4xl font-black text-gray-900">
            {satisfactionIndex}%
          </p>
          <p className="mt-4 text-sm text-gray-500">
            Share of respondents expressing positive satisfaction within the
            current filter slice.
          </p>
        </div>

        <div className="rounded-[32px] border border-gray-100 bg-white p-6 shadow-sm print-fluid">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">
            Coercion Risk Rate
          </p>
          <p className="mt-3 text-4xl font-black text-red-600">
            {coercionRiskRate}%
          </p>
          <p className="mt-4 text-sm text-gray-500">
            Unsatisfied learners influenced externally by parents or sponsors.
          </p>
        </div>

        <div className="rounded-[32px] border border-gray-100 bg-white p-6 shadow-sm print-fluid">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">
            Placement Velocity Rate
          </p>
          <p className="mt-3 text-4xl font-black text-teal-700">
            {placementVelocityRate}%
          </p>
          <p className="mt-4 text-sm text-gray-500">
            Employment momentum including self-employment and placement
            tracking.
          </p>
        </div>

        <div className="rounded-[32px] border border-gray-100 bg-white p-6 shadow-sm print-fluid">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">
            Active Intervention Backlog
          </p>
          <p className="mt-3 text-4xl font-black text-orange-600">
            {activeBacklog}
          </p>
          <p className="mt-4 text-sm text-gray-500">
            Pending warning flags currently requiring follow-up action.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 print-layout print-block">
        <section className="rounded-[36px] border border-gray-100 bg-white p-8 shadow-sm print-fluid">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-xl font-black text-gray-900">
                Enrollment Influencer Distribution
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Visual breakdown of the dominant engagement and influence
                sources driving enrollment.
              </p>
            </div>
            <span className="rounded-full bg-green-50 px-4 py-2 text-sm font-black text-green-700">
              Hover for detail
            </span>
          </div>

          <div className="mt-8 space-y-5">
            {insights.influencer_distribution.map((item) => {
              const width = Math.max(
                6,
                Math.round((item.count / maxInfluencerCount) * 100),
              );
              const highlight = hoveredInfluencer === item.influencer;
              return (
                <button
                  key={item.influencer}
                  type="button"
                  onMouseEnter={() => setHoveredInfluencer(item.influencer)}
                  onMouseLeave={() => setHoveredInfluencer(null)}
                  className="w-full rounded-[28px] border border-gray-200 bg-gray-50 p-4 text-left transition hover:border-emerald-400"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-black text-gray-900">
                        {item.influencer}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {item.count} learners
                      </p>
                    </div>
                    <div className="text-sm font-black text-gray-700">
                      {item.percentage ??
                        Math.round((item.count / maxInfluencerCount) * 100)}
                      %
                    </div>
                  </div>
                  <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className={`h-full rounded-full ${highlight ? "bg-emerald-600" : "bg-emerald-500"}`}
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-[36px] border border-gray-100 bg-white p-8 shadow-sm print-fluid">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-xl font-black text-gray-900">
                Departmental Risk Outliers
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Departments with the highest risk and the most urgent
                intervention need.
              </p>
            </div>
            {hoveredDepartment ? (
              <span className="rounded-full bg-red-50 px-4 py-2 text-sm font-black text-red-700">
                Selected: {hoveredDepartment}
              </span>
            ) : (
              <span className="rounded-full bg-slate-50 px-4 py-2 text-sm font-black text-slate-600">
                Hover over any bar
              </span>
            )}
          </div>

          <div className="mt-8 space-y-5">
            {insights.departmental_risk.map((item) => {
              const width = Math.max(
                6,
                Math.round((item.risk_level / maxRiskValue) * 100),
              );
              const highlight = hoveredDepartment === item.name;
              return (
                <button
                  key={item.name}
                  type="button"
                  onMouseEnter={() => setHoveredDepartment(item.name)}
                  onMouseLeave={() => setHoveredDepartment(null)}
                  className="w-full rounded-[28px] border border-gray-200 bg-gray-50 p-4 text-left transition hover:border-rose-400"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-black text-gray-900">{item.name}</p>
                      <p className="mt-1 text-sm text-gray-500">
                        {item.unhappy} unhappy of {item.total}
                      </p>
                    </div>
                    <div className="text-sm font-black text-gray-700">
                      {item.risk_level}%
                    </div>
                  </div>
                  <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className={`h-full rounded-full ${highlight ? "bg-red-600" : "bg-red-500"}`}
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      <div className="rounded-[36px] border border-gray-100 bg-white p-8 shadow-sm print-fluid print-section">
        <h3 className="text-xl font-black text-gray-900">
          Approved for Board Review
        </h3>
        <p className="mt-3 text-sm text-gray-500">
          The figures above represent the latest filtered analytics snapshot for
          the selected department and demographic profile. All disclosures are
          aligned to TVET oversight and HOD governance review.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-2 print-signature">
          <div className="rounded-[24px] border border-dashed border-gray-300 p-6 text-sm text-gray-600">
            <p className="font-black text-gray-900">
              Approved for Board Review by HOD
            </p>
            <p className="mt-4 text-xs uppercase tracking-[0.25em] text-gray-400">
              Signatory
            </p>
          </div>
          <div className="rounded-[24px] border border-dashed border-gray-300 p-6 text-sm text-gray-600">
            <p className="font-black text-gray-900">Date / Reference</p>
            <p className="mt-4 text-xs uppercase tracking-[0.25em] text-gray-400">
              Printed copy audit log
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
