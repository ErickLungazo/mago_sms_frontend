import { useState, useEffect, useMemo } from "react";
import api from "../../api";

const GENDERS = ["All", "Male", "Female", "Other"];
const RESIDENCE_OPTIONS = ["All", "Boarder", "Day Scholar"];
const FUNDING_OPTIONS = ["All", "Sponsored", "Self-paying"];

// A vibrant, highly differentiable executive color array for data categories
const CHART_COLORS = [
  "bg-indigo-600",
  "bg-sky-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-violet-500",
];

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
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/departments")
      .then((res) => setDepartments(res.data.data || res.data || []))
      .catch(() => setDepartments([]));
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      setLoading(true);
      setError("");
    });
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
        });
      })
      .catch((err) => {
        console.error("Analytics Error:", err);
        setError(err.response?.data?.message || "Failed to load analytics metrics.");
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

  const maxInfluencerCount = useMemo(() => {
    if (!insights?.influencer_distribution?.length) return 1;
    return Math.max(
      ...insights.influencer_distribution.map((i) => i.count || 0),
      1,
    );
  }, [insights]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value === "All" ? "" : value }));
  };

  if (loading || (!insights && !error)) {
    return (
      <div className="flex flex-col gap-3 justify-center items-center py-40 bg-white rounded-xl border border-slate-100">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-200 border-t-slate-800"></div>
        <p className="text-xs font-bold text-slate-400 tracking-widest font-mono">
          INITIALIZING DATA STACK...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4 justify-center items-center py-40 bg-white rounded-xl border border-rose-100 px-6 text-center">
        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center text-2xl">
          ⚠️
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            Data Access Restricted
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            {error}. Please ensure your account has the required permissions to view analytics.
          </p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 antialiased text-slate-800 bg-slate-50/50 min-h-screen print:bg-white print:p-0 print:space-y-6">
      {/* Strict Executive Print Layer Overrides */}
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
          .no-print, .control-filter-wrapper, select, button, .interactive-ui-tag { 
            display: none !important; 
          }
          .print-top-header {
            margin-top: 0 !important;
            padding-top: 0 !important;
            padding-bottom: 20px !important;
            border-bottom: 3px solid #0a6e4e !important;
            display: block !important;
            width: 100% !important;
            text-align: center !important;
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
      <div className="hidden print-only print-top-header mb-6">
        <div className="text-2xl font-black text-[#0a6e4e]">MAGO TECHNICAL AND VOCATIONAL COLLEGE</div>
        <div className="text-sm font-bold text-gray-600 uppercase tracking-widest mt-1">Career Analytics Intelligence Report</div>
        <div className="flex justify-between items-end mt-6 border-t pt-4 border-gray-100">
          <div className="text-left">
            <div className="text-[10px] text-gray-400 font-bold uppercase">Metric Scope</div>
            <div className="text-xs font-bold text-black">{queryLabel}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-gray-400 font-bold uppercase">Date Generated</div>
            <div className="text-xs font-bold text-black">{new Date().toLocaleDateString(undefined, { dateStyle: 'long' })}</div>
          </div>
        </div>
      </div>

      {/* Modern Dashboard Header Section */}
      <div className="dashboard-header-container flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-6 print:hidden">
        <div>
          <span className="interactive-ui-tag text-[10px] uppercase font-bold tracking-widest text-indigo-600 font-mono bg-indigo-50 px-2 py-0.5 rounded">
            TVET Execution Metrics
          </span>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 md:text-3xl mt-1 print-header-text">
            Career Analytics Intelligence Report
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-1 print:text-slate-800">
            Generated Document Scope:{" "}
            <span className="font-mono text-indigo-600 print:text-black font-bold underline">
              {queryLabel}
            </span>
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="no-print self-start md:self-center inline-flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 text-xs font-bold transition shadow-sm"
        >
          🖨️ Print Executive Report
        </button>
      </div>

      {/* Advanced Control Filters Wrapper Panel (Explicitly unmapped and structured away for prints) */}
      <div className="control-filter-wrapper no-print bg-white border border-slate-200/80 shadow-sm rounded-xl p-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Department Structure",
              key: "department_id",
              value: filters.department_id,
              options: departments.map((d) => ({ label: d.name, val: d.id })),
              fallback: "All Academic Branches",
            },
            {
              label: "Gender Identity",
              key: "gender",
              value: filters.gender || "All",
              options: GENDERS.map((g) => ({ label: g, val: g })),
            },
            {
              label: "Campus Residence",
              key: "residence",
              value: filters.residence || "All",
              options: RESIDENCE_OPTIONS.map((r) => ({ label: r, val: r })),
            },
            {
              label: "Funding Pipeline",
              key: "funding",
              value: filters.funding || "All",
              options: FUNDING_OPTIONS.map((f) => ({ label: f, val: f })),
            },
          ].map((filterInput, idx) => (
            <div key={idx} className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono">
                {filterInput.label}
              </label>
              <select
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white px-3 text-xs font-bold text-slate-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500"
                value={filterInput.value}
                onChange={(e) =>
                  handleFilterChange(filterInput.key, e.target.value)
                }
              >
                {filterInput.fallback && (
                  <option value="">{filterInput.fallback}</option>
                )}
                {filterInput.options.map((opt, oIdx) => (
                  <option key={oIdx} value={opt.val}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* KPI Balanced Scorecard Summary Rows */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 print-grid-2 print-avoid-break">
        {[
          {
            title: "Institutional Satisfaction Index",
            value: `${satisfactionIndex}%`,
            caption: "Aggregate positive sentiment metrics.",
            bg: "border-t-emerald-500 text-emerald-600 bg-emerald-50/10",
          },
          {
            title: "Coercion Vulnerability",
            value: `${coercionRiskRate}%`,
            caption: "External pressure decision parameters.",
            bg: "border-t-rose-500 text-rose-600 bg-rose-50/10",
          },
          {
            title: "Placement Market Velocity",
            value: `${placementVelocityRate}%`,
            caption: "Weighted hiring & corporate trends.",
            bg: "border-t-indigo-500 text-indigo-600 bg-indigo-50/10",
          },
          {
            title: "Active Action Backlog",
            value: insights.pending_interventions,
            caption: "Identified risk cases pending review.",
            bg: "border-t-amber-500 text-amber-600 bg-amber-50/10",
          },
        ].map((kpi, i) => (
          <div
            key={i}
            className={`bg-white rounded-xl border border-slate-200 p-5 shadow-sm border-t-4 ${kpi.bg} print-border flex flex-col justify-between`}
          >
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono leading-tight print:text-slate-500">
                {kpi.title}
              </p>
              <p className="text-3xl font-black mt-2 tracking-tight print:text-slate-900">
                {kpi.value}
              </p>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-3 leading-snug border-t border-slate-100/80 pt-2 print:text-slate-500 print:border-slate-200">
              {kpi.caption}
            </p>
          </div>
        ))}
      </div>

      {/* Hybrid Visual Charts Row (SVG Native Charts customized for clean, multi-colored differentiation) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 print-grid-2 print-avoid-break">
        {/* SVG Component: Donut Ratio Configuration */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm print-border">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Macro Student Engagement Profile
            </h3>
            <p className="text-xs text-slate-400">
              Proportional representation of happy vs unhappy metrics.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-4">
            <div className="relative w-32 h-32 flex items-center justify-center flex-shrink-0">
              <svg
                viewBox="0 0 36 36"
                className="w-full h-full transform -rotate-90"
              >
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="none"
                  stroke="#f1f5f9"
                  strokeWidth="4"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="4"
                  strokeDasharray={`${satisfactionIndex} ${100 - satisfactionIndex}`}
                  strokeDashoffset="0"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-xl font-black tracking-tight text-slate-800">
                  {satisfactionIndex}%
                </span>
                <span className="block text-[9px] font-bold text-slate-400 font-mono uppercase">
                  Positive
                </span>
              </div>
            </div>

            <div className="space-y-3 w-full sm:max-w-xs text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/40 border border-emerald-100/50 print:bg-transparent print:border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="font-bold text-slate-700">
                    Satisfied Learners
                  </span>
                </div>
                <span className="font-mono font-black text-emerald-700 print:text-slate-900">
                  {insights.happy_students}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-rose-50/40 border border-rose-100/50 print:bg-transparent print:border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  <span className="font-bold text-slate-700">
                    Outlier / Risk Status
                  </span>
                </div>
                <span className="font-mono font-black text-rose-600 print:text-slate-900">
                  {insights.unhappy_students}
                </span>
              </div>
              <div className="border-t border-slate-100 pt-2 flex justify-between text-slate-400 font-semibold px-1 print:border-slate-200">
                <span>Total Sample Pool:</span>
                <span className="font-mono font-bold text-slate-700">
                  {insights.total_students}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SVG Component: Dynamic Distinct Colored Bar Charting */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm print-border">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Influencer Distribution Vector
            </h3>
            <p className="text-xs text-slate-400">
              Comparative scaling of real enrollment driver vectors.
            </p>
          </div>

          <div className="space-y-3.5">
            {insights.influencer_distribution.map((item, index) => {
              const barWidth = Math.max(
                5,
                Math.round((item.count / maxInfluencerCount) * 100),
              );
              // Pick an isolated clear color configuration mapped to sequential data entries
              const colorClass = CHART_COLORS[index % CHART_COLORS.length];

              return (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-sm ${colorClass}`}
                      ></span>
                      {item.influencer}
                    </span>
                    <span className="font-mono text-slate-500 print:text-black font-bold">
                      {item.count} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/30 print:border-slate-300">
                    <div
                      className={`h-full rounded-full ${colorClass} transition-all duration-500`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {!insights.influencer_distribution.length && (
              <p className="text-xs text-slate-400 italic text-center py-6">
                No data vectors parsed for current state filters.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Audit Matrix Tabular Segment */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden print-avoid-break print-border">
        <div className="p-5 border-b border-slate-200 bg-slate-50/50 print:bg-transparent print:border-slate-300">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            Departmental Vulnerability Risk Log
          </h3>
          <p className="text-xs text-slate-400">
            Tabular analytics framework mapping core institutional risk
            environments.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100/80 text-slate-600 font-bold uppercase tracking-wider font-mono print:bg-transparent print:border-slate-300">
                <th className="p-3.5 pl-5">Academic Division Name</th>
                <th className="p-3.5 text-center">Identified Action Cases</th>
                <th className="p-3.5 text-center">Total Registered Pool</th>
                <th className="p-3.5 text-right pr-5">
                  Computed Risk Magnitude
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700 print:divide-slate-200">
              {insights.departmental_risk.map((dept, index) => (
                <tr
                  key={index}
                  className="hover:bg-slate-50/60 transition-colors print-table-row"
                >
                  <td className="p-3.5 pl-5 font-bold text-slate-900">
                    {dept.name}
                  </td>
                  <td className="p-3.5 text-center font-mono text-slate-700 font-semibold">
                    {dept.unhappy}
                  </td>
                  <td className="p-3.5 text-center font-mono text-slate-500">
                    {dept.total}
                  </td>
                  <td className="p-3.5 text-right pr-5">
                    <span
                      className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                        dept.risk_level > 40
                          ? "bg-rose-50 text-rose-700 print:text-rose-700"
                          : "bg-slate-100 text-slate-800 print:text-slate-900"
                      } print:bg-transparent print:p-0`}
                    >
                      {dept.risk_level}%
                    </span>
                  </td>
                </tr>
              ))}
              {!insights.departmental_risk.length && (
                <tr>
                  <td
                    colSpan={4}
                    className="p-6 text-center text-slate-400 italic"
                  >
                    No departmental matrix entries match current query bounds.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Corporate Compliance Sign-Off Area */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm print-avoid-break print-border print-full-width">
        <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 font-mono">
          Governance Compliance Ledger
        </h4>
        <p className="mt-1 text-xs text-slate-400 leading-relaxed max-w-4xl print:text-slate-600">
          The structural summaries compiled above represent authorized system
          computations. All derived index numbers and data ratios comply
          directly with TVET governance rules, verified on-demand for formal HOD
          and executive review.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 print-grid-2">
          <div className="rounded-lg border border-dashed border-slate-200 p-4 bg-slate-50/30 print:border-slate-300">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono print:text-slate-700">
              Authorized Controller Signature
            </p>
            <div className="h-8 my-2 border-b border-slate-200/60 no-print"></div>
            <p className="text-[9px] text-slate-400 mt-5 italic print:text-slate-500">
              Signed copy retains audit footprint validity parameters.
            </p>
          </div>
          <div className="rounded-lg border border-dashed border-slate-200 p-4 bg-slate-50/30 print:border-slate-300">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono print:text-slate-700">
              Execution Timestamp Metadata
            </p>
            <div className="h-8 my-2 border-b border-slate-200/60 no-print"></div>
            <p className="text-[9px] text-slate-400 mt-5 font-mono print:text-slate-900">
              System Clock: {new Date().toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
