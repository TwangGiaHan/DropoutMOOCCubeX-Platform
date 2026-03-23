"use client";

import React, { useState } from 'react';
import OverviewDashboard from '@/components/OverviewDashboard';
import PhaseDashboard from '@/components/PhaseDashboard';
import DataQuality from '@/components/DataQuality';
import CourseList from '@/components/CourseList';
import AIPredictions from '@/components/AIPredictions';
import CourseDetail from '@/components/CourseDetail';
import UserDetail from '@/components/UserDetail';

export default function Home() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const handleSelectCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    setActiveTab("course_detail");
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUserId(userId);
    setActiveTab("user_detail");
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "phases", label: "Phase Analysis", icon: "📈" },
    { id: "courses", label: "Courses", icon: "📚" },
    { id: "data", label: "Data Quality", icon: "🛡️" },
    { id: "ai", label: "AI Models", icon: "🧠" }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">

      {/* Light Theme Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="text-white font-black text-xl">M</span>
              </div>
              <span className="font-extrabold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">MOOCCubeX API</span>
            </div>

            <nav className="hidden md:flex space-x-1 overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                  }}
                  className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id
                      ? 'bg-blue-50 text-blue-600 shadow-inner border border-blue-100'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                >
                  <span className="text-base">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
              {selectedCourseId && (
                <button
                  onClick={() => setActiveTab("course_detail")}
                  className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${activeTab === "course_detail"
                      ? 'bg-rose-50 text-rose-600 shadow-inner border border-rose-100'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                >
                  <span className="text-base">🎯</span>
                  Course View
                </button>
              )}
              {selectedUserId && (
                <button
                  onClick={() => setActiveTab("user_detail")}
                  className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${activeTab === "user_detail"
                      ? 'bg-indigo-50 text-indigo-600 shadow-inner border border-indigo-100'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                >
                  <span className="text-base">👤</span>
                  User View
                </button>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[70vh]">
        {activeTab === "overview" && <OverviewDashboard />}
        {activeTab === "phases" && <PhaseDashboard />}
        {activeTab === "courses" && <CourseList onSelectCourse={handleSelectCourse} />}
        {activeTab === "data" && <DataQuality />}
        {activeTab === "ai" && <AIPredictions />}

        {activeTab === "course_detail" && selectedCourseId && <CourseDetail courseId={selectedCourseId} onSelectUser={handleSelectUser} />}
        {activeTab === "user_detail" && selectedUserId && <UserDetail userId={selectedUserId} />}
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-slate-200 mt-20">
        <p className="text-center text-slate-500 text-sm">© 2026 DropoutMOOCCubeX Fullstack Platform. Built with Next.js & FastAPI.</p>
      </footer>
    </div>
  );
}
