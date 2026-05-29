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

  // Local state management handles for open dropdown structures
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
      <nav className="fixed top-0 left-0 right-0 bg-gradient-to-b from-white via-white/95 to-white/90 backdrop-blur-md z-50 border-b border-gray-200/80 shadow-md transition-all">
        <div className="max-w-7xl mx-auto px-6 h-24 flex justify-between items-center w-full">
          {/* Main Elevated Brand Title Identity Segment */}
          <div className="flex items-center gap-4 flex-shrink-0 group cursor-default">
            <div className="w-14 h-14 bg-[#0a6e4e] rounded-2xl flex items-center justify-center text-white text-3xl font-black italic shadow-xl shadow-[#0a6e4e]/30 group-hover:rotate-6 transition-transform duration-300">
              M
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-black text-gray-900 tracking-tighter uppercase leading-none bg-gradient-to-r from-gray-900 via-gray-800 to-[#0a6e4e] bg-clip-text text-transparent">
                Mago TVTC
              </div>
              <div className="text-[11px] font-black text-[#0a6e4e] uppercase tracking-[0.3em] mt-1.5 block">
                Technical Excellence Center
              </div>
            </div>
          </div>

          {/* Clean Unified Horizontal Action Header Cluster with Dropdown Modifiers */}
          <div className="flex items-center gap-4 relative">
            {/* 1. Career Guidance Dropdown Selector Component */}
            <div className="relative">
              <button
                onClick={() => {
                  setCareerDropdownOpen(!careerDropdownOpen);
                  setCounselingDropdownOpen(false); // Auto-close opposite dropdown element
                }}
                className={`h-12 px-5 rounded-xl font-extrabold text-xs uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 ${
                  careerDropdownOpen
                    ? "bg-[#0a6e4e] text-white shadow-md"
                    : "bg-[#0a6e4e]/10 text-[#0a6e4e] hover:bg-[#0a6e4e]/20"
                }`}
              >
                Career Guidance
                <span
                  className={`text-[10px] transform transition-transform duration-200 ${careerDropdownOpen ? "rotate-180" : "rotate-0"}`}
                >
                  ▼
                </span>
              </button>

              {careerDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
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

            {/* 2. Counseling / Guidance Dropdown Selector Component */}
            <div className="relative">
              <button
                onClick={() => {
                  setCounselingDropdownOpen(!counselingDropdownOpen);
                  setCareerDropdownOpen(false); // Auto-close opposite dropdown element
                }}
                className={`h-12 px-5 rounded-xl font-extrabold text-xs uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 ${
                  counselingDropdownOpen
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                }`}
              >
                Counseling / Guidance
                <span
                  className={`text-[10px] transform transition-transform duration-200 ${counselingDropdownOpen ? "rotate-180" : "rotate-0"}`}
                >
                  ▼
                </span>
              </button>

              {counselingDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
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

            <div className="h-8 w-[1px] bg-gray-200 mx-1 hidden md:block"></div>

            {/* 3. Base Portal Registration Activation Core Control */}
            <button
              onClick={onPortalLogin}
              className="h-12 px-7 bg-gray-900 text-white rounded-xl font-extrabold text-xs uppercase tracking-widest hover:bg-black hover:scale-[1.02] transition-all shadow-lg active:scale-95 border border-gray-800"
            >
              Portal Login
            </button>
          </div>
        </div>
      </nav>

      {/* Proportional Hero Section Layout Framework */}
      <header className="pt-44 pb-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Main Description Column Block */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl text-[#0a6e4e] text-xs font-black uppercase tracking-widest shadow-sm">
              <span className="w-2 h-2 bg-[#0a6e4e] rounded-full animate-ping"></span>
              Admissions Open 2026 / 2027
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 tracking-tight leading-[1.02]">
              Hands-On <br />
              <span className="text-[#0a6e4e] relative inline-block">
                Technical
                <span className="absolute left-0 bottom-2 w-full h-[8px] bg-[#0a6e4e]/10 rounded-full"></span>
              </span>{" "}
              <br />
              Training Systems.
            </h1>
            <p className="text-lg md:text-xl text-gray-600 font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed text-balance">
              Equipping forward-thinking professionals with certified expertise.
              Accelerate your career within industry-backed engineering
              installations, state-of-the-art computer labs, and elite
              industrial hospitality bays.
            </p>

            {/* Primary UI Call-To-Action Switches */}
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={handleExplorePrograms}
                className={`h-16 px-10 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-xl active:scale-95 ${
                  showExplore
                    ? "bg-gray-900 text-white shadow-gray-900/10"
                    : "bg-[#0a6e4e] text-white shadow-[#0a6e4e]/20 hover:bg-[#075a40]"
                }`}
              >
                {showExplore ? "✕ Hide Catalog" : "⚡ Explore Programs"}
              </button>
              <button
                onClick={handleVirtualTour}
                className={`h-16 px-10 border-2 rounded-2xl font-black uppercase text-xs tracking-widest transition-all active:scale-95 ${
                  showVirtualTour
                    ? "bg-blue-50 text-blue-700 border-blue-200 shadow-md"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 shadow-sm"
                }`}
              >
                {showVirtualTour ? "✕ Close Campus Tour" : "🌐 Virtual Tour"}
              </button>
            </div>
          </div>

          {/* Balanced Image Section Frame Panel */}
          <div className="lg:col-span-5 relative hidden lg:block">
            <div className="absolute -top-12 -right-12 w-56 h-56 bg-amber-400 rounded-full blur-[110px] opacity-25 animate-pulse"></div>
            <div className="absolute -bottom-12 -left-12 w-56 h-56 bg-[#0a6e4e] rounded-full blur-[110px] opacity-20"></div>
            <div className="relative bg-white p-6 rounded-[48px] shadow-2xl border border-gray-100 overflow-hidden transform hover:scale-[1.01] transition-all duration-500">
              <div className="aspect-[4/3] bg-gray-50 rounded-[36px] overflow-hidden relative group">
                <img
                  src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1000"
                  alt="Mago Technical Students Practical Workshop Room"
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <span className="text-white text-xs font-bold tracking-wider uppercase">
                    Main Engineering Facility Bay
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Institutional Institutional Metrics Stats Bar */}
      <section className="bg-gradient-to-r from-gray-900 to-neutral-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-white/10">
          <div className="pt-4 sm:pt-0">
            <div className="text-4xl md:text-5xl font-black text-emerald-400">
              70%
            </div>
            <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-2">
              Practical-First Training Matrix
            </div>
          </div>
          <div className="pt-6 sm:pt-0">
            <div className="text-4xl md:text-5xl font-black text-amber-400">
              100%
            </div>
            <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-2">
              Industrial Attachment Placement
            </div>
          </div>
          <div className="pt-6 sm:pt-0">
            <div className="text-4xl md:text-5xl font-black text-blue-400">
              15+
            </div>
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
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-3">
                Accredited Academic Tracks
              </h2>
              <p className="text-gray-500 font-medium text-sm md:text-base">
                Review verified technical departments registered under current
                CDACC national curriculum structures.
              </p>
            </div>

            {loadingDepts ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-64 bg-white border border-gray-200 rounded-3xl p-6 space-y-4 animate-pulse"
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
                    className="bg-white border border-gray-100 rounded-[28px] p-8 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group border-t-4 border-t-[#0a6e4e]"
                  >
                    <h3 className="text-xl font-black text-gray-900 mb-6 tracking-tight group-hover:text-[#0a6e4e] transition-colors">
                      {dept.name}
                    </h3>

                    {dept.courses && dept.courses.length > 0 ? (
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                          Available Qualifications
                        </p>
                        <ul className="space-y-3.5">
                          {dept.courses.map((course, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                              <span className="w-5 h-5 rounded-full bg-emerald-50 text-[#0a6e4e] flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5">
                                ✓
                              </span>
                              <span className="text-sm text-gray-600 font-semibold leading-snug">
                                {course.name}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm italic">
                        No training profiles logged under this track.
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 max-w-md mx-auto shadow-inner">
                <span className="text-4xl mb-3 block">📁</span>
                <p className="text-gray-500 font-bold text-sm">
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
              <h2 className="text-3xl md:text-4xl font-black tracking-tight mt-4 mb-3 text-white">
                Mago Virtual Infrastructure Map
              </h2>
              <p className="text-gray-400 font-medium text-sm">
                Click any asset hub to inspect technical tooling standards and
                continuous training resources.
              </p>
            </div>

            {/* Virtual Campus Infrastructure Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 hover:border-emerald-500/30 transition-all cursor-pointer group">
                <div className="aspect-video w-full bg-neutral-800 rounded-2xl mb-5 overflow-hidden relative">
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-3xl group-hover:scale-110 transition-transform duration-300">
                    🔧
                  </div>
                </div>
                <h4 className="font-bold text-lg mb-2 text-white group-hover:text-emerald-400 transition-colors">
                  Mechanical Power Labs
                </h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Heavy production engine simulators, latency diagnostic units,
                  and hydraulic machining equipment chains.
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 hover:border-blue-500/30 transition-all cursor-pointer group">
                <div className="aspect-video w-full bg-neutral-800 rounded-2xl mb-5 overflow-hidden relative">
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-3xl group-hover:scale-110 transition-transform duration-300">
                    💻
                  </div>
                </div>
                <h4 className="font-bold text-lg mb-2 text-white group-hover:text-blue-400 transition-colors">
                  Advanced Software Hubs
                </h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  High-performance network processing clusters, fiber testing
                  terminals, and system architecture platforms.
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 hover:border-amber-500/30 transition-all cursor-pointer group">
                <div className="aspect-video w-full bg-neutral-800 rounded-2xl mb-5 overflow-hidden relative">
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-3xl group-hover:scale-110 transition-transform duration-300">
                    🍽️
                  </div>
                </div>
                <h4 className="font-bold text-lg mb-2 text-white group-hover:text-amber-400 transition-colors">
                  Hospitality Operations Labs
                </h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Commercial industrial kitchen systems, hospitality management
                  terminals, and high-volume operations equipment.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Three Pillar Academic Core Spotlights */}
      <section className="py-20 px-6 max-w-7xl mx-auto border-b border-gray-100">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">
            Our Core Academic Fields
          </h2>
          <p className="text-gray-500 text-sm mt-2 font-medium">
            Industry aligned specializations designed for workforce matching.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm hover:scale-[1.02] transition-transform">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-xl text-[#0a6e4e] font-bold mb-6">
              01
            </div>
            <h4 className="text-xl font-black text-gray-900 mb-2">
              Mechanical Engineering
            </h4>
            <p className="text-sm text-gray-500 leading-relaxed">
              Automotive technologies, machinery calibrations, welding
              fabrications, and structural designs.
            </p>
          </div>
          <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm hover:scale-[1.02] transition-transform">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-xl text-blue-600 font-bold mb-6">
              02
            </div>
            <h4 className="text-xl font-black text-gray-900 mb-2">
              ICT & Computing
            </h4>
            <p className="text-sm text-gray-500 leading-relaxed">
              Software programming tracks, secure enterprise networking,
              database systems, and hardware setups.
            </p>
          </div>
          <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm hover:scale-[1.02] transition-transform">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-xl text-amber-600 font-bold mb-6">
              03
            </div>
            <h4 className="text-xl font-black text-gray-900 mb-2">
              Hospitality & Tourism
            </h4>
            <p className="text-sm text-gray-500 leading-relaxed">
              Professional culinary production, catering management,
              institutional housekeeping, and food systems.
            </p>
          </div>
        </div>
      </section>

      {/* Main Kiosk Action Triggers Cards Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Survey Workflow Activation Card */}
          <div
            onClick={() => setSurveyOpen(true)}
            className="group bg-white p-12 rounded-[40px] border border-gray-200/80 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#0a6e4e]/5 rounded-bl-[100px] group-hover:bg-[#0a6e4e]/10 transition-colors"></div>
            <div className="text-5xl mb-8 group-hover:scale-110 transition-all duration-300">
              📝
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">
              Course Satisfaction Survey
            </h3>
            <p className="text-gray-500 font-medium mb-8 text-base leading-relaxed">
              Active students are encouraged to submit institutional metrics.
              Log feedback regarding syllabus pace, workspace tools, and program
              administration.
            </p>
            <div className="inline-flex items-center gap-3 text-[#0a6e4e] font-black uppercase text-xs tracking-widest">
              Launch Survey Portal{" "}
              <span className="text-xl group-hover:translate-x-3 transition-all duration-300">
                →
              </span>
            </div>
          </div>

          {/* Counselling Advisory Card */}
          <div
            onClick={() => setCounsellingOpen(true)}
            className="group bg-gradient-to-br from-gray-900 via-neutral-900 to-black p-12 rounded-[40px] shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden border border-gray-800"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-[100px] group-hover:bg-blue-500/10 transition-colors"></div>
            <div className="text-5xl mb-8 group-hover:scale-110 transition-all duration-300">
              🕊️
            </div>
            <h3 className="text-3xl font-black text-white mb-4 tracking-tight">
              Confidential Advisory Link
            </h3>
            <p className="text-neutral-400 font-medium mb-8 text-base leading-relaxed">
              Connect privately with professional welfare directors. Submit
              private booking updates and check-ins straight to our student
              health hub.
            </p>
            <div className="inline-flex items-center gap-3 text-emerald-400 font-black uppercase text-xs tracking-widest">
              Request Guidance Meeting{" "}
              <span className="text-xl group-hover:translate-x-3 transition-all duration-300">
                →
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Details Wrapper */}
      <footer className="py-16 border-t border-gray-200 bg-white text-center px-6">
        <div className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">
          © 2026 Mago Technical & Vocational Training College
        </div>
        <div className="flex flex-wrap justify-center gap-8 text-xs font-bold text-gray-500">
          <a
            href="#"
            className="hover:text-[#0a6e4e] transition-colors tracking-wide"
          >
            Academic Framework
          </a>
          <a
            href="#"
            className="hover:text-[#0a6e4e] transition-colors tracking-wide"
          >
            Compliance & Tenders
          </a>
          <a
            href="#"
            className="hover:text-[#0a6e4e] transition-colors tracking-wide"
          >
            Institutional Privacy Rules
          </a>
        </div>
      </footer>

      {/* Global Form Sheets View Modals */}
      <SurveyModal isOpen={surveyOpen} onClose={() => setSurveyOpen(false)} />
      <CounsellingModal
        isOpen={counsellingOpen}
        onClose={() => setCounsellingOpen(false)}
      />
    </div>
  );
}
