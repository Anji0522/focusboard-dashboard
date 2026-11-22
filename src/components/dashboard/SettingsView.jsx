import React from 'react';
import { User, Database, Sparkles, RotateCcw, ShieldCheck, Download } from 'lucide-react';
import { useTaskManager } from '../../context/TaskContext';

export const SettingsView = () => {
  const { tasks, stats, resetToDefaultData } = useTaskManager();

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tasks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'focusboard-tasks-export.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight">
          Settings & Preferences
        </h1>
        <p className="text-sm text-[#6B7280] mt-1">
          Manage your account profile, task storage, and application preferences.
        </p>
      </div>

      {/* User Profile Card */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#F3F4F6]">
          <User className="w-5 h-5 text-[#4F46E5]" />
          <h2 className="text-base font-bold text-[#111827]">Account Information</h2>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#EEF2FF] text-[#4F46E5] font-extrabold text-lg flex items-center justify-center ring-4 ring-indigo-50">
              AS
            </div>
            <div>
              <p className="text-base font-bold text-[#111827]">Anjaiah Siddam</p>
              <p className="text-xs text-[#6B7280]">anji0522@focusboard.io • GitHub: @Anji0522</p>
              <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                <ShieldCheck className="w-3 h-3" />
                Active FocusBoard Candidate
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Storage & Data Management */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-[#F3F4F6]">
          <Database className="w-5 h-5 text-[#4F46E5]" />
          <h2 className="text-base font-bold text-[#111827]">Storage & Data Persistence</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <p className="text-xs text-[#6B7280]">Total Stored Tasks</p>
            <p className="text-xl font-bold text-[#111827] mt-1">{stats.total} tasks</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <p className="text-xs text-[#6B7280]">Storage Engine</p>
            <p className="text-xl font-bold text-[#111827] mt-1">HTML5 LocalStorage</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <p className="text-xs text-[#6B7280]">Completion Index</p>
            <p className="text-xl font-bold text-emerald-600 mt-1">{stats.completionRate}%</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleExportData}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-[#E5E7EB] hover:bg-slate-50 rounded-xl text-xs sm:text-sm font-semibold text-[#374151] transition-colors"
          >
            <Download className="w-4 h-4 text-[#6B7280]" />
            <span>Export Tasks (JSON)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset all tasks to the original Figma sample data?')) {
                resetToDefaultData();
              }
            }}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-rose-50 border border-rose-200 hover:bg-rose-100 rounded-xl text-xs sm:text-sm font-semibold text-rose-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-rose-600" />
            <span>Reset Sample Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
