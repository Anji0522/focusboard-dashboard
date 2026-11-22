import React, { useEffect } from 'react';
import { X, Sparkles, LayoutGrid, ListTodo, Calendar, Settings, RotateCcw } from 'lucide-react';
import { useTaskManager } from '../../context/TaskContext';

export const MobileNavDrawer = () => {
  const { activeNav, setActiveNav, isMobileNavOpen, setIsMobileNavOpen, stats, resetToDefaultData } = useTaskManager();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMobileNavOpen) {
        setIsMobileNavOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileNavOpen, setIsMobileNavOpen]);

  if (!isMobileNavOpen) return null;

  const navItems = [
    { label: 'Overview', icon: LayoutGrid, count: null },
    { label: 'My tasks', icon: ListTodo, count: stats.total },
    { label: 'Calendar', icon: Calendar, count: null },
    { label: 'Settings', icon: Settings, count: null },
  ];

  const handleItemClick = (label) => {
    setActiveNav(label);
    setIsMobileNavOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 lg:hidden bg-slate-900/60 backdrop-blur-xs flex"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Drawer"
      onClick={() => setIsMobileNavOpen(false)}
    >
      <div
        className="w-72 max-w-[80vw] bg-white h-full flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          {/* Drawer Header */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
            <div 
              onClick={() => handleItemClick('Overview')}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-[#4F46E5] flex items-center justify-center text-white shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-bold text-base tracking-tight text-slate-900">FocusBoard</span>
            </div>
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              WORKSPACE
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.label;

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleItemClick(item.label)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== null && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-100 space-y-3">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset all task data back to Figma sample state?')) {
                resetToDefaultData();
                setIsMobileNavOpen(false);
              }
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Sample Tasks</span>
          </button>

          <div 
            onClick={() => handleItemClick('Settings')}
            className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-[#EEF2FF] text-[#4F46E5] font-bold flex items-center justify-center text-xs">
              AS
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-800 truncate">Anjaiah Siddam</p>
              <p className="text-[11px] text-slate-400 truncate">anji0522@focusboard.io</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
