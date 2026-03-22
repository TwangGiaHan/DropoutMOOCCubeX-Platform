"use client";
import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, AreaChart, Area, BarChart, Bar } from 'recharts';

export default function CourseDetail({ courseId, onSelectUser }: { courseId: string, onSelectUser: (uid: string) => void }) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/courses/${courseId}/stats`)
            .then(res => res.json())
            .then(d => { setData(d); setLoading(false); })
            .catch(() => setLoading(false));
    }, [courseId]);

    if (loading) return <div className="h-64 flex items-center justify-center text-slate-500 animate-pulse">Loading Course Details...</div>;
    if (!data || !data.course) return <div className="p-8 text-center text-rose-600 bg-rose-50 border border-rose-200 rounded-xl">Failed to load course properties. Make sure the ID is correct.</div>;

    const pieData = [
        { name: 'Retain', value: data.retain },
        { name: 'Dropout', value: data.dropouts },
    ];
    const COLORS = ['#10b981', '#f43f5e'];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight relative Z-10">Course {data.course?.course_name || courseId}</h2>
                <p className="text-slate-600 mt-2 text-lg font-medium relative Z-10">Detailed metrics for <span className="font-mono text-slate-800 font-bold bg-slate-100 px-2 py-0.5 rounded">{courseId}</span> • Offered by {data.course?.school || "Unknown School"}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 transition-colors">
                    <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Total Enrollments</p>
                    <p className="text-4xl font-black text-slate-900 mt-3">{data.total_enrollments.toLocaleString()}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-rose-300 transition-colors">
                    <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Dropout Rate</p>
                    <p className="text-4xl font-black text-rose-500 mt-3">{data.dropout_rate.toFixed(1)}%</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 transition-colors">
                    <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Avg Views per User</p>
                    <p className="text-4xl font-black text-blue-500 mt-3">{data.phases_data[4]?.videos.toFixed(1) || 0}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-colors">
                    <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Avg Submissions</p>
                    <p className="text-4xl font-black text-indigo-500 mt-3">{data.phases_data[4]?.attempts.toFixed(1) || 0}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-800 mb-6">Phase Progression (Videos & Assignments)</h3>
                    <div style={{ width: '100%', height: 300, minHeight: 300 }}>
                        <ResponsiveContainer>
                            <AreaChart data={data.phases_data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorVideos" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorAttempts" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#0f172a' }} />
                                <Legend />
                                <Area type="monotone" dataKey="videos" name="Avg Videos" stroke="#3b82f6" fillOpacity={1} fill="url(#colorVideos)" strokeWidth={3} />
                                <Area type="monotone" dataKey="attempts" name="Avg Submissions" stroke="#6366f1" fillOpacity={1} fill="url(#colorAttempts)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-800 mb-6">Phase Progression (Active Days)</h3>
                    <div style={{ width: '100%', height: 300, minHeight: 300 }}>
                        <ResponsiveContainer>
                            <LineChart data={data.phases_data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <XAxis dataKey="name" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#0f172a' }} />
                                <Legend />
                                <Line type="monotone" dataKey="days" name="Avg Active Period (Days)" stroke="#10b981" strokeWidth={4} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-800 mb-6">Final Score Distribution</h3>
                    <div style={{ width: '100%', height: 300, minHeight: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={data.score_distribution} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                                <XAxis dataKey="range" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#0f172a' }} />
                                <Bar dataKey="count" name="Students" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    {data.score_distribution.length === 0 && <p className="text-center text-slate-400 mt-[-150px]">No scores recorded.</p>}
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-center items-center">
                    <h3 className="text-xl font-bold text-slate-800 mb-2 w-full text-left">Overall Attrition</h3>
                    <div style={{ width: '100%', height: 280, minHeight: 280 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie data={pieData} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={5} dataKey="value">
                                    {pieData.map((e, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', color: '#0f172a', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} itemStyle={{ fontWeight: 'bold' }} />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-rose-200 rounded-2xl shadow-sm overflow-hidden mt-8">
                <div className="bg-rose-50 border-b border-rose-100 p-6 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-rose-900 flex items-center gap-2">
                        <span className="text-rose-500">⚠</span> High Risk Students (Top Predictions)
                    </h3>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {data.at_risk_users.map((uid: string) => (
                            <div key={uid} className="flex justify-between items-center p-4 rounded-xl border border-slate-200 hover:border-rose-300 hover:shadow-md transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-lg shadow-sm border border-slate-200">👤</div>
                                    <div>
                                        <span className="font-mono text-slate-700 font-bold block">{uid}</span>
                                        <span className="text-xs font-semibold text-rose-500">High Attrition Risk</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => onSelectUser(uid)}
                                    className="px-4 py-2 bg-white border border-slate-200 text-blue-600 rounded-lg text-sm font-bold shadow-sm hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50 transition-all">
                                    Analyze Behavior
                                </button>
                            </div>
                        ))}
                        {data.at_risk_users.length === 0 && <p className="text-slate-500 italic py-4 col-span-2">No users predicted to drop out in this sample.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
