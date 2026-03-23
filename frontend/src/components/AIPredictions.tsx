"use client";

import React from 'react';

const aiModels = [
    {
        model: "RandomForest",
        params: ["n_estimators: 500", "min_samples_split: 10", "min_samples_leaf: 4", "max_depth: 20", "bootstrap: False"],
        tests: [
            {acc: 0.8776, prec: 0.9419, rec: 0.9181, f1: 0.9299, auc: 0.8987},
            {acc: 0.8754, prec: 0.9132, rec: 0.9492, f1: 0.9309, auc: 0.8792},
            {acc: 0.8752, prec: 0.9124, rec: 0.9499, f1: 0.9308, auc: 0.8948},
            {acc: 0.9021, prec: 0.9409, rec: 0.9488, f1: 0.9448, auc: 0.9490},
            {acc: 0.9364, prec: 0.9872, rec: 0.9402, f1: 0.9631, auc: 0.9835},
        ],
        avg: {acc: 0.8933, prec: 0.7320, rec: 0.7340, f1: 0.7320, auc: 0.9210},
    },
    {
        model: "XGBoost",
        params: ["learning_rate: 0.05", "max_depth: 8", "min_child_weight: 1", "n_estimators: 500", "subsample: 0.8", "scaler: RobustScaler()"],
        tests: [
            {acc: 0.8819, prec: 0.6974, rec: 0.6081, f1: 0.6333, auc: 0.8087},
            {acc: 0.8764, prec: 0.6814, rec: 0.6198, f1: 0.6408, auc: 0.8148},
            {acc: 0.8755, prec: 0.6862, rec: 0.6464, f1: 0.6625, auc: 0.8663},
            {acc: 0.9234, prec: 0.8071, rec: 0.8491, f1: 0.8261, auc: 0.9630},
            {acc: 0.9352, prec: 0.8240, rec: 0.9286, f1: 0.8652, auc: 0.9844},
        ],
        avg: {acc: 0.8985, prec: 0.7400, rec: 0.7320, f1: 0.7260, auc: 0.8874},
    },
    {
        model: "ANN-LSTM",
        params: ["Architecture: Multi-layer", "Optimizer: Adam"],
        tests: [
            {acc: 0.7988, prec: 0.9542, rec: 0.8111, f1: 0.8769, auc: 0.8590},
            {acc: 0.8472, prec: 0.9496, rec: 0.8733, f1: 0.9099, auc: 0.8823},
            {acc: 0.8725, prec: 0.9650, rec: 0.8878, f1: 0.9248, auc: 0.9276},
            {acc: 0.9006, prec: 0.9800, rec: 0.9060, f1: 0.9416, auc: 0.9612},
            {acc: 0.9034, prec: 0.9893, rec: 0.9004, f1: 0.9428, auc: 0.9747},
        ],
        avg: {acc: 0.8645, prec: 0.7140, rec: 0.8260, f1: 0.7480, auc: 0.9210},
    },
    {
        model: "Linear SVM",
        params: ["C: 1", "class_weight: balanced"],
        tests: [
            {acc: 0.5809, prec: 0.9520, rec: 0.5535, f1: 0.7000, auc: 0.7241},
            {acc: 0.3164, prec: 0.9620, rec: 0.2354, f1: 0.3783, auc: 0.6769},
            {acc: 0.4482, prec: 0.9260, rec: 0.4080, f1: 0.5664, auc: 0.6657},
            {acc: 0.6291, prec: 0.9441, rec: 0.6166, f1: 0.7460, auc: 0.7170},
            {acc: 0.7468, prec: 0.9587, rec: 0.7455, f1: 0.8387, auc: 0.8287},
        ],
        avg: {acc: 0.5443, prec: 0.5680, rec: 0.6500, f1: 0.4720, auc: 0.7225},
    },
    {
        model: "LightGBM",
        params: ["learning_rate: 0.05", "max_depth: -1", "n_estimators: 200", "num_leaves: 63"],
        tests: [
            {acc: 0.8583, prec: 0.9113, rec: 0.9302, f1: 0.9206, auc: 0.8069},
            {acc: 0.8603, prec: 0.9137, rec: 0.9296, f1: 0.9216, auc: 0.8097},
            {acc: 0.8661, prec: 0.9224, rec: 0.9263, f1: 0.9244, auc: 0.8839},
            {acc: 0.9089, prec: 0.9552, rec: 0.9409, f1: 0.9480, auc: 0.9467},
            {acc: 0.9309, prec: 0.9898, rec: 0.9314, f1: 0.9597, auc: 0.9842},
        ],
        avg: {acc: 0.8849, prec: 0.7120, rec: 0.7300, f1: 0.7180, auc: 0.8863},
    },
    {
        model: "LSTM",
        params: ["Sequence Modeling"],
        tests: [
            {acc: 0.8764, prec: 0.8863, rec: 0.9867, f1: 0.9338, auc: 0.6060},
            {acc: 0.8821, prec: 0.8934, rec: 0.9839, f1: 0.9365, auc: 0.6776},
            {acc: 0.9034, prec: 0.9279, rec: 0.9657, f1: 0.9464, auc: 0.8149},
            {acc: 0.9174, prec: 0.9559, rec: 0.9503, f1: 0.9531, auc: 0.9075},
            {acc: 0.8883, prec: 0.9713, rec: 0.9001, f1: 0.9343, auc: 0.9333},
        ],
        avg: {acc: 0.8935, prec: 0.7180, rec: 0.6840, f1: 0.6740, auc: 0.7879},
    },
    {
        model: "CatBoost",
        params: ["depth: 6", "learning_rate: 0.05"],
        tests: [
            {acc: 0.8946, prec: 0.8970, rec: 0.9950, f1: 0.9435, auc: 0.8196},
            {acc: 0.8902, prec: 0.8925, rec: 0.9956, f1: 0.9412, auc: 0.7708},
            {acc: 0.8907, prec: 0.8926, rec: 0.9960, f1: 0.9415, auc: 0.8275},
            {acc: 0.9239, prec: 0.9226, rec: 0.9975, f1: 0.9586, auc: 0.9642},
            {acc: 0.9548, prec: 0.9572, rec: 0.9933, f1: 0.9749, auc: 0.9753},
        ],
        avg: {acc: 0.9108, prec: 0.8710, rec: 0.6326, f1: 0.6621, auc: 0.8715},
    },
    {
        model: "KNN",
        params: ["n_neighbors: auto"],
        tests: [
            {acc: 0.8942, prec: 0.9072, rec: 0.9806, f1: 0.9424, auc: 0.8358},
            {acc: 0.8957, prec: 0.9010, rec: 0.9908, f1: 0.9437, auc: 0.7803},
            {acc: 0.9044, prec: 0.9071, rec: 0.9936, f1: 0.9484, auc: 0.8357},
            {acc: 0.9222, prec: 0.9271, rec: 0.9898, f1: 0.9574, auc: 0.9315},
            {acc: 0.9378, prec: 0.9514, rec: 0.9796, f1: 0.9653, auc: 0.9522},
        ],
        avg: {acc: 0.9109, prec: 0.8396, rec: 0.6610, f1: 0.6994, auc: 0.8671},
    },
    {
        model: "TabNet",
        params: ["Attentive Transformer", "Feature Selection"],
        tests: [
            {acc: 0.8881, prec: 0.9306, rec: 0.9437, f1: 0.9371, auc: 0.8812},
            {acc: 0.8978, prec: 0.9195, rec: 0.9692, f1: 0.9437, auc: 0.8788},
            {acc: 0.9238, prec: 0.9420, rec: 0.9737, f1: 0.9576, auc: 0.9261},
            {acc: 0.9376, prec: 0.9479, rec: 0.9834, f1: 0.9653, auc: 0.9423},
            {acc: 0.9540, prec: 0.9627, rec: 0.9861, f1: 0.9743, auc: 0.9735},
        ],
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

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-x-auto relative">
                <table className="w-full text-left border-collapse min-w-max border-hidden">
                    <thead className="bg-[#0b5ed7] text-white">
                        <tr>
                            <th rowSpan={2} className="p-4 border border-x-slate-300 border-b-0 sticky left-0 z-20 bg-[#0b5ed7] text-white font-bold align-middle min-w-[200px] text-center border-l-0">Model Name</th>
                            <th rowSpan={2} className="p-4 border border-x-slate-300 border-b-0 sticky left-[200px] z-20 bg-[#0a55c3] text-white font-bold align-middle min-w-[280px] text-center">Best Architecture / Params</th>
                            {[1,2,3,4,5].map(i => (
                                <th key={`head-${i}`} colSpan={5} className="p-3 border border-slate-300 border-t-0 font-bold text-center tracking-wide">Test Phase {i}</th>
                            ))}
                            <th colSpan={5} className="p-3 border border-slate-300 border-t-0 bg-[#0a55c3] font-extrabold text-center tracking-wide border-r-0">Average Metrics</th>
                        </tr>
                        <tr>
                            {[1,2,3,4,5].map(i => (
                                <React.Fragment key={`sub-${i}`}>
                                    <th className="px-3 py-2 border border-slate-300 border-b-0 font-medium text-center text-sm w-28 bg-[#2170e3]">Accuracy</th>
                                    <th className="px-3 py-2 border border-slate-300 border-b-0 font-medium text-center text-sm w-28 bg-[#2170e3]">Precision</th>
                                    <th className="px-3 py-2 border border-slate-300 border-b-0 font-medium text-center text-sm w-28 bg-[#2170e3]">Recall</th>
                                    <th className="px-3 py-2 border border-slate-300 border-b-0 font-medium text-center text-sm w-28 bg-[#2170e3]">F1-Score</th>
                                    <th className="px-3 py-2 border border-slate-300 border-b-0 font-extrabold text-center text-sm w-28 bg-[#2e7bf0]">ROC-AUC</th>
                                </React.Fragment>
                            ))}
                            <th className="px-3 py-2 border border-slate-300 border-b-0 font-bold text-center text-sm w-28 bg-[#125bd6]">Accuracy</th>
                            <th className="px-3 py-2 border border-slate-300 border-b-0 font-bold text-center text-sm w-28 bg-[#125bd6]">Precision</th>
                            <th className="px-3 py-2 border border-slate-300 border-b-0 font-bold text-center text-sm w-28 bg-[#125bd6]">Recall</th>
                            <th className="px-3 py-2 border border-slate-300 border-b-0 font-bold text-center text-sm w-28 bg-[#125bd6]">F1-Score</th>
                            <th className="px-3 py-2 border border-slate-300 border-b-0 border-r-0 font-black text-center text-sm w-28 bg-[#125bd6]">ROC-AUC</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {aiModels.map((m, idx) => (
                            <tr key={idx} className="hover:bg-slate-50 transition-colors group bg-white">
                                <td className="p-4 border-r border-slate-300 sticky left-0 z-20 bg-white group-hover:bg-slate-50 text-blue-700 font-extrabold text-center shadow-[1px_0_4px_rgba(0,0,0,0.05)] border-l-0">{m.model}</td>
                                <td className="p-4 border-r border-slate-300 sticky left-[200px] z-20 bg-white group-hover:bg-slate-50 align-middle shadow-[2px_0_5px_rgba(0,0,0,0.03)]">
                                    <div className="flex flex-col gap-1 w-full max-w-[280px] text-left">
                                        {m.params.map((p, i) => (
                                            <span key={i} className="text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-xs font-mono w-max max-w-full break-words">{p}</span>
                                        ))}
                                    </div>
                                </td>
                                {m.tests.map((t, i) => (
                                    <React.Fragment key={`test-${idx}-${i}`}>
                                        <td className="px-3 py-4 border-r border-slate-200 text-center font-medium text-slate-700">{t.acc.toFixed(4)}</td>
                                        <td className="px-3 py-4 border-r border-slate-200 text-center font-medium text-slate-700">{t.prec.toFixed(4)}</td>
                                        <td className="px-3 py-4 border-r border-slate-200 text-center font-medium text-slate-700">{t.rec.toFixed(4)}</td>
                                        <td className="px-3 py-4 border-r border-slate-200 text-center font-medium text-slate-700">{t.f1.toFixed(4)}</td>
                                        <td className="px-3 py-4 border-r border-slate-300 text-center font-bold text-slate-800 bg-slate-50/30">{t.auc.toFixed(4)}</td>
                                    </React.Fragment>
                                ))}
                                <td className="px-3 py-4 border-r border-indigo-100 bg-[#f8faff] text-center font-bold text-blue-900">{m.avg.acc.toFixed(4)}</td>
                                <td className="px-3 py-4 border-r border-indigo-100 bg-[#f8faff] text-center font-bold text-blue-900">{m.avg.prec.toFixed(4)}</td>
                                <td className="px-3 py-4 border-r border-indigo-100 bg-[#f8faff] text-center font-bold text-blue-900">{m.avg.rec.toFixed(4)}</td>
                                <td className="px-3 py-4 border-r border-indigo-100 bg-[#f8faff] text-center font-bold text-blue-900">{m.avg.f1.toFixed(4)}</td>
                                <td className="px-3 py-4 border-r-0 bg-[#f0f5ff] text-center font-black text-indigo-700 text-lg">{m.avg.auc.toFixed(4)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
