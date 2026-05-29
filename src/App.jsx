import { useState, useEffect } from "react";
import Login from "./Login";
import Landing from "./pages/Landing";
import StudentDashboard from "./pages/StudentDashboard";
import api from "./api";
import CareerGuidance from "./pages/CareerGuidance";
import Counselling from "./pages/Counselling";
import Clubs from "./pages/Clubs";

// ── COLOR & NAV CONFIG ──────────────────────────────────────────────────────
const BRAND = "#0a6e4e";
const BRAND_LIGHT = "#e6f4ef";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "departments", label: "Departments", icon: "🏛️" },
  { id: "courses", label: "Courses", icon: "📚" },
  { id: "students", label: "Students", icon: "🎓" },
  { id: "career", label: "Career Guidance", icon: "🧭" },
  { id: "counselling", label: "Counselling", icon: "💬" },
  { id: "clubs", label: "Clubs & Societies", icon: "🤝" },
  { id: "staff", label: "Staff", icon: "👩‍🏫" },
  { id: "analytics", label: "Analytics", icon: "📈" },
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

// ── REUSABLE COMPONENTS ──────────────────────────────────────────────────────
function StatCard({ label, value, sub, color = BRAND }) {
  return (
    <div className="bg-white p-6 rounded-[30px] border border-gray-100 shadow-sm flex flex-col items-center text-center">
      <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
        {label}
      </div>
      <div className="text-4xl font-black text-gray-900 leading-none">
        {value}
      </div>
      {sub && (
        <div className="text-[10px] font-bold text-[#0a6e4e] uppercase mt-2">
          {sub}
        </div>
      )}
    </div>
  );
}

function Badge({ label, color, bg }) {
  return (
    <span
      style={{ background: bg || "#e5e7eb", color: color || "#374151" }}
      className="px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"
    >
      {label}
    </span>
  );
}

function SectionHeader({ title, action, onAction }) {
  return (
    <div className="flex justify-between items-center mb-10 no-print">
      <h2 className="text-3xl font-black text-gray-900 tracking-tighter italic">
        {title}
      </h2>
      {action && (
        <button
          onClick={onAction}
          className="bg-[#0a6e4e] text-white px-8 py-3 rounded-full font-black text-sm shadow-xl shadow-[#0a6e4e]/20 hover:scale-105 active:scale-95 transition-all"
        >
          + {action}
        </button>
      )}
    </div>
  );
}

// ── PAGES ────────────────────────────────────────────────────────────────────

