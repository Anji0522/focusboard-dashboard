import React from 'react';
import { 
  LayoutGrid, 
  ListTodo, 
  Calendar, 
  Settings, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useTaskManager } from '../../context/TaskContext';

export const Sidebar = ({ className = '' }) => {
  const { activeNav, setActiveNav, stats, resetToDefaultData, setIsMobileNavOpen } = useTaskManager();

  const navItems = [
    { label: 'Overview', icon: LayoutGrid, count: null },
    { label: 'My tasks', icon: ListTodo, count: stats.total },
    { label: 'Calendar', icon: Calendar, count: null },
    { label: 'Settings', icon: Settings, count: null },
  ];

  const handleNavClick = (label) => {
    setActiveNav(label);
    if (setIsMobileNavOpen) setIsMobileNavOpen(false);
  };

  return (
    <aside 
      className={`w-60 bg-white border-r border-[#F3F4F6] flex flex-col justify-between h-screen sticky top-0 shrink-0 select-none ${className}`}
      aria-label="Sidebar Navigation"
    >
      {/* Top Branding & Navigation */}
      <div>
        {/* Brand Header */}
        <div 
          onClick={() => handleNavClick('Overview')}
          className="h-20 flex items-center px-6 gap-3 cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-[#4F46E5] flex items-center justify-center shadow-sm shadow-indigo-200">
            <div className="grid grid-cols-2 gap-1 w-4 h-4">
              <div className="w-1.5 h-1.5 bg-white rounded-xs" />
              <div className="w-1.5 h-1.5 bg-white rounded-xs" />
              <div className="w-1.5 h-1.5 bg-white rounded-xs" />
              <div className="w-1.5 h-1.5 bg-white rounded-xs" />
            </div>
          </div>
          <span className="font-bold text-lg tracking-tight text-[#111827]">
            FocusBoard
          </span>
        </div>

        {/* Workspace Menu */}
        <div className="px-4 py-2">
          <p className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-[#9CA3AF] uppercase">
            WORKSPACE
          </p>
          <nav className="space-y-1" aria-label="Main menu">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.label;

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleNavClick(item.label)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#EEF2FF] text-[#4F46E5] font-semibold'
                      : 'text-[#6B7280] hover:text-[#111827] hover:bg-slate-50'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#4F46E5]' : 'text-[#9CA3AF]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== null && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        isActive
                          ? 'bg-indigo-100 text-[#4F46E5]'
                          : 'bg-slate-100 text-[#6B7280]'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Profile & Utilities */}
      <div className="p-4 border-t border-[#F3F4F6] space-y-3">
        {/* Reset Demo Data button */}
        <button
          type="button"
          onClick={() => {
            if (window.confirm('Reset all task data back to Figma sample state?')) {
              resetToDefaultData();
            }
          }}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-lg transition-colors cursor-pointer"
          title="Restore original sample tasks"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Sample Tasks</span>
        </button>

        {/* User Profile Card */}
        <div 
          onClick={() => handleNavClick('Settings')}
          className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer hover:bg-slate-100/70 transition-colors"
          title="View Settings & Profile"
        >
          <div className="w-9 h-9 rounded-full bg-[#EEF2FF] text-[#4F46E5] font-bold text-xs flex items-center justify-center shrink-0">
            AS
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[#111827] truncate">Anjaiah Siddam</p>
            <p className="text-[11px] text-[#9CA3AF] truncate">anji0522@focusboard.io</p>
          </div>
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
        </div>
      </div>
    </aside>
  );
};
