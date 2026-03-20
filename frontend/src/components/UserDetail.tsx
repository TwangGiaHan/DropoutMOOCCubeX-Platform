"use client";
import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function UserDetail({ userId }: { userId: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:8000/api/students/${userId}/stats`)
      .then(res => res.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [userId]);

  if (loading) return <div className="h-64 flex items-center justify-center text-slate-500 animate-pulse">Loading User Records...</div>;
  if (!data) return <div className="p-8 text-center text-rose-600 bg-rose-50 border border-rose-200 rounded-xl">Failed to load user behavior.</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
        <div className="flex items-center gap-6 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl"></div>
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white text-4xl shadow-md border border-indigo-400 font-black z-10">
                U
            </div>
            <div className="z-10">
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">User Behavior Profiling</h2>
                <p className="text-slate-500 mt-1 text-lg"><span className="font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 font-bold">{data.user_id}</span></p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm group hover:border-slate-300 transition-colors">
                <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-2">Total Enrollments</p>
                <div className="flex items-end gap-3">
                  <p className="text-5xl font-black text-slate-900">{data.total_enrolled_courses}</p>
                  <span className="text-slate-400 font-medium mb-1">courses</span>
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm group hover:border-blue-300 transition-colors">
                <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-2">Total Video Interactions</p>
                <div className="flex items-end gap-3">
                  <p className="text-5xl font-black text-blue-600">{data.total_videos_watched}</p>
                  <span className="text-slate-400 font-medium mb-1">views</span>
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm group hover:border-emerald-300 transition-colors">
                <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-2">Total Assignments</p>
                <div className="flex items-end gap-3">
                  <p className="text-5xl font-black text-emerald-500">{data.total_attempts}</p>
                  <span className="text-slate-400 font-medium mb-1">submissions</span>
                </div>
            </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 mb-6">User Timeline Activity (Videos & Assignments)</h3>
            <div style={{ width: '100%', height: 320, minHeight: 320 }}>
                <ResponsiveContainer>
                    <AreaChart data={data.phases_data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="userColorVideos" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="userColorAttempts" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="#64748b" />
                        <YAxis stroke="#64748b" />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#0f172a' }} />
                        <Legend />
                        <Area type="monotone" dataKey="videos" name="Video Interactions" stroke="#2563eb" fillOpacity={1} fill="url(#userColorVideos)" strokeWidth={3} />
                        <Area type="monotone" dataKey="attempts" name="Submissions" stroke="#10b981" fillOpacity={1} fill="url(#userColorAttempts)" strokeWidth={3} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mt-8">
          <div className="p-6 border-b border-slate-200 bg-slate-50">
            <h3 className="text-xl font-bold text-slate-800">Enrollment & AI Forecast History</h3>
          </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-slate-200 text-slate-500 text-sm uppercase tracking-wider bg-white">
                            <th className="py-4 px-6 font-bold">Course ID</th>
                            <th className="py-4 px-6 font-bold text-center">AI Prediction</th>
                            <th className="py-4 px-6 font-bold text-center">Actual Outcome</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {data.enrollments.map((e: any, idx: number) => (
                            <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                <td className="py-5 px-6 font-mono text-slate-700 font-bold">{e.course_id}</td>
                                <td className="py-5 px-6 text-center">
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-sm ${e.predicted_dropout ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'}`}>
                                        {e.predicted_dropout ? 'Dropout Risk' : 'Retain'}
                                    </span>
                                </td>
                                <td className="py-5 px-6 text-center">
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-sm ${e.actual_dropout ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'}`}>
                                        {e.actual_dropout ? 'Dropped Out' : 'Retained'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {data.enrollments.length === 0 && <div className="p-8 text-center text-slate-500">No enrollment records found.</div>}
        </div>
    </div>
  );
}
