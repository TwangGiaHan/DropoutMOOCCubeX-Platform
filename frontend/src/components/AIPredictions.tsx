"use client";

import React from 'react';

const aiModels = [
    {
        model: "RandomForest",
        params: ["n_estimators: 500", "min_samples_split: 10", "min_samples_leaf: 4", "max_depth: 20", "bootstrap: False"],
        avg: {acc: 0.8933, prec: 0.7320, rec: 0.7340, f1: 0.7320, auc: 0.9210},
    },
    {
        model: "XGBoost",
        params: ["learning_rate: 0.05", "max_depth: 8", "min_child_weight: 1", "n_estimators: 500", "subsample: 0.8", "scaler: RobustScaler()"],
        avg: {acc: 0.8985, prec: 0.7400, rec: 0.7320, f1: 0.7260, auc: 0.8874},
    },
    {
        model: "ANN-LSTM",
        params: ["Architecture: Multi-layer", "Optimizer: Adam"],
        avg: {acc: 0.8645, prec: 0.7140, rec: 0.8260, f1: 0.7480, auc: 0.9210},
    },
    {
        model: "Linear SVM",
        params: ["C: 1", "class_weight: balanced"],
        avg: {acc: 0.5443, prec: 0.5680, rec: 0.6500, f1: 0.4720, auc: 0.7225},
    },
    {
        model: "LightGBM",
        params: ["learning_rate: 0.05", "max_depth: -1", "n_estimators: 200", "num_leaves: 63"],
        avg: {acc: 0.8849, prec: 0.7120, rec: 0.7300, f1: 0.7180, auc: 0.8863},
    },
    {
        model: "LSTM",
        params: ["Sequence Modeling"],
        avg: {acc: 0.8935, prec: 0.7180, rec: 0.6840, f1: 0.6740, auc: 0.7879},
    },
    {
        model: "CatBoost",
        params: ["depth: 6", "learning_rate: 0.05"],
        avg: {acc: 0.9108, prec: 0.8710, rec: 0.6326, f1: 0.6621, auc: 0.8715},
    },
    {
        model: "KNN",
        params: ["n_neighbors: auto"],
        avg: {acc: 0.9109, prec: 0.8396, rec: 0.6610, f1: 0.6994, auc: 0.8671},
    },
    {
        model: "TabNet",
        params: ["Attentive Transformer", "Feature Selection"],
        avg: {acc: 0.9203, prec: 0.8258, rec: 0.7528, f1: 0.7817, auc: 0.9204},
    },
].sort((a,b) => b.avg.auc - a.avg.auc);

export default function AIPredictions() {
    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Predictive Analytics Results (ML Models)</h2>
                <p className="text-slate-500 mt-2 text-lg">Evaluate the performance of 9 Machine Learning models tested on the MOOCCubeX datalake.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Traditional ML</h3>
                    <ul className="list-disc pl-5 text-slate-600 space-y-1 font-medium">
                        <li>Random Forest</li>
                        <li>Linear SVM</li>
                        <li>KNN</li>
                    </ul>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Boosting</h3>
                    <ul className="list-disc pl-5 text-slate-600 space-y-1 font-medium">
                        <li>XGBoost</li>
                        <li>LightGBM</li>
                        <li>CatBoost</li>
                    </ul>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Deep Learning</h3>
                    <ul className="list-disc pl-5 text-slate-600 space-y-1 font-medium">
                        <li>LSTM</li>
                        <li>ANN-LSTM</li>
                        <li>TabNet</li>
                    </ul>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-1 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-slate-50 text-slate-600 text-sm tracking-wide border-b border-slate-200">
                                <th className="py-4 px-6 font-bold">ROC-AUC Capability</th>
                                <th className="py-4 px-6 font-bold">Model Name</th>
                                <th className="py-4 px-6 font-bold">Best Architecture / Params</th>
                                <th className="py-4 px-6 font-bold text-center text-blue-600">Accuracy</th>
                                <th className="py-4 px-6 font-bold text-center text-blue-600">Precision</th>
                                <th className="py-4 px-6 font-bold text-center text-blue-600">Recall</th>
                                <th className="py-4 px-6 font-bold text-center text-blue-600">F1-Score</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {aiModels.map((m, idx) => (
                                <tr key={idx} className="hover:bg-blue-50/50 transition-colors group">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl font-bold text-slate-900">{m.avg.auc.toFixed(4)}</span>
                                            <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-500 rounded-full" style={{width: `${m.avg.auc * 100}%`}}></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 font-bold text-blue-600 text-lg">{m.model}</td>
                                    <td className="py-4 px-6">
                                        <div className="flex flex-wrap gap-2">
                                            {m.params.map((p, i) => (
                                                <span key={i} className="bg-slate-100 border border-slate-200 text-slate-600 text-xs px-2 py-1 rounded-md font-mono">{p}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-center text-slate-700 font-semibold">{m.avg.acc.toFixed(4)}</td>
                                    <td className="py-4 px-6 text-center text-slate-700 font-semibold">{m.avg.prec.toFixed(4)}</td>
                                    <td className="py-4 px-6 text-center text-slate-700 font-semibold">{m.avg.rec.toFixed(4)}</td>
                                    <td className="py-4 px-6 text-center text-slate-700 font-semibold">{m.avg.f1.toFixed(4)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div className="mt-8 p-6 border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl relative overflow-hidden shadow-sm">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
                <h3 className="text-lg font-bold text-blue-800 mb-2 relative z-10">Deployment Conclusion</h3>
                <p className="text-slate-700 relative z-10 leading-relaxed font-medium">
                    Based on evaluation metrics, <strong className="text-blue-900">TabNet</strong> yields the highest stability (AUC 0.9204), while <strong className="text-blue-900">ANN-LSTM</strong> and <strong className="text-blue-900">Random Forest</strong> also deliver impressive accuracy. These models are ideal for automated dropout prediction as phased throughout the dashboard.
                </p>
            </div>
        </div>
    );
}
