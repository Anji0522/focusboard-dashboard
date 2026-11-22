import React, { useEffect } from 'react';
import { X, Sparkles, LayoutDashboard, CheckSquare, FolderKanban, BarChart3, Settings, RotateCcw } from 'lucide-react';
import { useTaskManager } from '../../context/TaskContext';

export const MobileNavDrawer: React.FC = () => {
  const { isMobileNavOpen, setIsMobileNavOpen, stats, resetToDefaultData } = useTaskManager();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileNavOpen) {
        setIsMobileNavOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileNavOpen, setIsMobileNavOpen]);

  if (!isMobileNavOpen) return null;

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, active: true, count: null },
    { label: 'Tasks', icon: CheckSquare, active: false, count: stats.total },
    { label: 'Projects', icon: FolderKanban, active: false, count: 4, placeholder: true },
    { label: 'Analytics', icon: BarChart3, active: false, count: null, placeholder: true },
    { label: 'Settings', icon: Settings, active: false, count: null, placeholder: true },
  ];

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
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-bold text-base tracking-tight text-slate-900">FocusBoard</span>
            </div>
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Menu
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setIsMobileNavOpen(false)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    item.active
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${item.active ? 'text-indigo-600' : 'text-slate-400'}`} />
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
              if (window.confirm('Reset all task data back to default sample state?')) {
                resetToDefaultData();
                setIsMobileNavOpen(false);
              }
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Sample Tasks</span>
          </button>

          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-semibold flex items-center justify-center text-xs">
              AM
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-800 truncate">Alex Morgan</p>
              <p className="text-[11px] text-slate-400 truncate">alex@focusboard.io</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
