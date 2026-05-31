import { useState, useEffect, useCallback, useMemo } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import api from "./api";
import Landing from "./pages/Landing";
import CareerGuidance from "./pages/CareerGuidance";
import Counselling from "./pages/Counselling";
import Clubs from "./pages/Clubs";
import Analytics from "./components/career/CareerAnalytics";
import Interventions from "./components/career/Interventions";
import JobPlacement from "./components/career/JobPlacement";
import StudentDashboard from "./pages/StudentDashboard";

// ── CONFIGURATION CONSTANTS ──────────────────────────────────────────────────
const BRAND = "#0a6e4e";
const BRAND_LIGHT = "#e6f4ef";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "📊", path: "/dashboard" },
  { id: "departments", label: "Departments", icon: "🏛️", path: "/departments" },
  { id: "courses", label: "Courses", icon: "📚", path: "/courses" },
  { id: "students", label: "Students", icon: "🎓", path: "/students" },
  { id: "career", label: "Career Guidance", icon: "🧭", path: "/career" },
  { id: "counselling", label: "Counselling", icon: "💬", path: "/counselling" },
  { id: "clubs", label: "Clubs & Societies", icon: "🤝", path: "/clubs" },
  { id: "certifications", label: "Certifications", icon: "📜", path: "/certifications" },
  { id: "staff", label: "Staff", icon: "👩‍🏫", path: "/staff" },
  { id: "analytics", label: "Analytics", icon: "📈", path: "/analytics" },
  { id: "interventions", label: "Interventions", icon: "🆘", path: "/interventions" },
  { id: "job-placements", label: "Job Placements", icon: "💼", path: "/job-placements" },
];

const SATISFACTION_COLORS = {
  Happy: "#16a34a",
  Neutral: "#d97706",
  Unhappy: "#dc2626",
};
const SATISFACTION_BG = {
  Happy: "#dcfce7",
  Neutral: "#fef3c7",
  Unhappy: "#fee2e2",
};

// ── REUSABLE UI COMPONENTS ──────────────────────────────────────────────────
function StatCard({ label, value, sub, color = BRAND }) {
  return (
    <div
      style={{
        background: "#f8faf9",
        borderRadius: 10,
        padding: "14px 18px",
        minWidth: 110,
        border: "0.5px solid #e5e7eb",
      }}
    >
      <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontSize: 26, fontWeight: 600, color }}>{value}</div>
      {sub && (
        <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>
          {sub}
        </div>
      )}
    </div>
  );
}

function Badge({ label, color, bg }) {
  return (
    <span
      style={{
        background: bg || "#e5e7eb",
        color: color || "#374151",
        borderRadius: 99,
        padding: "2px 10px",
        fontSize: 11,
        fontWeight: 500,
      }}
    >
      {label}
    </span>
  );
}

function SectionHeader({ title, action, onAction }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
      }}
    >
      <h2
        style={{ margin: 0, fontSize: 17, fontWeight: 600, color: "#111827" }}
      >
        {title}
      </h2>
      {action && (
        <button
          onClick={onAction}
          style={{
            background: BRAND,
            color: "#fff",
            border: "none",
            borderRadius: 7,
            padding: "7px 16px",
            fontSize: 13,
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          + {action}
        </button>
      )}
    </div>
  );
}

