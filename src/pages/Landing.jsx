import React, { useState, useEffect } from "react";
import SurveyModal from "../components/public/SurveyModal";
import CounsellingModal from "../components/public/CounsellingModal";
import api from "../api";

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
    <div className="min-h-screen bg-[#fcfdfe] text-gray-900 selection:bg-[#0a6e4e]/10 selection:text-[#0a6e4e] font-sans antialiased">
      {/* High-Contrast Premium Styled Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md z-50 border-b border-gray-200/80 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-6 h-24 flex justify-between items-center w-full">
          {/* Main Elevated Brand Title Identity Segment */}
          <div className="flex items-center gap-4 flex-shrink-0 group cursor-default">
            <div className="w-13 h-13 bg-[#0a6e4e] rounded-xl flex items-center justify-center text-white text-2xl font-black italic shadow-lg shadow-[#0a6e4e]/20 group-hover:rotate-6 transition-transform duration-300">
              M
            </div>
            <div>
              <div className="text-xl md:text-2xl font-black text-gray-900 tracking-tighter uppercase leading-none bg-gradient-to-r from-gray-900 via-gray-800 to-[#0a6e4e] bg-clip-text text-transparent">
                Mago TVTC
              </div>
              <div className="text-[10px] font-black text-[#0a6e4e] uppercase tracking-[0.25em] mt-1 block">
                Technical Excellence Center
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-4 relative">
            {/* Career Guidance Dropdown Selector Component */}
            <div className="relative">
              <button
                onClick={() => {
                  setCareerDropdownOpen(!careerDropdownOpen);
                  setCounselingDropdownOpen(false);
                }}
                className={`h-11 px-4 rounded-xl font-extrabold text-xs uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 ${
                  careerDropdownOpen
                    ? "bg-[#0a6e4e] text-white shadow-md"
                    : "bg-[#0a6e4e]/10 text-[#0a6e4e] hover:bg-[#0a6e4e]/20"
                }`}
              >
                Career Guidance
                <span
                  className={`text-[9px] transform transition-transform duration-200 ${careerDropdownOpen ? "rotate-180" : "rotate-0"}`}
                >
                  ▼
                </span>
              </button>

              {careerDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-2xl py-2 z-50 transition-all">
                  <button
                    onClick={() => {
                      setSurveyOpen(true);
                      setCareerDropdownOpen(false);
                    }}
                    className="w-full text-left px-5 py-3 text-xs font-bold text-gray-700 hover:bg-gray-50 hover:text-[#0a6e4e] flex items-center gap-2 transition-colors"
                  >
                    <span>📝</span> Satisfaction Survey
                  </button>
                </div>
              )}
            </div>

            {/* Counseling / Guidance Dropdown Selector Component */}
            <div className="relative">
              <button
                onClick={() => {
                  setCounselingDropdownOpen(!counselingDropdownOpen);
                  setCareerDropdownOpen(false);
                }}
                className={`h-11 px-4 rounded-xl font-extrabold text-xs uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 ${
                  counselingDropdownOpen
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                }`}
              >
                Counseling
                <span
                  className={`text-[9px] transform transition-transform duration-200 ${counselingDropdownOpen ? "rotate-180" : "rotate-0"}`}
                >
                  ▼
                </span>
              </button>

              {counselingDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-2xl py-2 z-50 transition-all">
                  <button
                    onClick={() => {
                      setCounsellingOpen(true);
                      setCounselingDropdownOpen(false);
                    }}
                    className="w-full text-left px-5 py-3 text-xs font-bold text-gray-700 hover:bg-gray-50 hover:text-blue-600 flex items-center gap-2 transition-colors"
                  >
                    <span>🕊️</span> Request Counseling
                  </button>
                </div>
              )}
            </div>

            <div className="h-6 w-[1px] bg-gray-200 mx-1"></div>

            {/* Base Portal Authentication Trigger */}
            <button
              onClick={onPortalLogin}
              className="h-11 px-6 bg-[#0a6e4e] text-white rounded-xl font-extrabold text-xs uppercase tracking-widest hover:bg-[#07533b] hover:scale-[1.02] transition-all shadow-md shadow-[#0a6e4e]/20 active:scale-95"
            >
              Student Portal Login
            </button>
          </div>

          {/* Mobile Hamburguer Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-700 focus:outline-none"
          >
            <span className="text-2xl">{mobileMenuOpen ? "✕" : "☰"}</span>
          </button>
        </div>

        {/* Mobile Dropdown Panel Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden w-full border-t border-gray-100 bg-white px-6 py-4 flex flex-col gap-3 shadow-inner">
            <button
              onClick={() => {
                setSurveyOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 px-4 bg-gray-50 rounded-xl text-left font-bold text-sm text-gray-700 hover:bg-gray-100"
            >
              📝 Take Satisfaction Survey
            </button>
            <button
              onClick={() => {
                setCounsellingOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 px-4 bg-gray-50 rounded-xl text-left font-bold text-sm text-gray-700 hover:bg-gray-100"
            >
              🕊️ Book Counseling Session
            </button>
            <button
              onClick={() => {
                onPortalLogin();
                setMobileMenuOpen(false);
              }}
              className="w-full py-3.5 px-4 bg-[#0a6e4e] text-white rounded-xl font-bold text-sm text-center tracking-wider shadow-sm"
            >
              Secure Student Login
            </button>
          </div>
        )}
      </nav>

      {/* Proportional Hero Section Layout Framework */}
      <header className="pt-36 lg:pt-44 pb-16 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Main Description Column Block */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl text-[#0a6e4e] text-xs font-black uppercase tracking-widest shadow-sm">
              <span className="w-2 h-2 bg-[#0a6e4e] rounded-full animate-ping"></span>
              Admissions Open 2026 / 2027
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-gray-900 tracking-tight leading-[1.05]">
              Hands-On <br />
              <span className="text-[#0a6e4e] relative inline-block">
                Technical
                <span className="absolute left-0 bottom-1 w-full h-[6px] bg-[#0a6e4e]/10 rounded-full"></span>
              </span>{" "}
              <br />
              Training Systems.
            </h1>
            <p className="text-base md:text-lg text-gray-600 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Equipping forward-thinking professionals with certified expertise.
              Accelerate your career within industry-backed engineering
              installations and state-of-the-art labs.
            </p>

            {/* Primary UI Call-To-Action Switches */}
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={handleExplorePrograms}
                className={`h-14 px-8 rounded-xl font-black uppercase text-xs tracking-widest transition-all shadow-md active:scale-95 ${
                  showExplore
                    ? "bg-gray-900 text-white shadow-gray-900/10"
                    : "bg-[#0a6e4e] text-white shadow-[#0a6e4e]/20 hover:bg-[#075a40]"
                }`}
              >
                {showExplore ? "✕ Hide Catalog" : "⚡ Explore Programs"}
              </button>
              <button
                onClick={handleVirtualTour}
                className={`h-14 px-8 border-2 rounded-xl font-black uppercase text-xs tracking-widest transition-all active:scale-95 ${
                  showVirtualTour
                    ? "bg-blue-50 text-blue-700 border-blue-200 shadow-sm"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 shadow-sm"
                }`}
              >
                {showVirtualTour ? "✕ Close Tour" : "🌐 Virtual Tour"}
              </button>
            </div>
          </div>

          {/* Student Quick Access Launchpad Card Segment */}
          <div className="lg:col-span-5 w-full">
            <div className="bg-gradient-to-b from-gray-50 to-white p-6 md:p-8 rounded-3xl border border-gray-200/70 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-[60px]"></div>
              <h3 className="text-lg font-black text-gray-900 tracking-tight mb-1">
                Student Quick Operations
              </h3>
              <p className="text-xs text-gray-500 mb-6">
                Access secure portal modules immediately.
              </p>

              <div className="space-y-3">
                <button
                  onClick={onPortalLogin}
                  className="w-full h-14 bg-gray-900 hover:bg-black text-white rounded-xl flex items-center justify-between px-5 font-bold text-sm transition-all shadow-md group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🔐</span>
                    <span>Sign In to Student Portal</span>
                  </div>
                  <span className="transform group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setSurveyOpen(true)}
                    className="h-24 bg-white border border-gray-200 hover:border-[#0a6e4e] hover:shadow-sm rounded-xl p-4 flex flex-col justify-between items-start text-left transition-all"
                  >
                    <span className="text-xl">📝</span>
                    <span className="text-xs font-bold text-gray-800">
                      Course Survey
                    </span>
                  </button>
                  <button
                    onClick={() => setCounsellingOpen(true)}
                    className="h-24 bg-white border border-gray-200 hover:border-blue-500 hover:shadow-sm rounded-xl p-4 flex flex-col justify-between items-start text-left transition-all"
                  >
                    <span className="text-xl">🕊️</span>
                    <span className="text-xs font-bold text-gray-800">
                      Counseling Hub
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Institutional Metrics Stats Bar */}
      <section className="bg-gradient-to-r from-gray-900 to-neutral-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-white/10">
          <div className="pt-4 sm:pt-0">
            <div className="text-4xl font-black text-emerald-400">70%</div>
            <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-2">
              Practical-First Training Matrix
            </div>
          </div>
          <div className="pt-6 sm:pt-0">
            <div className="text-4xl font-black text-amber-400">100%</div>
            <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-2">
              Industrial Attachment Placement
            </div>
          </div>
          <div className="pt-6 sm:pt-0">
            <div className="text-4xl font-black text-blue-400">15+</div>
            <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-2">
              Certified Specialized Workshops
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Render Section: Operational Programs Catalog */}
      {showExplore && (
        <section className="py-20 bg-gray-50 border-y border-gray-200/60 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-14 text-center max-w-xl mx-auto">
              <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-3">
                Accredited Academic Tracks
              </h2>
              <p className="text-gray-500 font-medium text-sm">
                Review verified technical departments registered under current
                CDACC national curriculum structures.
              </p>
            </div>

            {loadingDepts ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-64 bg-white border border-gray-200 rounded-2xl p-6 space-y-4 animate-pulse"
                  >
                    <div className="h-6 bg-gray-200 rounded-md w-2/3"></div>
                    <div className="h-4 bg-gray-100 rounded-md w-1/2"></div>
                    <div className="space-y-2 pt-4">
                      <div className="h-3 bg-gray-100 rounded-md w-full"></div>
                      <div className="h-3 bg-gray-100 rounded-md w-5/6"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : departments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {departments.map((dept) => (
                  <div
                    key={dept.id}
                    className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all relative overflow-hidden group border-t-4 border-t-[#0a6e4e]"
                  >
                    <h3 className="text-lg font-black text-gray-900 mb-4 tracking-tight group-hover:text-[#0a6e4e] transition-colors">
                      {dept.name}
                    </h3>
                    {dept.courses && dept.courses.length > 0 ? (
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                          Available Qualifications
                        </p>
                        <ul className="space-y-2">
                          {dept.courses.map((course, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="w-4 h-4 rounded-full bg-emerald-50 text-[#0a6e4e] flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">
                                ✓
                              </span>
                              <span className="text-xs text-gray-600 font-semibold">
                                {course.name}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="text-gray-400 text-xs italic">
                        No training profiles logged under this track.
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-200 max-w-sm mx-auto shadow-inner">
                <span className="text-3xl mb-2 block">📁</span>
                <p className="text-gray-500 font-bold text-xs">
                  No live data links active in registrar records.
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Dynamic Render Section: Interactive Campus Virtual Tour Panel */}
      {showVirtualTour && (
        <section className="py-20 bg-neutral-950 text-white px-6 border-y border-black">
          <div className="max-w-7xl mx-auto">
            <div className="mb-14 text-center max-w-xl mx-auto">
              <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-black uppercase tracking-widest rounded-md">
                Interactive Viewer
              </span>
              <h2 className="text-3xl font-black tracking-tight mt-4 mb-3 text-white">
                Mago Virtual Infrastructure Map
              </h2>
              <p className="text-gray-400 font-medium text-xs">
                Explore state-of-the-art training environments built for
                continuous workforce scaling.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-emerald-500/30 transition-all cursor-pointer group">
                <div className="aspect-video w-full bg-neutral-800 rounded-xl mb-4 overflow-hidden relative flex items-center justify-center text-2xl group-hover:scale-[1.02] transition-transform">
                  🔧
                </div>
                <h4 className="font-bold text-base mb-1 text-white group-hover:text-emerald-400 transition-colors">
                  Mechanical Power Labs
                </h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Heavy production engine simulators, diagnostics
                  configurations, and equipment chains.
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-blue-500/30 transition-all cursor-pointer group">
                <div className="aspect-video w-full bg-neutral-800 rounded-xl mb-4 overflow-hidden relative flex items-center justify-center text-2xl group-hover:scale-[1.02] transition-transform">
                  💻
                </div>
                <h4 className="font-bold text-base mb-1 text-white group-hover:text-blue-400 transition-colors">
                  Advanced Software Hubs
                </h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  High-performance computing topologies, localized server
                  systems, and network diagnostic setups.
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-amber-500/30 transition-all cursor-pointer group">
                <div className="aspect-video w-full bg-neutral-800 rounded-xl mb-4 overflow-hidden relative flex items-center justify-center text-2xl group-hover:scale-[1.02] transition-transform">
                  🍽️
                </div>
                <h4 className="font-bold text-base mb-1 text-white group-hover:text-amber-400 transition-colors">
                  Hospitality Operations Labs
                </h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Commercial industrial kitchen facilities, culinary setup
                  terminals, and logistics bays.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer Component Wrapper */}
      <footer className="py-12 border-t border-gray-200 bg-white text-center px-6">
        <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-3">
          © 2026 Mago Technical & Vocational Training College
        </div>
        <div className="flex flex-wrap justify-center gap-6 text-xs font-bold text-gray-500">
          <a href="#" className="hover:text-[#0a6e4e] transition-colors">
            Academic Framework
          </a>
          <a href="#" className="hover:text-[#0a6e4e] transition-colors">
            Compliance Metrics
          </a>
          <a href="#" className="hover:text-[#0a6e4e] transition-colors">
            Privacy Provisions
          </a>
        </div>
      </footer>

      {/* Modals Container */}
      <SurveyModal isOpen={surveyOpen} onClose={() => setSurveyOpen(false)} />
      <CounsellingModal
        isOpen={counsellingOpen}
        onClose={() => setCounsellingOpen(false)}
      />
    </div>
  );
}
