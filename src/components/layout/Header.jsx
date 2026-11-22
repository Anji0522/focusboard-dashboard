import React from 'react';
import { ChevronDown, Menu } from 'lucide-react';
import { useTaskManager } from '../../context/TaskContext';

export const Header = () => {
  const { setIsMobileNavOpen } = useTaskManager();

  return (
    <header className="bg-white border-b border-[#F3F4F6] sticky top-0 z-20 px-4 sm:px-8 py-3.5 flex items-center justify-between">
      {/* Left: Mobile Menu Toggle / Desktop Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIsMobileNavOpen(true)}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Open mobile navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mobile Logo on small screens */}
        <div className="lg:hidden flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#4F46E5] flex items-center justify-center">
            <div className="grid grid-cols-2 gap-0.5 w-3 h-3">
              <div className="w-1 h-1 bg-white rounded-xs" />
              <div className="w-1 h-1 bg-white rounded-xs" />
              <div className="w-1 h-1 bg-white rounded-xs" />
              <div className="w-1 h-1 bg-white rounded-xs" />
            </div>
          </div>
          <span className="font-bold text-base tracking-tight text-[#111827]">
            FocusBoard
          </span>
        </div>

        {/* Desktop Breadcrumbs */}
        <div className="hidden lg:flex items-center gap-2 text-xs font-medium text-[#6B7280]">
          <span>Workspace</span>
          <span className="text-[#9CA3AF]">/</span>
          <span className="text-[#111827] font-semibold">Overview</span>
        </div>
      </div>

      {/* Right: User Profile Avatar & Dropdown */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="flex items-center gap-2.5 p-1 sm:px-2 sm:py-1 rounded-full hover:bg-slate-50 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="User Profile"
        >
          <div className="w-8 h-8 rounded-full bg-[#EEF2FF] text-[#4F46E5] font-bold text-xs flex items-center justify-center ring-2 ring-white">
            AS
          </div>
          <span className="hidden sm:inline text-xs font-semibold text-[#111827]">
            Anjaiah Siddam
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-[#9CA3AF]" />
        </button>
      </div>
    </header>
  );
};