// ── PAGES ────────────────────────────────────────────────────────────────────
function Dashboard({ dbData }) {
  const studentsArr = Array.isArray(dbData?.students) ? dbData.students : [];
  const deptsArr = Array.isArray(dbData?.departments) ? dbData.departments : [];
  const coursesArr = Array.isArray(dbData?.courses) ? dbData.courses : [];
  const staffArr = Array.isArray(dbData?.staff) ? dbData.staff : [];

  const totalStudents = studentsArr.length;
  const totalDepts = deptsArr.length;
  const totalCourses = coursesArr.length;
  const totalStaff = staffArr.length;

  const totalSurveyed = totalStudents || 1;
  const happyPct = Math.round(
    (studentsArr.filter((s) => (s?.satisfaction || "Happy") === "Happy")
      .length /
      totalSurveyed) *
      100,
  );
  const neutralPct = Math.round(
    (studentsArr.filter((s) => s?.satisfaction === "Neutral").length /
      totalSurveyed) *
      100,
  );
  const unhappyCount = studentsArr.filter(
    (s) => s?.satisfaction === "Unhappy",
  ).length;
  const unhappyPct = Math.round((unhappyCount / totalSurveyed) * 100);

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1
          style={{
            margin: "0 0 4px",
            fontSize: 22,
            fontWeight: 700,
            color: "#111827",
          }}
        >
          Welcome, Career Guidance Office
        </h1>
        <p style={{ margin: 0, color: "#6b7280", fontSize: 14 }}>
          Mago TVTC — Live Operational Dashboard
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
          gap: 12,
          marginBottom: 24,
        }}
      >
        <StatCard
          label="Total students"
          value={totalStudents}
          sub="Database rows"
        />
        <StatCard label="Departments" value={totalDepts} sub="Resource units" />
        <StatCard label="Courses offered" value={totalCourses} sub="Programs" />
        <StatCard
          label="Staff members"
          value={totalStaff}
          sub="Roster profiles"
        />
        <StatCard
          label="Employment rate"
          value="78%"
          sub="Target baseline"
          color="#16a34a"
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            background: "#fff",
            border: "0.5px solid #e5e7eb",
            borderRadius: 12,
            padding: "18px 20px",
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#374151",
              marginBottom: 14,
            }}
          >
            Live Course Satisfaction
          </div>
          {[
            ["Happy with course", happyPct, "#16a34a"],
            ["Neutral / unsure", neutralPct, "#d97706"],
            ["Unhappy — needs intervention", unhappyPct, "#dc2626"],
          ].map(([label, pct, c]) => (
            <div key={label} style={{ marginBottom: 10 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 12,
                  marginBottom: 4,
                }}
              >
                <span style={{ color: "#374151" }}>{label}</span>
                <span style={{ fontWeight: 600, color: c }}>{pct || 0}%</span>
              </div>
              <div
                style={{ height: 8, background: "#f3f4f6", borderRadius: 99 }}
              >
                <div
                  style={{
                    height: 8,
                    background: c,
                    borderRadius: 99,
                    width: `${pct || 0}%`,
                    transition: "width 0.4s",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            background: "#fff",
            border: "0.5px solid #e5e7eb",
            borderRadius: 12,
            padding: "18px 20px",
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#374151",
              marginBottom: 14,
            }}
          >
            Students by Department
          </div>
          {deptsArr.length === 0 ? (
            <div style={{ fontSize: 12, color: "#9ca3af" }}>
              No department profiles registered.
            </div>
          ) : (
            deptsArr.map((d) => {
              const count =
                studentsArr.filter(
                  (s) => (s?.course?.department_id || s?.course?.department?.id) === d?.id || s?.dept === d?.name,
                ).length || 0;
              return (
                <div
                  key={d?.id || d?.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 10,
                  }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 3,
                      background: BRAND,
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: 12, color: "#374151", flex: 1 }}>
                    {d?.name || "Unnamed Unit"}
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: BRAND }}>
                    {count}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

function Departments({ dbData, onRefresh, headers }) {
  const [showForm, setShowForm] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [form, setForm] = useState({
    name: "",
    code: "",
    hod_id: "",
    color: "",
  });
  const deptsArr = Array.isArray(dbData?.departments) ? dbData.departments : [];
  const staffArr = Array.isArray(dbData?.staff) ? dbData.staff : [];

  const resetForm = () => {
    setForm({ name: "", code: "", hod_id: "", color: "" });
    setEditingDepartment(null);
    setShowForm(false);
  };

  const handleSave = async () => {
    const method = editingDepartment ? "PUT" : "POST";
    const url = editingDepartment
      ? `/api/departments/${editingDepartment.id}`
      : "/api/departments";

    const payload = {
      name: form.name,
      code: form.code,
      ...(form.hod_id ? { hod_id: form.hod_id } : {}),
      ...(form.color ? { color: form.color } : {}),
    };

    await fetch(url, {
      method,
      headers,
      body: JSON.stringify(payload),
    });

    onRefresh();
    resetForm();
  };

  const startEdit = (department) => {
    setEditingDepartment(department);
    setForm({
      name: department?.name || "",
      code: department?.code || "",
      hod_id: department?.hod?.id || "",
      color: department?.color || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (department) => {
    if (!window.confirm("Delete this department?")) return;

    await fetch(`/api/departments/${department.id}`, {
      method: "DELETE",
      headers,
    });

    onRefresh();
  };

  return (
    <div>
      <SectionHeader
        title="Departments"
        action={editingDepartment ? "Edit Department" : "Add Department"}
        onAction={() => {
          if (showForm && !editingDepartment) {
            setShowForm(false);
          } else {
            resetForm();
            setShowForm(true);
          }
        }}
      />
      {showForm && (
        <div
          style={{
            background: "#f0faf6",
            border: "0.5px solid #a7f3d0",
            borderRadius: 10,
            padding: 18,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 12,
            }}
          >
            <div>
              <label
                style={{
                  fontSize: 12,
                  color: "#374151",
                  display: "block",
                  marginBottom: 4,
                }}
              >
                Department name
              </label>
              <input
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                style={{
                  width: "100%",
                  padding: "7px 10px",
                  border: "0.5px solid #d1d5db",
                  borderRadius: 7,
                  fontSize: 13,
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div>
              <label
                style={{
                  fontSize: 12,
                  color: "#374151",
                  display: "block",
                  marginBottom: 4,
                }}
              >
                Department code
              </label>
              <input
                value={form.code}
                onChange={(e) =>
                  setForm((f) => ({ ...f, code: e.target.value }))
                }
                style={{
                  width: "100%",
                  padding: "7px 10px",
                  border: "0.5px solid #d1d5db",
                  borderRadius: 7,
                  fontSize: 13,
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div>
              <label
                style={{
                  fontSize: 12,
                  color: "#374151",
                  display: "block",
                  marginBottom: 4,
                }}
              >
                HOD
              </label>
              <select
                value={form.hod_id}
                onChange={(e) =>
                  setForm((f) => ({ ...f, hod_id: e.target.value }))
                }
                style={{
                  width: "100%",
                  padding: "7px 10px",
                  border: "0.5px solid #d1d5db",
                  borderRadius: 7,
                  fontSize: 13,
                  boxSizing: "border-box",
                }}
              >
                <option value="">No HOD assigned</option>
                {staffArr.map((staff) => (
                  <option key={staff.id} value={staff.id}>
                    {staff.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                style={{
                  fontSize: 12,
                  color: "#374151",
                  display: "block",
                  marginBottom: 4,
                }}
              >
                Brand color
              </label>
              <input
                type="color"
                value={form.color || "#0a6e4e"}
                onChange={(e) =>
                  setForm((f) => ({ ...f, color: e.target.value }))
                }
                style={{
                  width: "100%",
                  padding: "7px 10px",
                  border: "0.5px solid #d1d5db",
                  borderRadius: 7,
                  fontSize: 13,
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <button
              onClick={handleSave}
              style={{
                background: BRAND,
                color: "#fff",
                border: "none",
                borderRadius: 7,
                padding: "8px 20px",
                cursor: "pointer",
              }}
            >
              {editingDepartment ? "Update Department" : "Save Department"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              style={{
                background: "#fff",
                border: "1px solid #d1d5db",
                borderRadius: 7,
                padding: "8px 20px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 14,
        }}
      >
        {deptsArr.length === 0 ? (
          <div style={{ color: "#6b7280", fontSize: 13, padding: 8 }}>
            No active database records found. Click "+ Add Department" above to
            save one.
          </div>
        ) : (
          deptsArr.map((d) => (
            <div
              key={d?.id}
              style={{
                background: "#fff",
                border: "0.5px solid #e5e7eb",
                borderRadius: 12,
                padding: "18px 20px",
                borderTop: `4px solid ${d?.color || BRAND}`,
              }}
            >
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#111827",
                  marginBottom: 4,
                }}
              >
                {d?.name}
              </div>
              <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 14 }}>
                HOD: {d?.hod?.name || "Unassigned"}
              </div>
              <div style={{ fontSize: 11, color: "#9ca3af" }}>
                Code:{" "}
                <span style={{ fontFamily: "monospace" }}>
                  {d?.code || "—"}
                </span>
              </div>
              <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
                <button
                  type="button"
                  onClick={() => startEdit(d)}
                  style={{
                    background: "#eef2ff",
                    border: "none",
                    borderRadius: 7,
                    color: "#1d4ed8",
                    padding: "8px 12px",
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(d)}
                  style={{
                    background: "#fee2e2",
                    border: "none",
                    borderRadius: 7,
                    color: "#b91c1c",
                    padding: "8px 12px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function Courses({ dbData, onRefresh, headers }) {
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [form, setForm] = useState({
    department_id: "",
    certification_id: "",
    certification_level_id: "",
    name: "",
    duration: "",
  });
  const coursesArr = Array.isArray(dbData?.courses) ? dbData.courses : [];
  const departmentsArr = Array.isArray(dbData?.departments) ? dbData.departments : [];
  const certificationsArr = Array.isArray(dbData?.certifications) ? dbData.certifications : [];
  
  const selectedCertification = certificationsArr.find(c => String(c.id) === String(form.certification_id));
  const levelsArr = selectedCertification?.levels || [];

  const resetForm = () => {
    setForm({
      department_id: "",
      certification_id: "",
      certification_level_id: "",
      name: "",
      duration: "",
    });
    setEditingCourse(null);
    setShowForm(false);
  };

  const handleSave = async () => {
    const method = editingCourse ? "PUT" : "POST";
    const url = editingCourse ? `/api/courses/${editingCourse.id}` : "/api/courses";

    await fetch(url, {
      method,
      headers,
      body: JSON.stringify({
        department_id: form.department_id,
        certification_level_id: form.certification_level_id,
        name: form.name,
        duration: form.duration,
      }),
    });

    onRefresh();
    resetForm();
  };

  const startEdit = (course) => {
    setEditingCourse(course);
    setForm({
      department_id: course?.department_id || "",
      certification_id: course?.certification_level?.certification_id || "",
      certification_level_id: course?.certification_level_id || "",
      name: course?.name || "",
      duration: course?.duration || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (course) => {
    if (!window.confirm("Delete this course?")) return;
    await fetch(`/api/courses/${course.id}`, {
      method: "DELETE",
      headers,
    });
    onRefresh();
  };

  const handleLevelChange = (levelId) => {
    const level = levelsArr.find(l => String(l.id) === String(levelId));
    setForm(f => ({
      ...f,
      certification_level_id: levelId,
      duration: level ? `${level.period_count} ${level.duration_type}` : f.duration
    }));
  };

  return (
    <div>
      <SectionHeader
        title="Active Curriculum Programs"
        action="Add Course"
        onAction={() => {
          if (showForm && !editingCourse) {
            setShowForm(false);
          } else {
            setEditingCourse(null);
            setForm({
              department_id: "",
              certification_id: "",
              certification_level_id: "",
              name: "",
              duration: "",
            });
            setShowForm(true);
          }
        }}
      />
      {showForm && (
        <div
          style={{
            background: "#f0faf6",
            border: "0.5px solid #a7f3d0",
            borderRadius: 10,
            padding: 18,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
            }}
          >
            <div>
              <label style={{ fontSize: 12, color: "#374151", display: "block", marginBottom: 4 }}>Department</label>
              <select
                value={form.department_id}
                onChange={(e) => setForm((f) => ({ ...f, department_id: e.target.value }))}
                style={{ width: "100%", padding: "7px 10px", border: "0.5px solid #d1d5db", borderRadius: 7, fontSize: 13, boxSizing: "border-box" }}
              >
                <option value="">Select Department...</option>
                {departmentsArr.map((dept) => <option key={dept.id} value={dept.id}>{dept.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, color: "#374151", display: "block", marginBottom: 4 }}>Certification Authority</label>
              <select
                value={form.certification_id}
                onChange={(e) => setForm((f) => ({ ...f, certification_id: e.target.value, certification_level_id: "" }))}
                style={{ width: "100%", padding: "7px 10px", border: "0.5px solid #d1d5db", borderRadius: 7, fontSize: 13, boxSizing: "border-box" }}
              >
                <option value="">Select Certification...</option>
                {certificationsArr.map((cert) => <option key={cert.id} value={cert.id}>{cert.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, color: "#374151", display: "block", marginBottom: 4 }}>Level / Grade</label>
              <select
                value={form.certification_level_id}
                onChange={(e) => handleLevelChange(e.target.value)}
                disabled={!form.certification_id}
                style={{ width: "100%", padding: "7px 10px", border: "0.5px solid #d1d5db", borderRadius: 7, fontSize: 13, boxSizing: "border-box" }}
              >
                <option value="">Select Level...</option>
                {levelsArr.map((lvl) => <option key={lvl.id} value={lvl.id}>{lvl.name}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12, marginTop: 12 }}>
            <div>
              <label style={{ fontSize: 12, color: "#374151", display: "block", marginBottom: 4 }}>Course Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Solar Systems Engineering"
                style={{ width: "100%", padding: "7px 10px", border: "0.5px solid #d1d5db", borderRadius: 7, fontSize: 13, boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "#374151", display: "block", marginBottom: 4 }}>Duration Override</label>
              <input
                value={form.duration}
                onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
                placeholder="e.g. 24 Months"
                style={{ width: "100%", padding: "7px 10px", border: "0.5px solid #d1d5db", borderRadius: 7, fontSize: 13, boxSizing: "border-box" }}
              />
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <button
              onClick={handleSave}
              disabled={!form.department_id || !form.certification_level_id || !form.name}
              style={{ background: BRAND, color: "#fff", border: "none", borderRadius: 7, padding: "8px 20px", cursor: "pointer", opacity: (!form.department_id || !form.certification_level_id || !form.name) ? 0.6 : 1 }}
            >
              {editingCourse ? "Update Course" : "Save Course"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              style={{ background: "#fff", border: "1px solid #d1d5db", borderRadius: 7, padding: "8px 20px", cursor: "pointer" }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f9fafb" }}>
              {["Course Name", "Certification", "Level", "Duration", "Actions"].map((h) => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", color: "#6b7280", borderBottom: "0.5px solid #e5e7eb" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {coursesArr.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: 14, color: "#9ca3af", textAlign: "center" }}>No catalog rows returned.</td></tr>
            ) : (
              coursesArr.map((c) => (
                <tr key={c?.id} style={{ borderBottom: "0.5px solid #f3f4f6" }}>
                  <td style={{ padding: "10px 14px", fontWeight: 500 }}>{c?.name}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <Badge
                      label={c?.certification_level?.certification?.acronym || c?.certification_level?.certification?.name || "N/A"}
                      color="#1a6eb5"
                      bg="#dbeafe"
                    />
                  </td>
                  <td style={{ padding: "10px 14px", color: "#6b7280" }}>{c?.certification_level?.name || "—"}</td>
                  <td style={{ padding: "10px 14px" }}>{c?.duration || "Modular"}</td>
                  <td style={{ padding: "10px 14px", display: "flex", gap: 6 }}>
                    <button type="button" onClick={() => startEdit(c)} style={{ background: "#eef2ff", border: "none", borderRadius: 6, color: "#1d4ed8", padding: "6px 10px", cursor: "pointer" }}>Edit</button>
                    <button type="button" onClick={() => handleDelete(c)} style={{ background: "#fee2e2", border: "none", borderRadius: 6, color: "#b91c1c", padding: "6px 10px", cursor: "pointer" }}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Students({ dbData, onRefresh, headers }) {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [form, setForm] = useState({
    id: "",
    course_id: "",
    name: "",
    national_id_or_birth_cert: "",
    phone: "",
    county: "",
    gender: "Male",
    intake_year: new Date().getFullYear().toString(),
  });
  const studentsArr = Array.isArray(dbData?.students) ? dbData.students : [];
  const coursesArr = Array.isArray(dbData?.courses) ? dbData.courses : [];

  const filtered = studentsArr.filter(
    (s) =>
      s?.name?.toLowerCase().includes(search.toLowerCase()) ||
      s?.admission_number?.toLowerCase().includes(search.toLowerCase()),
  );

  const resetForm = () => {
    setForm({
      id: "",
      course_id: "",
      name: "",
      national_id_or_birth_cert: "",
      phone: "",
      county: "",
      gender: "Male",
      intake_year: new Date().getFullYear().toString(),
    });
    setEditingStudent(null);
    setShowForm(false);
  };

  const handleSave = () => {
    const method = editingStudent ? "PUT" : "POST";
    const url = editingStudent
      ? `/api/students/${editingStudent.id}`
      : "/api/students";

    const payload = editingStudent
      ? {
          course_id: form.course_id || undefined,
          name: form.name || undefined,
          national_id_or_birth_cert:
            form.national_id_or_birth_cert || undefined,
          phone: form.phone || undefined,
          county: form.county || undefined,
          gender: form.gender || undefined,
          intake_year: form.intake_year
            ? parseInt(form.intake_year, 10)
            : undefined,
        }
      : {
          id: form.id,
          course_id: form.course_id,
          name: form.name,
          national_id_or_birth_cert: form.national_id_or_birth_cert,
          phone: form.phone,
          county: form.county,
          gender: form.gender,
          intake_year: parseInt(form.intake_year, 10),
        };

    fetch(url, {
      method,
      headers,
      body: JSON.stringify(payload),
    }).then(() => {
      onRefresh();
      resetForm();
    });
  };

  const startEdit = (student) => {
    setEditingStudent(student);
    setForm({
      id: student?.id || "",
      course_id: student?.course_id || "",
      name: student?.name || "",
      national_id_or_birth_cert: student?.national_id_or_birth_cert || "",
      phone: student?.phone || "",
      county: student?.county || "",
      gender: student?.gender || "Male",
      intake_year:
        student?.intake_year?.toString() || new Date().getFullYear().toString(),
    });
    setShowForm(true);
  };

  const handleDelete = (student) => {
    if (!window.confirm("Delete this student record?")) return;
    fetch(`/api/students/${student.id}`, {
      method: "DELETE",
      headers,
    }).then(() => onRefresh());
  };

  return (
    <div>
      <SectionHeader
        title="Student Records Registry"
        action="Enrol Student"
        onAction={() => {
          if (showForm && !editingStudent) {
            setShowForm(false);
          } else {
            resetForm(); // We can call resetForm here because we are setting showForm(true) immediately after
            setShowForm(true);
          }
        }}
      />
      {showForm && (
        <div
          style={{
            background: "#f0faf6",
            border: "0.5px solid #a7f3d0",
            borderRadius: 10,
            padding: 18,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr 1fr",
              gap: 12,
            }}
          >
            {!editingStudent && (
              <input
                placeholder="Admission ID"
                value={form.id}
                onChange={(e) => setForm({ ...form, id: e.target.value })}
                style={{
                  padding: 8,
                  borderRadius: 7,
                  border: "1px solid #d1d5db",
                }}
              />
            )}
            <select
              value={form.course_id}
              onChange={(e) => setForm({ ...form, course_id: e.target.value })}
              style={{
                padding: 8,
                borderRadius: 7,
                border: "1px solid #d1d5db",
              }}
            >
              <option value="">Select Course</option>
              {coursesArr.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
            <input
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={{
                padding: 8,
                borderRadius: 7,
                border: "1px solid #d1d5db",
              }}
            />
            <input
              placeholder="National ID / Birth cert"
              value={form.national_id_or_birth_cert}
              onChange={(e) =>
                setForm({ ...form, national_id_or_birth_cert: e.target.value })
              }
              style={{
                padding: 8,
                borderRadius: 7,
                border: "1px solid #d1d5db",
              }}
            />
            <input
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              style={{
                padding: 8,
                borderRadius: 7,
                border: "1px solid #d1d5db",
              }}
            />
            <input
              placeholder="County"
              value={form.county}
              onChange={(e) => setForm({ ...form, county: e.target.value })}
              style={{
                padding: 8,
                borderRadius: 7,
                border: "1px solid #d1d5db",
              }}
            />
            <select
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
              style={{
                padding: 8,
                borderRadius: 7,
                border: "1px solid #d1d5db",
              }}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <input
              type="number"
              min="2000"
              max="2100"
              placeholder="Intake Year"
              value={form.intake_year}
              onChange={(e) =>
                setForm({ ...form, intake_year: e.target.value })
              }
              style={{
                padding: 8,
                borderRadius: 7,
                border: "1px solid #d1d5db",
              }}
            />
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <button
              onClick={handleSave}
              style={{
                background: BRAND,
                color: "#fff",
                border: "none",
                borderRadius: 7,
                padding: "8px 20px",
                cursor: "pointer",
              }}
            >
              {editingStudent ? "Update Record" : "Commit Record"}
            </button>
            {editingStudent && (
              <button
                type="button"
                onClick={resetForm}
                style={{
                  background: "#fff",
                  border: "1px solid #d1d5db",
                  borderRadius: 7,
                  padding: "8px 20px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search repository..."
        style={{
          width: "100%",
          padding: "9px 14px",
          border: "0.5px solid #d1d5db",
          borderRadius: 8,
          marginBottom: 14,
        }}
      />
      <div style={{ overflowX: "auto" }}>
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
        >
          <thead>
            <tr style={{ background: "#f9fafb" }}>
              {[
                "Adm No.",
                "Name",
                "County",
                "Contact",
                "Satisfaction",
                "Status",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "10px 14px",
                    textAlign: "left",
                    color: "#6b7280",
                    borderBottom: "0.5px solid #e5e7eb",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  style={{ padding: 14, textAlign: "center", color: "#9ca3af" }}
                >
                  No student records discovered.
                </td>
              </tr>
            ) : (
              filtered.map((s) => (
                <tr key={s?.id} style={{ borderBottom: "0.5px solid #f3f4f6" }}>
                  <td style={{ padding: "10px 14px", fontFamily: "monospace" }}>
                    {s?.admission_number || `SIS-${s?.id}`}
                  </td>
                  <td style={{ padding: "10px 14px", fontWeight: 500 }}>
                    {s?.name}
                  </td>
                  <td style={{ padding: "10px 14px" }}>{s?.county || "—"}</td>
                  <td style={{ padding: "10px 14px" }}>{s?.phone || "—"}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <Badge
                      label={s?.satisfaction || "Happy"}
                      color={SATISFACTION_COLORS[s?.satisfaction || "Happy"]}
                      bg={SATISFACTION_BG[s?.satisfaction || "Happy"]}
                    />
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    <Badge
                      label={s?.status || "Active"}
                      color="#16a34a"
                      bg="#dcfce7"
                    />
                  </td>
                  <td style={{ padding: "10px 14px", display: "flex", gap: 6 }}>
                    <button
                      type="button"
                      onClick={() => startEdit(s)}
                      style={{
                        background: "#eef2ff",
                        border: "none",
                        borderRadius: 6,
                        color: "#1d4ed8",
                        padding: "6px 10px",
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(s)}
                      style={{
                        background: "#fee2e2",
                        border: "none",
                        borderRadius: 6,
                        color: "#b91c1c",
                        padding: "6px 10px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Placeholder components removed in favor of imported specialized pages

function Staff({ dbData, onRefresh, headers }) {
  const [showForm, setShowForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role_title: "Teacher",
    department_id: "",
  });
  const staffArr = Array.isArray(dbData?.staff) ? dbData.staff : [];
  const depts = Array.isArray(dbData?.departments) ? dbData.departments : [];

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
      role_title: "Teacher",
      department_id: "",
    });
    setEditingStaff(null);
    setShowForm(false);
  };

  const handleSave = () => {
    const method = editingStaff ? "PUT" : "POST";
    const url = editingStaff ? `/api/staff/${editingStaff.id}` : "/api/staff";

    fetch(url, {
      method,
      headers,
      body: JSON.stringify(form),
    }).then(() => {
      onRefresh();
      resetForm();
    });
  };

  const startEdit = (staff) => {
    setEditingStaff(staff);
    setForm({
      name: staff?.name || "",
      email: staff?.email || "",
      phone: staff?.phone || "",
      role_title: staff?.role_title || "Teacher",
      department_id: staff?.department_id || "",
    });
    setShowForm(true);
  };

  const handleDelete = (staff) => {
    if (!window.confirm("Delete this staff profile?")) return;
    fetch(`/api/staff/${staff.id}`, {
      method: "DELETE",
      headers,
    }).then(() => onRefresh());
  };

  return (
    <div>
      <SectionHeader
        title="Faculty & Structural Staff"
        action="Add Staff Member"
        onAction={() => {
          setShowForm((s) => !s);
          if (!showForm) resetForm();
        }}
      />

      {showForm && (
        <div
          style={{
            background: "#f0faf6",
            border: "0.5px solid #a7f3d0",
            borderRadius: 10,
            padding: 18,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
            }}
          >
            <div>
              <label
                style={{
                  fontSize: 12,
                  color: "#374151",
                  display: "block",
                  marginBottom: 4,
                }}
              >
                Full Name
              </label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={{
                  width: "100%",
                  padding: "7px 10px",
                  border: "0.5px solid #d1d5db",
                  borderRadius: 7,
                }}
              />
            </div>
            <div>
              <label
                style={{
                  fontSize: 12,
                  color: "#374151",
                  display: "block",
                  marginBottom: 4,
                }}
              >
                Email
              </label>
              <input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                style={{
                  width: "100%",
                  padding: "7px 10px",
                  border: "0.5px solid #d1d5db",
                  borderRadius: 7,
                }}
              />
            </div>
            <div>
              <label
                style={{
                  fontSize: 12,
                  color: "#374151",
                  display: "block",
                  marginBottom: 4,
                }}
              >
                Phone
              </label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                style={{
                  width: "100%",
                  padding: "7px 10px",
                  border: "0.5px solid #d1d5db",
                  borderRadius: 7,
                }}
              />
            </div>
            <div>
              <label
                style={{
                  fontSize: 12,
                  color: "#374151",
                  display: "block",
                  marginBottom: 4,
                }}
              >
                Role Title
              </label>
              <select
                value={form.role_title}
                onChange={(e) =>
                  setForm({ ...form, role_title: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "7px 10px",
                  border: "0.5px solid #d1d5db",
                  borderRadius: 7,
                }}
              >
                <option>Teacher</option>
                <option>HOD</option>
                <option>Counsellor</option>
                <option>Principal</option>
                <option>Dean</option>
              </select>
            </div>
            <div>
              <label
                style={{
                  fontSize: 12,
                  color: "#374151",
                  display: "block",
                  marginBottom: 4,
                }}
              >
                Department
              </label>
              <select
                value={form.department_id}
                onChange={(e) =>
                  setForm({ ...form, department_id: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "7px 10px",
                  border: "0.5px solid #d1d5db",
                  borderRadius: 7,
                }}
              >
                <option value="">Select Dept...</option>
                {depts.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <button
              onClick={handleSave}
              style={{
                background: BRAND,
                color: "#fff",
                border: "none",
                borderRadius: 7,
                padding: "8px 20px",
                cursor: "pointer",
              }}
            >
              {editingStaff ? "Update Staff Member" : "Save Staff Member"}
            </button>
            {editingStaff && (
              <button
                type="button"
                onClick={resetForm}
                style={{
                  background: "#fff",
                  border: "1px solid #d1d5db",
                  borderRadius: 7,
                  padding: "8px 20px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}

      <div
        style={{
          background: "#fff",
          border: "0.5px solid #e5e7eb",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        {staffArr.length === 0 ? (
          <div style={{ padding: 16, color: "#6b7280" }}>
            No roster entries returned from database layers.
          </div>
        ) : (
          staffArr.map((st) => (
            <div
              key={st?.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 10,
                padding: "12px 16px",
                borderBottom: "0.5px solid #f3f4f6",
              }}
            >
              <div>
                <div style={{ fontWeight: 500 }}>{st?.name}</div>
                <div style={{ fontSize: 11, color: "#6b7280" }}>
                  {st?.email || "Academic Network Account"} · {st?.phone}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <button
                  type="button"
                  onClick={() => startEdit(st)}
                  style={{
                    background: "#eef2ff",
                    border: "none",
                    borderRadius: 6,
                    color: "#1d4ed8",
                    padding: "6px 10px",
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(st)}
                  style={{
                    background: "#fee2e2",
                    border: "none",
                    borderRadius: 6,
                    color: "#b91c1c",
                    padding: "6px 10px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
                <Badge
                  label={st?.role_title || "Faculty Pool"}
                  color={BRAND}
                  bg={BRAND_LIGHT}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function Certifications({ dbData, onRefresh, headers }) {
  const [showForm, setShowForm] = useState(false);
  const [showLevelForm, setShowLevelForm] = useState(false);
  const [selectedCertId, setSelectedCertId] = useState(null);
  const [editingCert, setEditingCert] = useState(null);
  const [editingLevel, setEditingLevel] = useState(null);

  const [certForm, setCertForm] = useState({ name: "", acronym: "", description: "" });
  const [levelForm, setLevelForm] = useState({ name: "", duration_type: "Months", period_count: "", default_modules_count: "1" });

  const certificationsArr = Array.isArray(dbData?.certifications) ? dbData.certifications : [];
  const selectedCert = certificationsArr.find(c => c.id === selectedCertId);

  const handleCertSave = async () => {
    const method = editingCert ? "PUT" : "POST";
    const url = editingCert ? `/api/certifications/${editingCert.id}` : "/api/certifications";
    await fetch(url, { method, headers, body: JSON.stringify(certForm) });
    onRefresh();
    setShowForm(false);
    setEditingCert(null);
    setCertForm({ name: "", acronym: "", description: "" });
  };

  const handleLevelSave = async () => {
    const method = editingLevel ? "PUT" : "POST";
    const url = editingLevel ? `/api/certification-levels/${editingLevel.id}` : "/api/certification-levels";
    await fetch(url, {
      method,
      headers,
      body: JSON.stringify({ ...levelForm, certification_id: selectedCertId })
    });
    onRefresh();
    setShowLevelForm(false);
    setEditingLevel(null);
    setLevelForm({ name: "", duration_type: "Months", period_count: "", default_modules_count: "1" });
  };

  const deleteCert = async (id) => {
    if (!window.confirm("Delete this certification authority?")) return;
    await fetch(`/api/certifications/${id}`, { method: "DELETE", headers });
    onRefresh();
    if (selectedCertId === id) setSelectedCertId(null);
  };

  const deleteLevel = async (id) => {
    if (!window.confirm("Delete this level/grade?")) return;
    await fetch(`/api/certification-levels/${id}`, { method: "DELETE", headers });
    onRefresh();
  };

  return (
    <div>
      <SectionHeader
        title="Certification Authorities"
        action="Add Authority"
        onAction={() => { setShowForm(true); setEditingCert(null); setCertForm({ name: "", acronym: "", description: "" }); }}
      />

      {showForm && (
        <div style={{ background: "#f0faf6", border: "0.5px solid #a7f3d0", borderRadius: 10, padding: 18, marginBottom: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <input placeholder="Name (e.g. TVET CDACC)" value={certForm.name} onChange={e => setCertForm({ ...certForm, name: e.target.value })} style={{ padding: 8, borderRadius: 7, border: "1px solid #d1d5db" }} />
            <input placeholder="Acronym (e.g. CDACC)" value={certForm.acronym} onChange={e => setCertForm({ ...certForm, acronym: e.target.value })} style={{ padding: 8, borderRadius: 7, border: "1px solid #d1d5db" }} />
          </div>
          <textarea placeholder="Description..." value={certForm.description} onChange={e => setCertForm({ ...certForm, description: e.target.value })} style={{ width: "100%", padding: 8, borderRadius: 7, border: "1px solid #d1d5db", marginTop: 12 }} />
          <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
            <button onClick={handleCertSave} style={{ background: BRAND, color: "#fff", border: "none", borderRadius: 7, padding: "8px 20px", cursor: "pointer" }}>Save Authority</button>
            <button onClick={() => setShowForm(false)} style={{ background: "#fff", border: "1px solid #d1d5db", borderRadius: 7, padding: "8px 20px", cursor: "pointer" }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 20 }}>
        {/* Left: Cert List */}
        <div style={{ background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
          {certificationsArr.map(cert => (
            <div
              key={cert.id}
              onClick={() => setSelectedCertId(cert.id)}
              style={{
                padding: "12px 16px",
                borderBottom: "0.5px solid #f3f4f6",
                cursor: "pointer",
                background: selectedCertId === cert.id ? BRAND_LIGHT : "transparent"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontWeight: 600 }}>{cert.acronym || cert.name}</div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={(e) => { 
                    e.stopPropagation(); 
                    setEditingCert(cert); 
                    setCertForm({
                      name: cert.name || "",
                      acronym: cert.acronym || "",
                      description: cert.description || ""
                    }); 
                    setShowForm(true); 
                  }} style={{ fontSize: 10, color: BRAND, border: "none", background: "none", cursor: "pointer" }}>Edit</button>
                  <button onClick={(e) => { e.stopPropagation(); deleteCert(cert.id); }} style={{ fontSize: 10, color: "#dc2626", border: "none", background: "none", cursor: "pointer" }}>Delete</button>
                </div>
              </div>
              <div style={{ fontSize: 11, color: "#6b7280" }}>{cert.name}</div>
            </div>
          ))}
          {certificationsArr.length === 0 && <div style={{ padding: 20, textAlign: "center", color: "#9ca3af" }}>No authorities defined.</div>}
        </div>

        {/* Right: Levels List */}
        <div style={{ background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: 12, padding: 16 }}>
          {selectedCert ? (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h4 style={{ margin: 0 }}>Levels for {selectedCert.acronym || selectedCert.name}</h4>
                <button onClick={() => { setShowLevelForm(true); setEditingLevel(null); setLevelForm({ name: "", duration_type: "Months", period_count: "", default_modules_count: "1" }); }} style={{ background: BRAND, color: "#fff", border: "none", borderRadius: 6, padding: "4px 10px", fontSize: 12, cursor: "pointer" }}>+ Add Level / Grade</button>
              </div>

              {showLevelForm && (
                <div style={{ background: "#f9fafb", padding: 12, borderRadius: 8, marginBottom: 16, border: "0.5px solid #e5e7eb" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", gap: 8 }}>
                    <div>
                      <label style={{ fontSize: 10, color: "#6b7280", display: "block", marginBottom: 2 }}>Level Name</label>
                      <input placeholder="Level 3 / GTT 1" value={levelForm.name} onChange={e => setLevelForm({ ...levelForm, name: e.target.value })} style={{ width: "100%", padding: 6, borderRadius: 5, border: "1px solid #d1d5db", fontSize: 12, boxSizing: "border-box" }} />
                    </div>
                    <div>
                      <label style={{ fontSize: 10, color: "#6b7280", display: "block", marginBottom: 2 }}>Duration Type</label>
                      <select value={levelForm.duration_type} onChange={e => setLevelForm({ ...levelForm, duration_type: e.target.value })} style={{ width: "100%", padding: 6, borderRadius: 5, border: "1px solid #d1d5db", fontSize: 12 }}>
                        <option>Years</option>
                        <option>Months</option>
                        <option>Weeks</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: 10, color: "#6b7280", display: "block", marginBottom: 2 }}>Period Count</label>
                      <input type="number" placeholder="Count" value={levelForm.period_count} onChange={e => setLevelForm({ ...levelForm, period_count: e.target.value })} style={{ width: "100%", padding: 6, borderRadius: 5, border: "1px solid #d1d5db", fontSize: 12, boxSizing: "border-box" }} />
                    </div>
                    <div>
                      <label style={{ fontSize: 10, color: "#6b7280", display: "block", marginBottom: 2 }}>Modules</label>
                      <input type="number" placeholder="Modules" value={levelForm.default_modules_count} onChange={e => setLevelForm({ ...levelForm, default_modules_count: e.target.value })} style={{ width: "100%", padding: 6, borderRadius: 5, border: "1px solid #d1d5db", fontSize: 12, boxSizing: "border-box" }} />
                    </div>
                  </div>
                  <div style={{ marginTop: 8, display: "flex", gap: 6 }}>
                    <button onClick={handleLevelSave} style={{ background: BRAND, color: "#fff", border: "none", borderRadius: 5, padding: "4px 12px", fontSize: 11, cursor: "pointer" }}>Save Level</button>
                    <button onClick={() => setShowLevelForm(false)} style={{ background: "#fff", border: "1px solid #d1d5db", borderRadius: 5, padding: "4px 12px", fontSize: 11, cursor: "pointer" }}>Cancel</button>
                  </div>
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {(selectedCert.levels || []).map(lvl => (
                  <div key={lvl.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "#f9fafb", borderRadius: 8, border: "0.5px solid #f3f4f6" }}>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: 13 }}>{lvl.name}</div>
                      <div style={{ fontSize: 11, color: "#6b7280" }}>Period: {lvl.period_count} {lvl.duration_type} · Modules: {lvl.default_modules_count}</div>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => { 
                        setEditingLevel(lvl); 
                        setLevelForm({
                          name: lvl.name || "",
                          duration_type: lvl.duration_type || "Months",
                          period_count: lvl.period_count || "",
                          default_modules_count: lvl.default_modules_count || ""
                        }); 
                        setShowLevelForm(true); 
                      }} style={{ fontSize: 10, color: BRAND, border: "none", background: "none", cursor: "pointer" }}>Edit</button>
                      <button onClick={() => deleteLevel(lvl.id)} style={{ fontSize: 10, color: "#dc2626", border: "none", background: "none", cursor: "pointer" }}>Delete</button>
                    </div>
                  </div>
                ))}
                {(selectedCert.levels || []).length === 0 && <div style={{ textAlign: "center", color: "#9ca3af", padding: 20, fontSize: 12 }}>No levels defined for this authority yet.</div>}
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center", color: "#9ca3af", padding: 40, border: "1px dashed #e5e7eb", borderRadius: 10 }}>
              <div style={{ fontSize: 24, marginBottom: 10 }}>📜</div>
              Select a certification authority from the list to manage its specific levels, modules and study periods.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── MAIN APPLICATION RUNTIME SHELL ───────────────────────────────────────────
export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState(localStorage.getItem("auth_token") || "");
  const [userType, setUserType] = useState(
    localStorage.getItem("user_type") || "staff",
  );

  const requestHeaders = useMemo(() => ({
    "Content-Type": "application/json",
    "Accept": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {})
  }), [token]);

  const [loginType, setLoginType] = useState("student");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [dbData, setDbData] = useState({
    departments: [],
    courses: [],
    students: [],
    clubs: [],
    staff: [],
    certifications: [],
    certificationLevels: [],
    user: null,
  });
  const [loading, setLoading] = useState(!!token);

  // Ultra-safe array finder extraction function
  const unpack = (res) => {
    if (!res) return [];
    // 1. If it's already an array, return it
    if (Array.isArray(res)) return res;

    // 2. Handle { success: true, data: [...] } OR { success: true, data: { data: [...] } }
    if (res.success === true && res.data) {
      if (Array.isArray(res.data)) return res.data;
      if (res.data.data && Array.isArray(res.data.data)) return res.data.data;
    }

    // 3. Handle standard Laravel pagination or data wrapper { data: [...] } or { data: { data: [...] } }
    if (res.data) {
      if (Array.isArray(res.data)) return res.data;
      if (res.data.data && Array.isArray(res.data.data)) return res.data.data;
    }

    // 4. Handle Legacy / original { original: [...] }
    if (res.original && Array.isArray(res.original)) return res.original;

    // 5. Deep search for any array if still not found
    const deepKey = Object.keys(res).find((k) => Array.isArray(res[k]));
    if (deepKey) return res[deepKey];

    return [];
  };

  const fetchCompleteBackendState = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    console.log("🔄 Synchronizing full system state from ledger layers...");

    try {
      const [
        userRes,
        deptsRes,
        coursesRes,
        studentsRes,
        clubsRes,
        staffRes,
        certsRes,
        certLevelsRes,
      ] = await Promise.all([
        api.get("/me").catch(() => null),
        api.get("/departments").catch(() => ({ data: [] })),
        api.get("/courses").catch(() => ({ data: [] })),
        api.get("/students").catch(() => ({ data: [] })),
        api.get("/clubs").catch(() => ({ data: [] })),
        api.get("/staff").catch(() => ({ data: [] })),
        api.get("/certifications").catch(() => ({ data: [] })),
        api.get("/certification-levels").catch(() => ({ data: [] })),
      ]);

      const newState = {
        user: (userRes?.data?.data || userRes?.data) || {
          name: "Authorized Officer",
          email: "management@magotvtc.ac.ke",
        },
        departments: unpack(deptsRes?.data),
        courses: unpack(coursesRes?.data),
        students: unpack(studentsRes?.data),
        clubs: unpack(clubsRes?.data),
        staff: unpack(staffRes?.data),
        certifications: unpack(certsRes?.data),
        certificationLevels: unpack(certLevelsRes?.data),
      };

      console.log("✅ State sync complete:", {
        courses: newState.courses.length,
        students: newState.students.length,
        departments: newState.departments.length,
      });

      setDbData(newState);
    } catch (error) {
      console.error("❌ Data pipeline failure:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      queueMicrotask(fetchCompleteBackendState);
    }
  }, [fetchCompleteBackendState, token]);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError("");

    const url = loginType === "staff" ? "/api/login" : "/api/student/login";
    const payload =
      loginType === "staff"
        ? { email: identifier, password }
        : { admission_number: identifier, password };

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Verification failed. Check credentials.");
        return res.json();
      })
      .then((data) => {
        const activeToken =
          data?.token || data?.access_token || data?.data?.token;
        if (activeToken) {
          localStorage.setItem("auth_token", activeToken);
          localStorage.setItem("user_type", loginType);
          setUserType(loginType);
          setToken(activeToken);
          if (loginType === "student") {
            navigate("/student");
          } else {
            navigate("/dashboard");
          }
        } else {
          throw new Error("No authentication token payload found.");
        }
      })
      .catch((err) => {
        setLoginError(err.message || "Failed to establish session.");
      });
  };

  const handleLogout = () => {
    fetch("/api/logout", { method: "POST", headers: requestHeaders }).finally(
      () => {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_type");
        setToken("");
        setUserType("staff");
        setDbData({
          departments: [],
          courses: [],
          students: [],
          clubs: [],
          staff: [],
          user: null,
        });
      },
    );
  };

  // Render view router helper
  const renderRoutes = () => {
    return (
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard dbData={dbData} />} />
        <Route
          path="/departments"
          element={
            <Departments
              dbData={dbData}
              onRefresh={fetchCompleteBackendState}
              headers={requestHeaders}
            />
          }
        />
        <Route
          path="/courses"
          element={
            <Courses
              dbData={dbData}
              onRefresh={fetchCompleteBackendState}
              headers={requestHeaders}
            />
          }
        />
        <Route
          path="/students"
          element={
            <Students
              dbData={dbData}
              onRefresh={fetchCompleteBackendState}
              headers={requestHeaders}
            />
          }
        />
        <Route path="/career" element={<CareerGuidance />} />
        <Route path="/counselling" element={<Counselling />} />
        <Route path="/clubs" element={<Clubs dbData={dbData} />} />
        <Route
          path="/certifications"
          element={
            <Certifications
              dbData={dbData}
              onRefresh={fetchCompleteBackendState}
              headers={requestHeaders}
            />
          }
        />
        <Route
          path="/staff"
          element={
            <Staff
              dbData={dbData}
              onRefresh={fetchCompleteBackendState}
              headers={requestHeaders}
            />
          }
        />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/interventions" element={<Interventions />} />
        <Route path="/job-placements" element={<JobPlacement />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    );
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          color: BRAND,
        }}
      >
        <h4>Verifying Sanctum Credentials & Querying Database Rows...</h4>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          !token ? (
            <Landing
              onPortalLogin={() => {
                navigate("/login");
              }}
            />
          ) : userType === "student" ? (
            <Navigate to="/student" replace />
          ) : (
            <Navigate to="/dashboard" replace />
          )
        }
      />
      <Route
        path="/student"
        element={
          token && userType === "student" ? (
            <StudentDashboard user={dbData.user} onLogout={handleLogout} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="*"
        element={
          token && userType === "staff" ? (
            <div
              style={{
                display: "flex",
                minHeight: "100vh",
                fontFamily: "'Segoe UI', system-ui, sans-serif",
                background: "#f9fafb",
              }}
            >
              {/* Navigation Sidebar */}
              <div
                style={{
                  width: 220,
                  background: "#fff",
                  borderRight: "0.5px solid #e5e7eb",
                  display: "flex",
                  flexDirection: "column",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    padding: "20px 16px",
                    borderBottom: "0.5px solid #f3f4f6",
                  }}
                >
                  <div
                    style={{
                      color: BRAND,
                      fontWeight: 700,
                      fontSize: 15,
                      letterSpacing: 0.5,
                    }}
                  >
                    MAGO TVTC
                  </div>
                  <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>
                    Management Portal
                  </div>
                </div>

                <div style={{ padding: 10, flex: 1 }}>
                  {NAV_ITEMS.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <button
                        key={item.id}
                        onClick={() => navigate(item.path)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          width: "100%",
                          border: "none",
                          background: isActive ? BRAND_LIGHT : "transparent",
                          color: isActive ? BRAND : "#4b5563",
                          padding: "9px 12px",
                          borderRadius: 8,
                          cursor: "pointer",
                          fontSize: 13,
                          fontWeight: isActive ? 600 : 500,
                          textAlign: "left",
                          marginBottom: 4,
                          transition: "all 0.15s",
                        }}
                      >
                        <span style={{ fontSize: 15 }}>{item.icon}</span>
                        {item.label}
                      </button>
                    );
                  })}
                </div>

                {/* User Account / Sign Out Section */}
                <div
                  style={{
                    padding: 14,
                    borderTop: "0.5px solid #e5e7eb",
                    background: "#f9fafb",
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#374151",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {dbData.user?.name || "Officer Account"}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "#6b7280",
                      marginBottom: 10,
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {dbData.user?.email}
                  </div>
                  <button
                    onClick={handleLogout}
                    style={{
                      width: "100%",
                      background: "#fee2e2",
                      color: "#dc2626",
                      border: "none",
                      padding: "6px 10px",
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                  >
                    Sign Out Session
                  </button>
                </div>
              </div>

              {/* Main Frame Page Container */}
              <div style={{ flex: 1, padding: 24, overflowY: "auto" }}>
                {renderRoutes()}
              </div>
            </div>
          ) : !token ? (
            <div
              style={{
                display: "flex",
                height: "100vh",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "#f3f4f6",
                fontFamily: "sans-serif",
              }}
            >
              <button
                onClick={() => {
                  navigate("/");
                }}
                style={{
                  marginBottom: 20,
                  background: "none",
                  border: "none",
                  color: BRAND,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: 14,
                }}
              >
                ← Back to Landing Page
              </button>
              <form
                onSubmit={handleLoginSubmit}
                style={{
                  background: "#fff",
                  padding: 32,
                  borderRadius: 12,
                  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                  width: 340,
                }}
              >
                <div
                  style={{
                    color: BRAND,
                    fontWeight: 700,
                    fontSize: 16,
                    marginBottom: 4,
                    letterSpacing: 0.5,
                  }}
                >
                  MAGO TVTC
                </div>
                <div
                  style={{ fontSize: 12, color: "#6b7280", marginBottom: 20 }}
                >
                  {loginType === "staff"
                    ? "Staff Information System Access"
                    : "Student Portal Access"}
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    marginBottom: 20,
                    background: "#f3f4f6",
                    padding: 4,
                    borderRadius: 12,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setLoginType("staff");
                      setIdentifier("");
                      setPassword("");
                      setLoginError("");
                    }}
                    style={{
                      flex: 1,
                      padding: 10,
                      borderRadius: 10,
                      border:
                        loginType === "staff"
                          ? `1px solid ${BRAND}`
                          : "1px solid transparent",
                      background:
                        loginType === "staff" ? "#ffffff" : "transparent",
                      color: loginType === "staff" ? BRAND : "#6b7280",
                      cursor: "pointer",
                      fontWeight: 700,
                    }}
                  >
                    Staff
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginType("student");
                      setIdentifier("");
                      setPassword("");
                      setLoginError("");
                    }}
                    style={{
                      flex: 1,
                      padding: 10,
                      borderRadius: 10,
                      border:
                        loginType === "student"
                          ? `1px solid ${BRAND}`
                          : "1px solid transparent",
                      background:
                        loginType === "student" ? "#ffffff" : "transparent",
                      color: loginType === "student" ? BRAND : "#6b7280",
                      cursor: "pointer",
                      fontWeight: 700,
                    }}
                  >
                    Student
                  </button>
                </div>

                {loginError && (
                  <div
                    style={{
                      background: "#fee2e2",
                      color: "#dc2626",
                      padding: "8px 12px",
                      borderRadius: 6,
                      fontSize: 12,
                      marginBottom: 14,
                    }}
                  >
                    {loginError}
                  </div>
                )}

                <div style={{ marginBottom: 12 }}>
                  <label
                    style={{
                      fontSize: 12,
                      color: "#374151",
                      display: "block",
                      marginBottom: 4,
                    }}
                  >
                    {loginType === "staff" ? "Staff Email" : "Admission Number"}
                  </label>
                  <input
                    type={loginType === "staff" ? "email" : "text"}
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={
                      loginType === "staff" ? "name@mago.test" : "MG..."
                    }
                    style={{
                      width: "100%",
                      padding: 8,
                      border: "1px solid #d1d5db",
                      borderRadius: 6,
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label
                    style={{
                      fontSize: 12,
                      color: "#374151",
                      display: "block",
                      marginBottom: 4,
                    }}
                  >
                    Security Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: "100%",
                      padding: 8,
                      border: "1px solid #d1d5db",
                      borderRadius: 6,
                      boxSizing: "border-box",
                    }}
                  />
                  {loginType === "student" && (
                    <div
                      style={{
                        marginTop: 8,
                        fontSize: 11,
                        color: "#4b5563",
                        lineHeight: 1.4,
                      }}
                    >
                      Use your admission number and the default password{" "}
                      <strong>password</strong>.
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  style={{
                    width: "100%",
                    background: BRAND,
                    color: "#fff",
                    border: "none",
                    padding: 10,
                    borderRadius: 6,
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Authenticate Session
                </button>
              </form>
            </div>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
    </Routes>
  );
}
