import { useState } from "react";
import StudentProfiles from "../components/career/StudentProfiles";
import SatisfactionSurvey from "../components/career/SatisfactionSurvey";
import Interventions from "../components/career/Interventions";
import JobPlacement from "../components/career/JobPlacement";
import CareerAnalytics from "../components/career/CareerAnalytics";

export default function CareerGuidance() {
  const [tab, setTab] = useState("metrics");

  const tabs = [
    { id: "metrics", label: "Dashboard & Metrics", icon: "📊" },
    { id: "profiles", label: "Student Profiles", icon: "👤" },
    { id: "survey", label: "Satisfaction Survey", icon: "📝" },
    { id: "interventions", label: "Interventions", icon: "⚠️" },
    { id: "placements", label: "Job Placements", icon: "💼" },
  ];

  return (
    <div className="min-h-screen">
      {/* Sticky Navigation Sub-bar */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 border-b border-gray-100 mb-8 -mx-8 px-8 no-print">
        <div className="flex gap-8">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`py-4 px-2 text-sm font-bold transition-all border-b-2 ${
                tab === t.id
                  ? "border-[#0a6e4e] text-[#0a6e4e]"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              <span className="mr-2">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="">
        {tab === "metrics" && <CareerAnalytics />}
        {tab === "profiles" && <StudentProfiles />}
        {tab === "survey" && <SatisfactionSurvey />}
        {tab === "interventions" && <Interventions />}
        {tab === "placements" && <JobPlacement />}
      </div>
    </div>
  );
}
