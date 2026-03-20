"use client";

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const DQ_RESULTS = {
    completeness: {
        overall: 0.4885,
        notes: [
            "Dataset Completeness = 0.4885 (low level, severe missing data).",
            "Missing mainly in phase behavior columns (video/problem/comment).",
            "Cause: Not all users have events; merging generates nulls."
        ],
        top_missing_cols: [
            {"Column": "phase1_days", "Null_Rate": 0.90},
            {"Column": "cutoff_time_P1", "Null_Rate": 0.88},
            {"Column": "n_attempts_P1", "Null_Rate": 0.86},
            {"Column": "accuracy_rate_P1", "Null_Rate": 0.86},
            {"Column": "avg_score_P1", "Null_Rate": 0.86},
            {"Column": "avg_duration_P4", "Null_Rate": 0.82},
        ],
    },
    consistency: {
        overall: 0.6449,
        rule_pass_rates: [
            {"Rule": "Non-Null", "Pass_Rate": 0.0432},
            {"Rule": "Logical Constraints", "Pass_Rate": 0.4715},
            {"Rule": "Data Type", "Pass_Rate": 1.0},
            {"Rule": "Domain Range", "Pass_Rate": 1.0},
            {"Rule": "Uniqueness", "Pass_Rate": 1.0},
            {"Rule": "Foreign Keys", "Pass_Rate": 1.0},
        ],
        notes: [
            "Avg Consistency Score = 64.49%.",
            "Strengths: Data Type, Domain Range, Uniqueness, Foreign Keys reach 100%.",
            "Weaknesses: Non-Null is only 4.32% and Logical Constraints 47.15%."
        ],
    },
    acc_dq: {
        s_perf: 0.8903,
        s_san_plus: 0.0143,
        acc_dq_score: 17.05,
        notes: [
            "High S_perf (~0.89) → prediction model is performant.",
            "Very low S_san+ (~0.0143) → signs of Mode Collapse and Overconfidence.",
            "Low Acc-DQ (17.05) is primarily driven down by S_san+."
        ]
    }
};

export default function DataQuality() {
    const [tab, setTab] = useState("completeness");

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Data Quality Metrics</h2>
                <p className="text-slate-500 mt-2 text-lg">Evaluate structural integrity, consistency, and reliability of the Data Lake.</p>
            </div>

            <div className="flex gap-4 border-b border-slate-200 pb-2">
                {['completeness', 'consistency', 'acc_dq'].map(t => (
                    <button 
                        key={t}
                        onClick={() => setTab(t)}
                        className={`pb-2 px-1 text-sm font-bold capitalize transition-all ${tab === t ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                        {t.replace("_", " ")}
                    </button>
                ))}
            </div>

            {tab === "completeness" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center">
                        <div className="relative w-32 h-32 rounded-full border-4 border-slate-100 flex items-center justify-center mb-4">
                            <svg className="absolute inset-0 w-full h-full text-blue-500 -rotate-90" viewBox="0 0 36 36">
                                <path className="stroke-current" strokeWidth="3" fill="none"
                                    strokeDasharray={`${DQ_RESULTS.completeness.overall * 100}, 100`}
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            </svg>
                            <span className="text-2xl font-bold text-slate-800">{(DQ_RESULTS.completeness.overall * 100).toFixed(1)}%</span>
                        </div>
                        <h3 className="text-slate-600 font-bold">Dataset Completeness</h3>
                    </div>
                    
                    <div className="col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Top Missing Columns (Null Rate)</h3>
                        <div style={{ width: '100%', height: 256, minHeight: 256 }}>
                            <ResponsiveContainer>
                                <BarChart data={DQ_RESULTS.completeness.top_missing_cols} layout="vertical" margin={{ left: 40, right: 20 }}>
                                    <XAxis type="number" domain={[0, 1]} stroke="#64748b" />
                                    <YAxis dataKey="Column" type="category" stroke="#64748b" width={100} />
                                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', color: '#0f172a' }} cursor={{fill: 'rgba(0,0,0,0.02)'}} />
                                    <Bar dataKey="Null_Rate" fill="#f43f5e" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="col-span-3 bg-blue-50 border border-blue-100 rounded-xl p-6 shadow-sm">
                        <ul className="list-disc pl-5 text-blue-900 space-y-2 font-medium">
                            {DQ_RESULTS.completeness.notes.map((n, i) => <li key={i}>{n}</li>)}
                        </ul>
                    </div>
                </div>
            )}

            {tab === "consistency" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center">
                        <div className="relative w-32 h-32 rounded-full border-4 border-slate-100 flex items-center justify-center mb-4">
                            <svg className="absolute inset-0 w-full h-full text-emerald-500 -rotate-90" viewBox="0 0 36 36">
                                <path className="stroke-current" strokeWidth="3" fill="none"
                                    strokeDasharray={`${DQ_RESULTS.consistency.overall * 100}, 100`}
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            </svg>
                            <span className="text-2xl font-bold text-slate-800">{(DQ_RESULTS.consistency.overall * 100).toFixed(1)}%</span>
                        </div>
                        <h3 className="text-slate-600 font-bold">Consistency (Average)</h3>
                    </div>
                    
                    <div className="col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Rule Passing Rates</h3>
                        <div style={{ width: '100%', height: 256, minHeight: 256 }}>
                            <ResponsiveContainer>
                                <BarChart data={DQ_RESULTS.consistency.rule_pass_rates} layout="vertical" margin={{ left: 60, right: 20 }}>
                                    <XAxis type="number" domain={[0, 1]} stroke="#64748b" />
                                    <YAxis dataKey="Rule" type="category" stroke="#64748b" width={120} />
                                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', color: '#0f172a' }} cursor={{fill: 'rgba(0,0,0,0.02)'}} />
                                    <Bar dataKey="Pass_Rate" fill="#10b981" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="col-span-3 bg-emerald-50 border border-emerald-100 rounded-xl p-6 shadow-sm">
                        <ul className="list-disc pl-5 text-emerald-900 space-y-2 font-medium">
                            {DQ_RESULTS.consistency.notes.map((n, i) => <li key={i}>{n}</li>)}
                        </ul>
                    </div>
                </div>
            )}

            {tab === "acc_dq" && (
                <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                    <div className="flex flex-col md:flex-row items-center gap-12 mb-8 justify-around">
                        <div className="text-center">
                            <p className="text-slate-500 font-semibold mb-1">S_perf (Performance)</p>
                            <p className="text-5xl font-black text-indigo-600">{DQ_RESULTS.acc_dq.s_perf.toFixed(4)}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-slate-500 font-semibold mb-1">S_san+ (Sanity)</p>
                            <p className="text-5xl font-black text-rose-500">{DQ_RESULTS.acc_dq.s_san_plus.toFixed(4)}</p>
                        </div>
                        <div className="text-center p-4 bg-slate-50 rounded-2xl border border-slate-200">
                            <p className="text-slate-500 font-bold mb-1">Acc-DQ Score</p>
                            <p className="text-5xl font-black text-slate-800">{DQ_RESULTS.acc_dq.acc_dq_score.toFixed(2)} <span className="text-base text-slate-400 font-medium tracking-normal">/ 100</span></p>
                        </div>
                    </div>
                    
                    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6">
                        <ul className="list-disc pl-5 text-indigo-900 space-y-2 font-medium">
                            {DQ_RESULTS.acc_dq.notes.map((n, i) => <li key={i}>{n}</li>)}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}
