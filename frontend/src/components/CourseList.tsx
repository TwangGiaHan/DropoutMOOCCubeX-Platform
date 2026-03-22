"use client";

import React, { useEffect, useState } from 'react';

export default function CourseList({ onSelectCourse }: { onSelectCourse?: (courseId: string) => void }) {
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);

    useEffect(() => {
        setLoading(true);
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/courses?skip=${page * 12}&limit=12`)
            .then(res => res.json())
            .then(data => {
                setCourses(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [page]);

    const filteredCourses = courses.filter(c => 
        (c.course_name || "").toLowerCase().includes(search.toLowerCase()) || 
        (c.course_id || "").toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Course Directory</h2>
                    <p className="text-slate-500 mt-2 text-lg">Manage and analyze specific courses.</p>
                </div>
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="🔍 Search by course ID or name..." 
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full md:w-80 bg-white border border-slate-300 text-slate-900 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                </div>
            </div>

            {loading && courses.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-slate-400 animate-pulse">Loading courses data...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course, idx) => (
                        <div key={`${course.course_id}-${idx}`} className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-300 transition-colors shadow-sm flex flex-col justify-between group">
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-rose-500 bg-rose-50 px-2 py-0.5 rounded border border-rose-100 font-mono text-sm tracking-wider font-semibold">{course.course_id}</span>
                                    <button 
                                        onClick={() => onSelectCourse && onSelectCourse(course.course_id)}
                                        className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors flex items-center justify-center border border-blue-100 shadow-sm" 
                                        title="View Course Details">
                                        ↗
                                    </button>
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 leading-tight mb-1 group-hover:text-blue-600 transition-colors">
                                    {course.course_name || "Unknown"}
                                </h3>
                                <p className="text-slate-500 text-sm">{course.school_name || "N/A"}</p>
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center text-sm">
                                <div className="text-slate-500">
                                    🗓️ {new Date(course.class_start).toLocaleDateString()} - <br/> {new Date(course.class_end).toLocaleDateString()}
                                </div>
                                <div className="text-emerald-600 font-bold text-lg flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100" title="Enrolled Users">
                                    👥 {course.user_count?.toLocaleString() || 0}
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredCourses.length === 0 && <div className="col-span-3 text-center text-slate-500 py-10">No courses match your search</div>}
                </div>
            )}

            <div className="flex justify-center items-center gap-6 mt-8 p-3 bg-white border border-slate-200 shadow-sm rounded-full w-max mx-auto">
                <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="text-slate-600 hover:text-blue-600 font-medium disabled:opacity-50 disabled:pointer-events-none transition-colors">
                    ⟨⟨ Previous
                </button>
                <span className="text-slate-800 font-bold rounded-full bg-slate-100 px-4 py-1">Page {page + 1}</span>
                <button onClick={() => setPage(p => p + 1)} className="text-slate-600 hover:text-blue-600 font-medium disabled:opacity-50 transition-colors">
                    Next ⟩⟩
                </button>
            </div>
        </div>
    );
}
