"use client";

import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';

export default function PhaseDashboard() {
  const [phase, setPhase] = useState<number>(5);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/dashboard/phase/${phase}`)
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load phase data", err);
        setLoading(false);
      });
  }, [phase]);

  if (loading && !data) {
    return <div className="h-64 flex items-center justify-center text-slate-500 animate-pulse">Loading Phase Data...</div>;
  }

  const chartData = data?.chart_data || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Phase Predictions</h2>
        <p className="text-slate-500 mt-2 text-lg">Detailed analysis of student behavior and dropout risks at different course phases.</p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 w-max">
          <label className="text-slate-700 font-semibold">Select Phase:</label>
          <select 
            value={phase} 
            onChange={(e) => setPhase(Number(e.target.value))}
            className="bg-slate-50 border border-slate-300 text-slate-900 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none font-medium"
          >
              {[1, 2, 3, 4, 5].map(p => (
                  <option key={p} value={p}>Phase {p}</option>
              ))}
          </select>
          {loading && <span className="text-blue-600 text-sm ml-4 animate-pulse">Refreshing...</span>}
      </div>

      {data && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <PhaseCard title={`Video views (P${phase})`} value={data.videos?.toLocaleString() || 0} />
              <PhaseCard title={`Submissions (P${phase})`} value={data.attempts?.toLocaleString() || 0} />
              <PhaseCard title="Sys Total Videos" value={data.total_all_videos?.toLocaleString() || 0} />
              <PhaseCard title="Sys Total Exercises" value={data.total_all_exercises?.toLocaleString() || 0} />
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-slate-800 mb-6">Predicted Dropout Volume (Phase {phase})</h3>
                <div style={{ width: '100%', height: 384, minHeight: 384 }}>
                    <ResponsiveContainer>
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                            <XAxis dataKey="name" stroke="#64748b" />
                            <YAxis stroke="#64748b" />
                            <RechartsTooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', color: '#0f172a', borderRadius: '8px' }} cursor={{fill: 'rgba(0,0,0,0.02)'}} />
                            <Legend />
                            <Bar dataKey="Actual Dropouts" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={60} />
                            <Bar dataKey="Predicted Dropouts" fill="#f97316" radius={[4, 4, 0, 0]} barSize={60} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
          </>
      )}

    </div>
  );
}

function PhaseCard({ title, value }: { title: string, value: string | number }) {
  return (
    <div className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-2xl p-6 hover:border-blue-300 transition-colors shadow-sm">
      <p className="text-slate-500 font-medium text-sm mb-2">{title}</p>
      <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{value}</p>
    </div>
  );
}