function Dashboard() {
  const [stats, setStats] = useState({
    students: 0,
    departments: 0,
    courses: 0,
    staff: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [depts, courses, students, staff] = await Promise.allSettled([
          api.get("/departments"),
          api.get("/courses"),
          api.get("/students"),
          api.get("/staff"),
        ]);

        setStats({
          departments:
            depts.status === "fulfilled"
              ? (depts.value.data.total ?? depts.value.data.length ?? 0)
              : 0,
          courses:
            courses.status === "fulfilled"
              ? (courses.value.data.total ?? courses.value.data.length ?? 0)
              : 0,
          students:
            students.status === "fulfilled"
              ? (students.value.data.total ?? students.value.data.length ?? 0)
              : 0,
          staff:
            staff.status === "fulfilled"
              ? (staff.value.data.total ?? staff.value.data.length ?? 0)
              : 0,
        });
      } catch (err) {}
    };
    fetchStats();
  }, []);

  return (
    <div>
      <div className="mb-8 md:mb-12">
        <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter leading-tight mb-2 md:mb-4">
          Command Center
        </h1>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-[9px] md:text-xs">
          Mago TVTC Institutional Management
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-8 md:mb-12">
        <StatCard
          label="Live Enrollment"
          value={stats.students}
          sub="Term 2 Active"
        />
        <StatCard
          label="Academic Units"
          value={stats.departments}
          sub="Active Depts"
        />
        <StatCard
          label="Certified Programs"
          value={stats.courses}
          sub="NITA & KNEC"
        />
        <StatCard label="Faculty" value={stats.staff} sub="Active Staff" />
      </div>

      <div className="bg-white p-6 md:p-10 rounded-[35px] md:rounded-[40px] border border-gray-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h3 className="text-lg md:text-xl font-black text-[#0a6e4e] mb-1 leading-tight uppercase tracking-tighter italic">
            Institutional Sync: ACTIVE
          </h3>
          <p className="text-gray-400 text-xs md:text-sm font-medium leading-relaxed max-w-2xl">
            All student career profiles and counselling logs are encrypted and
            synchronized with the MySQL master node across all campus terminals.
          </p>
        </div>
        <div className="w-12 h-12 md:w-16 md:h-16 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
          <div className="w-3 h-3 md:w-4 md:h-4 bg-green-500 rounded-full animate-ping"></div>
        </div>
      </div>
    </div>
  );
}

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [staff, setStaff] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    code: "",
    color: "#0a6e4e",
    hod_id: "",
  });

  const fetchData = async () => {
    try {
      const [dRes, sRes] = await Promise.all([
        api.get("/departments"),
        api.get("/staff"),
      ]);
      setDepartments(dRes.data.data || dRes.data);
      setStaff(sRes.data.data || sRes.data);
    } catch (err) {}
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) await api.put(`/departments/${editingId}`, form);
      else await api.post("/departments", form);
      setForm({ name: "", code: "", color: "#0a6e4e", hod_id: "" });
      setShowForm(false);
      setEditingId(null);
      fetchData();
    } catch (err) {}
  };

  const handleEdit = (d) => {
    setForm({
      name: d.name,
      code: d.code,
      color: d.color,
      hod_id: d.hod_id || "",
    });
    setEditingId(d.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      await api.delete(`/departments/${id}`);
      fetchData();
    } catch (err) {}
  };

  return (
    <div>
      <SectionHeader
        title="Departments"
        action="New Department"
        onAction={() => setShowForm(!showForm)}
      />
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 md:p-8 rounded-[30px] border border-gray-100 shadow-sm mb-12 animate-in slide-in-from-top-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <input
              required
              placeholder="Department Name"
              className="h-14 p-4 bg-gray-50 rounded-2xl outline-none text-base"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              required
              placeholder="Code (e.g. ICT)"
              className="h-14 p-4 bg-gray-50 rounded-2xl outline-none uppercase font-mono text-base"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
            />
            <select
              className="h-14 p-4 bg-gray-50 rounded-2xl outline-none text-base"
              value={form.hod_id}
              onChange={(e) => setForm({ ...form, hod_id: e.target.value })}
            >
              <option value="">Select HOD...</option>
              {staff.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full md:w-auto mt-6 px-10 py-4 bg-[#0a6e4e] text-white rounded-2xl font-black text-xs uppercase tracking-widest"
          >
            {editingId ? "UPDATE UNIT" : "CREATE UNIT"}
          </button>
        </form>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {departments.map((d) => (
          <div
            key={d.id}
            style={{ borderTop: `10px solid ${d.color || BRAND}` }}
            className="bg-white p-8 rounded-[35px] md:rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl transition-all relative"
          >
            <div className="absolute top-6 right-6 flex gap-2">
              <button
                onClick={() => handleEdit(d)}
                className="w-8 h-8 flex items-center justify-center bg-gray-50 rounded-lg text-gray-400 hover:text-[#0a6e4e] transition-colors"
              >
                ✏️
              </button>
              <button
                onClick={() => handleDelete(d.id)}
                className="w-8 h-8 flex items-center justify-center bg-red-50 rounded-lg text-red-300 hover:text-red-500 transition-colors"
              >
                🗑️
              </button>
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">{d.name}</h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-8">
              {d.code} · HOD: {d.hod?.name || "VACANT"}
            </p>
            <div className="flex gap-10">
              <div>
                <div className="text-2xl font-black text-gray-900">
                  {d.students_count}
                </div>
                <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                  Students
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-gray-900">
                  {d.courses_count}
                </div>
                <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                  Courses
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Courses() {
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    department_id: "",
    duration: "",
    certification_type: "NITA",
  });

  const fetchData = async () => {
    try {
      const [cRes, dRes] = await Promise.all([
        api.get("/courses"),
        api.get("/departments"),
      ]);
      setCourses(cRes.data.data || cRes.data);
      setDepartments(dRes.data.data || dRes.data);
    } catch (err) {}
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/courses", form);
      setShowForm(false);
      setForm({
        name: "",
        department_id: "",
        duration: "",
        certification_type: "NITA",
      });
      fetchData();
    } catch (err) {}
  };

  return (
    <div>
      <SectionHeader
        title="Curriculum"
        action="Add Course"
        onAction={() => setShowForm(!showForm)}
      />
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 md:p-8 rounded-[30px] border border-gray-100 shadow-sm mb-12 animate-in slide-in-from-top-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <input
              required
              placeholder="Course Name"
              className="h-14 p-4 bg-gray-50 rounded-2xl outline-none text-base"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <select
              required
              className="h-14 p-4 bg-gray-50 rounded-2xl outline-none text-base"
              value={form.department_id}
              onChange={(e) =>
                setForm({ ...form, department_id: e.target.value })
              }
            >
              <option value="">Department...</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            <input
              required
              placeholder="Duration"
              className="h-14 p-4 bg-gray-50 rounded-2xl outline-none text-base"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
            />
            <select
              className="h-14 p-4 bg-gray-50 rounded-2xl outline-none text-base"
              value={form.certification_type}
              onChange={(e) =>
                setForm({ ...form, certification_type: e.target.value })
              }
            >
              <option>NITA</option>
              <option>KNEC</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full md:w-auto mt-6 px-10 py-4 bg-[#0a6e4e] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest"
          >
            Register Program
          </button>
        </form>
      )}
      <div className="bg-white rounded-[35px] md:rounded-[40px] overflow-hidden border border-gray-100 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                <th className="p-8">Course Program</th>
                <th className="p-8">Institutional Dept</th>
                <th className="p-8">Duration</th>
                <th className="p-8 text-right">Certification</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr
                  key={c.id}
                  className="border-t border-gray-50 group hover:bg-gray-50/50 transition-colors"
                >
                  <td className="p-8 font-black text-gray-900">{c.name}</td>
                  <td className="p-8 font-bold text-gray-400">
                    {c.department?.name}
                  </td>
                  <td className="p-8 font-mono text-gray-400">{c.duration}</td>
                  <td className="p-8 text-right">
                    <Badge
                      label={c.certification_type}
                      bg="#dbeafe"
                      color="#1e40af"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Students() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    id: "",
    name: "",
    course_id: "",
    phone: "",
    county: "",
    gender: "Male",
    intake_year: 2026,
    national_id_or_birth_cert: "",
  });

  const fetchData = async () => {
    try {
      const [sRes, cRes] = await Promise.all([
        api.get(`/students?search=${search}`),
        api.get("/courses"),
      ]);
      setStudents(sRes.data.data || sRes.data || []);
      setCourses(cRes.data.data || cRes.data || []);
    } catch (err) {}
  };

  useEffect(() => {
    fetchData();
  }, [search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/students", form);
      setShowForm(false);
      setForm({
        id: "",
        name: "",
        course_id: "",
        phone: "",
        county: "",
        gender: "Male",
        intake_year: 2026,
        national_id_or_birth_cert: "",
      });
      fetchData();
    } catch (err) {
      alert("Error: Enrolment failed.");
    }
  };

  return (
    <div>
      <SectionHeader
        title="Students"
        action="Enrol Student"
        onAction={() => setShowForm(!showForm)}
      />
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 md:p-8 rounded-[30px] border border-gray-100 shadow-sm mb-12 animate-in slide-in-from-top-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            <input
              required
              placeholder="Student ID (MG...)"
              className="h-14 p-4 bg-gray-50 rounded-2xl outline-none font-mono text-base"
              value={form.id}
              onChange={(e) => setForm({ ...form, id: e.target.value })}
            />
            <input
              required
              placeholder="Full Name"
              className="h-14 p-4 bg-gray-50 rounded-2xl outline-none text-base"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <select
              required
              className="h-14 p-4 bg-gray-50 rounded-2xl outline-none text-base"
              value={form.course_id}
              onChange={(e) => setForm({ ...form, course_id: e.target.value })}
            >
              <option value="">Assign Course...</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <input
              required
              placeholder="ID / Birth Cert"
              className="h-14 p-4 bg-gray-50 rounded-2xl outline-none text-base"
              value={form.national_id_or_birth_cert}
              onChange={(e) =>
                setForm({ ...form, national_id_or_birth_cert: e.target.value })
              }
            />
            <input
              required
              placeholder="Contact Phone"
              className="h-14 p-4 bg-gray-50 rounded-2xl outline-none text-base"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <input
              required
              placeholder="Home County"
              className="h-14 p-4 bg-gray-50 rounded-2xl outline-none text-base"
              value={form.county}
              onChange={(e) => setForm({ ...form, county: e.target.value })}
            />
          </div>
          <button
            type="submit"
            className="w-full md:w-auto mt-6 px-10 py-4 bg-[#0a6e4e] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest"
          >
            ENROL FOR 2026
          </button>
        </form>
      )}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search institutional database..."
        className="w-full h-16 px-8 mb-8 md:mb-10 rounded-[25px] md:rounded-[30px] border-2 border-transparent bg-white shadow-xl shadow-[#0a6e4e]/5 focus:border-[#0a6e4e] outline-none transition-all font-bold placeholder:text-gray-300 text-base"
      />
      <div className="bg-white rounded-[35px] md:rounded-[40px] overflow-hidden border border-gray-100 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                <th className="p-8">Student Master ID</th>
                <th className="p-8">Legal Name</th>
                <th className="p-8">Enrolled Course</th>
                <th className="p-8 text-right">Sentiment</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr
                  key={s.id}
                  className="border-t border-gray-50 group hover:bg-gray-50/50"
                >
                  <td className="p-8 font-mono text-gray-400 uppercase">
                    {s.id}
                  </td>
                  <td className="p-8 font-black text-gray-900">{s.name}</td>
                  <td className="p-8 font-bold text-gray-400">
                    {s.course?.name}
                  </td>
                  <td className="p-8 text-right">
                    <Badge
                      label={s.satisfaction}
                      color={SATISFACTION_COLORS[s.satisfaction]}
                      bg={SATISFACTION_BG[s.satisfaction]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Staff() {
  const [staff, setStaff] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    department_id: "",
    role_title: "Teacher",
    specialisation: "",
  });

  const fetchData = async () => {
    try {
      const [sRes, dRes] = await Promise.all([
        api.get("/staff"),
        api.get("/departments"),
      ]);
      setStaff(sRes.data.data || sRes.data);
      setDepartments(dRes.data.data || dRes.data);
    } catch (err) {}
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/staff", form);
      setShowForm(false);
      setForm({
        name: "",
        email: "",
        phone: "",
        department_id: "",
        role_title: "Teacher",
        specialisation: "",
      });
      fetchData();
    } catch (err) {
      setError(
        "Failed to authorize staff. Please check the form and try again.",
      );
    }
  };

  return (
    <div>
      <SectionHeader
        title="Faculty"
        action="Add Staff"
        onAction={() => setShowForm(!showForm)}
      />
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm mb-12"
        >
          <div className="grid grid-cols-3 gap-6">
            <input
              required
              placeholder="Staff Name"
              className="p-4 bg-gray-50 rounded-2xl outline-none"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              required
              type="email"
              placeholder="Corporate Email"
              className="p-4 bg-gray-50 rounded-2xl outline-none"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              required
              placeholder="Phone Number"
              className="p-4 bg-gray-50 rounded-2xl outline-none"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-3 gap-6 mt-6">
            <select
              required
              className="p-4 bg-gray-50 rounded-2xl outline-none"
              value={form.department_id}
              onChange={(e) =>
                setForm({ ...form, department_id: e.target.value })
              }
            >
              <option value="">Department...</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            <select
              required
              className="p-4 bg-gray-50 rounded-2xl outline-none"
              value={form.role_title}
              onChange={(e) => setForm({ ...form, role_title: e.target.value })}
            >
              <option value="Teacher">Teacher</option>
              <option value="Counsellor">Counsellor</option>
              <option value="HOD">HOD</option>
              <option value="Principal">Principal</option>
            </select>
            <input
              placeholder="Specialisation"
              className="p-4 bg-gray-50 rounded-2xl outline-none"
              value={form.specialisation}
              onChange={(e) =>
                setForm({ ...form, specialisation: e.target.value })
              }
            />
          </div>
          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="mt-8 px-10 py-4 bg-[#0a6e4e] text-white rounded-2xl font-black uppercase text-xs"
          >
            Authorize Member
          </button>
        </form>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {staff.map((s) => (
          <div
            key={s.id}
            className="bg-white p-8 rounded-[40px] border border-gray-100 text-center shadow-sm hover:shadow-xl transition-all group"
          >
            <div className="w-20 h-20 bg-gray-50 rounded-3xl mx-auto mb-6 flex items-center justify-center text-3xl group-hover:bg-[#0a6e4e]/10 transition-colors">
              👨‍🏫
            </div>
            <div className="font-black text-gray-900 leading-tight mb-2">
              {s.name}
            </div>
            <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-6">
              {s.role_title}
            </div>
            <div className="pt-6 border-t border-gray-50 text-[10px] font-black text-[#0a6e4e] uppercase tracking-tighter">
              {s.department?.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── APP SHELL ────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [view, setView] = useState("landing"); // 'landing', 'login', 'portal'
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("auth_token");
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      setView("portal");
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    api.post("/logout");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    setUser(null);
    setView("landing");
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setView("portal");
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#f8fafc]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#0a6e4e] mb-4"></div>
        <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">
          Initializing Core...
        </div>
      </div>
    );

  if (view === "landing")
    return <Landing onPortalLogin={() => setView("login")} />;
  if (view === "login")
    return (
      <div className="relative">
        <button
          onClick={() => setView("landing")}
          className="absolute top-6 left-6 md:top-10 md:left-10 z-50 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-all bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-100"
        >
          ← Back to Site
        </button>
        <Login onLogin={handleLoginSuccess} />
      </div>
    );

  if (user?.roles?.includes("student")) {
    return <StudentDashboard user={user} onLogout={handleLogout} />;
  }

  const PAGE_MAP = {
    dashboard: <Dashboard />,
    departments: <Departments />,
    courses: <Courses />,
    students: <Students />,
    career: <CareerGuidance />,
    counselling: <Counselling />,
    clubs: <Clubs />,
    staff: <Staff />,
    analytics: (
      <div className="p-10 md:p-20 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">
        Integrated Analytics Module Active.
      </div>
    ),
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#f8fafc] text-gray-900 selection:bg-[#0a6e4e]/10 selection:text-[#0a6e4e]">
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 bg-white border-b border-gray-100 z-[60] px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#0a6e4e] rounded-lg flex items-center justify-center text-white text-lg font-black italic">
            M
          </div>
          <div className="text-sm font-black tracking-tighter">MAGO TVTC</div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-xl text-gray-600"
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>
      </header>

      {/* Sidebar / Mobile Nav */}
      <div
        className={`
        fixed inset-0 lg:relative lg:flex w-full lg:w-[280px] bg-white border-r border-gray-100 flex-col flex-shrink-0 z-50 transition-transform duration-300
        ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="hidden lg:block p-10">
          <div className="text-2xl font-black text-[#0a6e4e] tracking-tighter leading-none mb-1">
            MAGO TVTC
          </div>
          <div className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">
            Management 2026
          </div>
        </div>

        <nav className="flex-1 px-6 pt-20 lg:pt-0 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setPage(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full h-12 flex items-center gap-4 px-6 rounded-[15px] text-sm font-black transition-all ${
                page === item.id
                  ? "bg-[#0a6e4e] text-white shadow-xl shadow-[#0a6e4e]/20"
                  : "text-gray-400 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="tracking-tight">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-8 lg:p-10 border-t border-gray-50">
          <div className="text-sm font-black text-gray-900 mb-1 leading-tight">
            {user.name}
          </div>
          <div className="text-[10px] font-black text-[#0a6e4e] uppercase tracking-widest mb-6">
            Administrator
          </div>
          <button
            onClick={handleLogout}
            className="w-full lg:w-auto h-12 flex items-center justify-center lg:justify-start text-[10px] font-black text-red-500 uppercase tracking-widest hover:text-red-700 transition-colors bg-red-50 lg:bg-transparent rounded-xl lg:rounded-none"
          >
            Terminate Session
          </button>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 p-6 md:p-10 lg:p-16 overflow-y-auto print:p-0">
        <div className="max-w-6xl mx-auto">{PAGE_MAP[page]}</div>
      </main>
    </div>
  );
}
