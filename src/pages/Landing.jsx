import { useState, useEffect, useRef } from "react";
import SurveyModal from "../components/public/SurveyModal";
import CounsellingModal from "../components/public/CounsellingModal";
import api from "../api";

// Local Assets
import siteLogo from "../assets/logo.png";
import missionImg from "../assets/scouts.jpeg";
import hostelImg from "../assets/hostel.jpeg";
import ictImg from "../assets/graduation.jpeg";
import engineeringImg from "../assets/treegood.jpeg";
import graduationImg from "../assets/graduationn.jpeg";

export default function Landing({ onPortalLogin }) {
  const [surveyOpen, setSurveyOpen] = useState(false);
  const [counsellingOpen, setCounsellingOpen] = useState(false);
  const [showExplore, setShowExplore] = useState(false);
  const [showVirtualTour, setShowVirtualTour] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [loadingDepts, setLoadingDepts] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dropdown states
  const [careerDropdownOpen, setCareerDropdownOpen] = useState(false);
  const [counselingDropdownOpen, setCounselingDropdownOpen] = useState(false);

  // Refs for closing dropdowns on outside click
  const careerRef = useRef(null);
  const counselingRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (careerRef.current && !careerRef.current.contains(event.target)) {
        setCareerDropdownOpen(false);
      }
      if (
        counselingRef.current &&
        !counselingRef.current.contains(event.target)
      ) {
        setCounselingDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleExplorePrograms = async () => {
    if (showVirtualTour) setShowVirtualTour(false);

    if (!showExplore && departments.length === 0) {
      setLoadingDepts(true);
      try {
        const response = await api.get("/public/departments");
        setDepartments(response.data.data || response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      } finally {
        setLoadingDepts(false);
      }
    }
    setShowExplore(!showExplore);
  };

  const handleVirtualTour = () => {
    if (showExplore) setShowExplore(false);
    setShowVirtualTour(!showVirtualTour);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans antialiased selection:bg-emerald-600/10 selection:text-emerald-700 relative overflow-x-hidden">
      {/* Decorative Aurora Background Mesh */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[700px] bg-[radial-gradient(100%_60%_at_top_center,rgba(16,185,129,0.06)_0%,rgba(248,250,252,0)_100%)] pointer-events-none z-0" />

      {/* Global Navigation Engine */}
      <nav className="fixed top-0 left-0 right-0 bg-white/75 backdrop-blur-xl z-50 border-b border-slate-200/80 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center w-full">
          {/* Brand Identity */}
          <div className="flex items-center gap-3.5 flex-shrink-0 group cursor-pointer">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-900 rounded-2xl flex items-center justify-center p-0.5 shadow-lg shadow-emerald-900/20 group-hover:scale-105 transition-all duration-300 relative">
              <img 
                src={siteLogo} 
                alt="Mago TVC Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <div className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight leading-none bg-gradient-to-r from-slate-900 to-emerald-700 bg-clip-text text-transparent">
                Mago TVC
              </div>
              <div className="text-[8px] sm:text-[10px] font-bold text-emerald-600 uppercase tracking-[0.15em] sm:tracking-[0.2em] mt-1 sm:mt-2 block opacity-100">
                Technical Excellence Center
              </div>
            </div>
          </div>

          {/* Desktop Links Tree */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Career Selector Dropdown */}
            <div className="relative" ref={careerRef}>
              <button
                onClick={() => {
                  setCareerDropdownOpen(!careerDropdownOpen);
                  setCounselingDropdownOpen(false);
                }}
                className={`h-10 px-4 rounded-xl font-semibold text-xs tracking-wide flex items-center gap-2 transition-all ${
                  careerDropdownOpen
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                Career Guidance
                <svg
                  className={`w-3.5 h-3.5 transform transition-transform duration-200 ${careerDropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {careerDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-50">
                  <button
                    onClick={() => {
                      setSurveyOpen(true);
                      setCareerDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-emerald-600 flex items-center gap-2.5 transition-colors"
                  >
                    <svg
                      className="w-4 h-4 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                      />
                    </svg>
                    Satisfaction Survey
                  </button>
                </div>
              )}
            </div>

            {/* Counseling Selector Dropdown */}
            <div className="relative" ref={counselingRef}>
              <button
                onClick={() => {
                  setCounselingDropdownOpen(!counselingDropdownOpen);
                  setCareerDropdownOpen(false);
                }}
                className={`h-10 px-4 rounded-xl font-semibold text-xs tracking-wide flex items-center gap-2 transition-all ${
                  counselingDropdownOpen
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                Counseling Hub
                <svg
                  className={`w-3.5 h-3.5 transform transition-transform duration-200 ${counselingDropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {counselingDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-50">
                  <button
                    onClick={() => {
                      setCounsellingOpen(true);
                      setCounselingDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2.5 transition-colors"
                  >
                    <svg
                      className="w-4 h-4 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    Request Counseling
                  </button>
                </div>
              )}
            </div>

            <div className="h-4 w-[1px] bg-slate-200 mx-2" />

            <button
              onClick={() => onPortalLogin()}
              className="h-10 px-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-xs tracking-wide transition-all shadow-sm shadow-emerald-600/10 active:scale-[0.98]"
            >
              Login Portal
            </button>
          </div>

          {/* Mobile Hamburger Drawer Mechanism */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 focus:outline-none transition-colors"
          >
            <span className="text-xl font-medium">
              {mobileMenuOpen ? "✕" : "☰"}
            </span>
          </button>
        </div>

        {/* Adaptive Slideway Mobile Drawer Panel */}
        {mobileMenuOpen && (
          <div className="lg:hidden w-full border-t border-slate-200 bg-white px-4 py-4 flex flex-col gap-2 shadow-xl">
            <button
              onClick={() => {
                setSurveyOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 px-4 bg-slate-50 hover:bg-slate-100 rounded-xl text-left font-medium text-sm text-slate-700 transition-colors"
            >
              Take Satisfaction Survey
            </button>
            <button
              onClick={() => {
                setCounsellingOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 px-4 bg-slate-50 hover:bg-slate-100 rounded-xl text-left font-medium text-sm text-slate-700 transition-colors"
            >
              Book Counseling Session
            </button>
            <div className="h-[1px] bg-slate-200 my-1" />
            <button
              onClick={() => {
                onPortalLogin();
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 px-4 bg-emerald-600 text-white rounded-xl font-semibold text-sm text-center shadow-sm"
            >
              Secure Student Login
            </button>
          </div>
        )}
      </nav>

      {/* Proportional Hero Pipeline Layout Framework */}
      <header className="pt-32 lg:pt-40 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-emerald-50 border border-emerald-100/80 rounded-full text-emerald-700 text-xs font-semibold tracking-wide shadow-sm">
              <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-pulse" />
              Admissions Open 2026 / 2027
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
              Hands-On <br className="hidden sm:inline" />
              <span className="text-emerald-600 relative inline-block">
                Technical Training
              </span>{" "}
              <br />
              Systems Blueprint.
            </h1>

            <p className="text-slate-600 text-sm sm:text-base font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Equipping forward-thinking professionals with certified expertise.
              Accelerate your career within industry-backed engineering
              installations and state-of-the-art labs.
            </p>

            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={handleExplorePrograms}
                className={`h-12 px-6 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all shadow-sm ${
                  showExplore
                    ? "bg-slate-900 text-white"
                    : "bg-emerald-600 text-white hover:bg-emerald-700 hover:scale-[1.01]"
                }`}
              >
                {showExplore ? "✕ Hide Catalog" : "⚡ Explore Programs"}
              </button>
              <button
                onClick={handleVirtualTour}
                className={`h-12 px-6 border rounded-xl font-semibold text-xs tracking-wider uppercase transition-all ${
                  showVirtualTour
                    ? "bg-indigo-50 text-indigo-700 border-indigo-200 shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 shadow-sm"
                }`}
              >
                {showVirtualTour ? "✕ Close Tour" : "🌐 Virtual Tour"}
              </button>
            </div>
          </div>

          {/* Quick Hub Access Dashboard Display Element Layout */}
          <div className="lg:col-span-5 w-full max-w-md mx-auto lg:max-w-none">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/60 shadow-xl shadow-slate-100/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-bl-[60px]" />
              <h3 className="text-base font-bold text-slate-900 tracking-tight mb-1">
                Student Operations Hub
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                Access your localized academic portal modules layout securely.
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => onPortalLogin("student")}
                  className="w-full h-12 bg-slate-900 hover:bg-black text-white rounded-xl flex items-center justify-between px-4 font-semibold text-xs tracking-wide transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <svg
                      className="w-4 h-4 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    <span>Student Login</span>
                  </div>
                  <span className="transform group-hover:translate-x-0.5 transition-transform text-slate-400">
                    →
                  </span>
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setSurveyOpen(true)}
                    className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200/40 rounded-xl p-4 flex flex-col justify-between items-start text-left h-28 transition-all group/btn shadow-sm hover:shadow-md"
                  >
                    <svg
                      className="w-6 h-6 text-emerald-600 mb-2 transform group-hover/btn:scale-110 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-sm font-extrabold text-slate-800 tracking-tight leading-tight">
                      Course <br /> Satisfaction Survey
                    </span>
                  </button>
                  <button
                    onClick={() => setCounsellingOpen(true)}
                    className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200/40 rounded-xl p-4 flex flex-col justify-between items-start text-left h-28 transition-all group/btn shadow-sm hover:shadow-md"
                  >
                    <svg
                      className="w-6 h-6 text-indigo-600 mb-2 transform group-hover/btn:scale-110 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-sm font-extrabold text-slate-800 tracking-tight leading-tight">
                      Counseling <br /> Support Hub
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Core Metrics Summary Component Panel */}
      <section className="bg-slate-900 text-white py-10 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-4 text-center sm:divide-x divide-white/10">
          <div className="space-y-1">
            <div className="text-3xl font-extrabold text-emerald-400 tracking-tight">
              70%
            </div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Practical Training Matrix
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-extrabold text-white tracking-tight">
              100%
            </div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Attachment Placement
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-extrabold text-indigo-400 tracking-tight">
              15+
            </div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Specialized Workshops
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-20 bg-white px-4 sm:px-6 lg:px-8 border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Our Mission: <br />
              Empowering Through <br />
              <span className="text-emerald-600">Technical Excellence</span>
            </h2>
            <p className="text-slate-600 font-medium leading-relaxed">
              Mago Technical and Vocational Training College is dedicated to serving God and humanity by providing high-quality, sustainable technical education. We bridge the gap between education and the job market through a rigorous 70% practical training model.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="space-y-2">
                <div className="text-2xl font-black text-slate-900">95%</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Exam Pass Rate</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-black text-slate-900">72</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Hostel Capacity</div>
              </div>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute -inset-4 bg-emerald-600/5 rounded-[40px] -rotate-2 group-hover:rotate-0 transition-transform duration-500" />
            <img
              src={missionImg}
              alt="Mago TVC Campus"
              className="relative w-full aspect-square object-cover rounded-[32px] shadow-2xl border border-white"
            />
          </div>
        </div>
      </section>

      {/* Facilities & Infrastructure Section */}
      <section className="py-24 bg-slate-50 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">World-Class Infrastructure</h2>
            <p className="text-slate-500 font-medium text-sm">We provide students with modern tools and environments to simulate real-world professional settings.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-2 rounded-[32px] border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500 group">
              <img src={ictImg} alt="Computer Lab" className="w-full h-48 object-cover rounded-[24px] mb-6" />
              <div className="p-4 pt-0 space-y-2">
                <h4 className="font-bold text-slate-900">Digital ICT Hub</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">Advanced computer laboratory equipped for software development, graphic design, and networking certification.</p>
              </div>
            </div>
            <div className="bg-white p-2 rounded-[32px] border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500 group">
              <img src={engineeringImg} alt="Engineering Workshop" className="w-full h-48 object-cover rounded-[24px] mb-6" />
              <div className="p-4 pt-0 space-y-2">
                <h4 className="font-bold text-slate-900">Automotive Engineering</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">Specialized workshops for vehicle diagnostics, engine overhauls, and sustainable transportation solutions.</p>
              </div>
            </div>
            <div className="bg-white p-2 rounded-[32px] border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500 group">
              <img src={hostelImg} alt="Rainbow Hostel" className="w-full h-48 object-cover rounded-[24px] mb-6" />
              <div className="p-4 pt-0 space-y-2">
                <h4 className="font-bold text-slate-900">Rainbow Student Hostel</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">Secure and modern on-campus accommodation for 72 students, fostering a focused academic environment.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Survey Button for Quick Access */}
      <div className="fixed bottom-8 right-8 z-[60] flex flex-col items-end gap-3 pointer-events-none">
        <div className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl animate-bounce pointer-events-auto cursor-default">
          Student Feedback Live
        </div>
        <button
          onClick={() => setSurveyOpen(true)}
          className="w-16 h-16 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-2xl flex items-center justify-center text-2xl transition-all active:scale-95 pointer-events-auto group relative"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="absolute right-full mr-4 bg-white border border-slate-200 text-slate-900 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-xl">
            Quick Satisfaction Survey
          </div>
        </button>
      </div>

      {/* Dynamic Render Section: Operational Programs Catalog */}
      {showExplore && (
        <section className="py-16 bg-slate-50 border-b border-slate-200/60 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-10 text-center max-w-xl mx-auto">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
                Accredited Academic Tracks
              </h2>
              <p className="text-slate-500 font-medium text-xs sm:text-sm">
                Review verified technical departments registered under current
                CDACC national curriculum structures.
              </p>
            </div>

            {loadingDepts ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-60 bg-white border border-slate-200/60 rounded-xl p-6 space-y-4 animate-pulse"
                  >
                    <div className="h-4 bg-slate-200 rounded w-2/3" />
                    <div className="h-3 bg-slate-100 rounded w-1/2" />
                    <div className="space-y-2 pt-3">
                      <div className="h-2 bg-slate-100 rounded w-full" />
                      <div className="h-2 bg-slate-100 rounded w-5/6" />
                    </div>
                  </div>
                ))}
              </div>
            ) : departments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {departments.map((dept) => (
                  <div
                    key={dept.id}
                    className="bg-white border border-slate-200/50 rounded-xl p-6 shadow-sm hover:shadow-md transition-all border-t-2 border-t-emerald-600"
                  >
                    <h3 className="text-sm font-bold text-slate-900 mb-4 tracking-tight">
                      {dept.name}
                    </h3>
                    {dept.courses && dept.courses.length > 0 ? (
                      <div className="space-y-2">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                          Available Qualifications
                        </p>
                        <ul className="space-y-2">
                          {dept.courses.map((course, idx) => (
                            <li key={idx} className="flex items-start gap-2.5">
                              <span className="w-3.5 h-3.5 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center text-[9px] font-bold flex-shrink-0 mt-0.5">
                                ✓
                              </span>
                              <span className="text-xs text-slate-600 font-medium">
                                {course.name}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="text-slate-400 text-xs italic">
                        No training profiles logged under this track.
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-white rounded-xl border border-slate-200/60 max-w-sm mx-auto">
                <svg
                  className="w-8 h-8 mx-auto text-slate-300 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5M5 19v-2a2 2 0 012-2h11a2 2 0 002-2V7a2 2 0 00-2-2h-1"
                  />
                </svg>
                <p className="text-slate-500 font-semibold text-xs">
                  No live data links active in registrar records.
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Dynamic Render Section: Interactive Campus Virtual Tour Panel Layout Component */}
      {showVirtualTour && (
        <section className="py-16 bg-slate-950 text-white px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-10 text-center max-w-xl mx-auto">
              <span className="px-2.5 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[9px] font-bold uppercase tracking-wider rounded">
                Interactive Map Viewer
              </span>
              <h2 className="text-2xl font-extrabold tracking-tight mt-3 mb-2">
                Virtual Infrastructure Map
              </h2>
              <p className="text-slate-400 font-medium text-xs sm:text-sm">
                Explore state-of-the-art training environments built for
                continuous workforce scaling.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/[0.08] hover:border-emerald-500/30 transition-all cursor-pointer group">
                <div className="aspect-video w-full bg-slate-900 rounded-lg mb-4 flex items-center justify-center border border-white/5 text-xl group-hover:scale-[1.01] transition-transform">
                  🔧
                </div>
                <h4 className="font-bold text-sm mb-1 group-hover:text-emerald-400 transition-colors">
                  Mechanical Power Labs
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  Heavy production engine simulators, diagnostics
                  configurations, and equipment chains.
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/[0.08] hover:border-indigo-500/30 transition-all cursor-pointer group">
                <div className="aspect-video w-full bg-slate-900 rounded-lg mb-4 flex items-center justify-center border border-white/5 text-xl group-hover:scale-[1.01] transition-transform">
                  💻
                </div>
                <h4 className="font-bold text-sm mb-1 group-hover:text-indigo-400 transition-colors">
                  Advanced Software Hubs
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  High-performance computing topologies, localized server
                  systems, and network diagnostic setups.
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/[0.08] hover:border-amber-500/30 transition-all cursor-pointer group">
                <div className="aspect-video w-full bg-slate-900 rounded-lg mb-4 flex items-center justify-center border border-white/5 text-xl group-hover:scale-[1.01] transition-transform">
                  🍽️
                </div>
                <h4 className="font-bold text-sm mb-1 group-hover:text-amber-400 transition-colors">
                  Hospitality Operations Labs
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  Commercial industrial kitchen facilities, culinary setup
                  terminals, and logistics bays.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Global Bottom Information System Wrapper Block Component */}
      <footer className="py-10 border-t border-slate-200 bg-white text-center px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3.5">
          © 2026 Mago Technical & Vocational College (TVC)
        </div>
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs font-semibold text-slate-500">
          <a href="#" className="hover:text-emerald-600 transition-colors">
            Academic Framework
          </a>
          <a href="#" className="hover:text-emerald-600 transition-colors">
            Compliance Metrics
          </a>
          <a href="#" className="hover:text-emerald-600 transition-colors">
            Privacy Provisions
          </a>
        </div>
      </footer>

      {/* Global Functional State Modals Engine Container Component */}
      <SurveyModal isOpen={surveyOpen} onClose={() => setSurveyOpen(false)} />
      <CounsellingModal
        isOpen={counsellingOpen}
        onClose={() => setCounsellingOpen(false)}
      />
    </div>
  );
}
