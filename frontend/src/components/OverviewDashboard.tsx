"use client";

import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

export default function OverviewDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/dashboard/overview")
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load dashboard data", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="h-64 flex items-center justify-center text-slate-500 animate-pulse">Loading Analytics Data...</div>;
  }

  if (!data) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 flex items-center gap-3">
        <p><strong>Connection Error:</strong> Cannot fetch data from `http://localhost:8000/api/dashboard/overview`. Make sure the FastAPI backend is running.</p>
      </div>
    );
  }

  const COLORS = ['#10b981', '#f43f5e'];

  const pieData = [
    { name: 'Retain', value: data.total_enrollments - Math.round((data.dropout_rate / 100) * data.total_enrollments) },
    { name: 'Dropout', value: Math.round((data.dropout_rate / 100) * data.total_enrollments) },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">System Overview</h1>
        <p className="text-slate-500 mt-2 text-lg">Predictive analytics for MOOCCubeX student retention</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard title="Total Students" value={data.total_students.toLocaleString()} trend="+12%" icon="users" />
        <MetricCard title="Active Courses" value={data.total_courses.toLocaleString()} icon="courses" />
        <MetricCard title="Total Enrollments" value={data.total_enrollments.toLocaleString()} icon="book" />
        <MetricCard title="Avg Dropout Rate" value={`${data.dropout_rate.toFixed(2)}%`} icon="chart" trendColor="text-rose-600 bg-rose-50 border-rose-200" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Student Enrollments Over Time</h2>
          <div style={{ width: '100%', height: 320, minHeight: 320 }}>
            <ResponsiveContainer>
              <LineChart data={data.trend} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#0f172a' }}
                  itemStyle={{ color: '#0f172a' }}
                />
                <Line type="monotone" dataKey="count" name="Enrollments" stroke="#f97316" strokeWidth={3} dot={{ r: 4, fill: '#f97316', strokeWidth: 0 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl"></div>
          <h2 className="text-xl font-bold text-slate-800 mb-6 leading-tight relative Z-10">Top Courses by Dropout</h2>
          <div className="space-y-4 relative Z-10">
            {data.top_courses.map((course: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-100 hover:border-slate-300 transition-colors shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">{idx + 1}</div>
                  <span className="font-mono text-slate-700 font-semibold">{course.course_id}</span>
                </div>
                <span className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                  {course.dropout_count.toLocaleString()}
                </span>
              </div>
            ))}
            {data.top_courses.length === 0 && <p className="text-slate-500 text-sm text-center py-4">No data available</p>}
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center">
        <div style={{ width: '100%', height: 320, minHeight: 320 }} className="md:w-1/2">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
                label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#0f172a' }} />
              <Legend verticalAlign="bottom" height={36} wrapperStyle={{ paddingTop: '20px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="w-full md:w-1/2 p-6 text-center md:text-left">
           <h3 className="text-2xl font-bold text-slate-800 mb-2">Global Dropout Distribution</h3>
           <p className="text-slate-600 text-lg">Total analyzed: <span className="text-slate-900 font-bold">{data.total_enrollments.toLocaleString()}</span> enrollments.</p>
           <div className="mt-6 p-4 border border-indigo-100 bg-indigo-50 rounded-xl">
             <p className="text-indigo-800 text-sm">The system predicts dropout risks based on Phases (1 to 5). Switch to the Phase Analysis tab for a timeline breakdown.</p>
           </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, trend, trendColor = 'text-emerald-700 bg-emerald-50 border-emerald-200' }: { title: string, value: any, icon: string, trend?: string, trendColor?: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 relative overflow-hidden group hover:border-slate-300 transition-colors shadow-sm">
      <div className="absolute -right-4 -top-4 opacity-5 transform group-hover:scale-110 transition-transform duration-500">
         <div className="w-32 h-32 bg-slate-900 rounded-full"></div>
      </div>
      <p className="text-slate-500 font-medium text-sm">{title}</p>
      <div className="mt-3 flex items-baseline gap-3">
        <p className="text-4xl font-extrabold text-slate-900 tracking-tight">{value}</p>
        {trend && <span className={`text-xs font-semibold px-2 py-1 rounded-md border ${trendColor}`}>{trend}</span>}
      </div>
    </div>
  );
}
