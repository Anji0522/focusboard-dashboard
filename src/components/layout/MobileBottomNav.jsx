import React from 'react';
import { LayoutGrid, ListTodo, Calendar, Settings } from 'lucide-react';
import { useTaskManager } from '../../context/TaskContext';

export const MobileBottomNav = () => {
  const { activeNav, setActiveNav } = useTaskManager();

  const items = [
    { label: 'Overview', icon: LayoutGrid },
    { label: 'My tasks', icon: ListTodo },
    { label: 'Calendar', icon: Calendar },
    { label: 'Settings', icon: Settings },
  ];

  return (
    <nav 
      className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-[#F3F4F6] px-6 py-2 shadow-lg flex items-center justify-around"
      aria-label="Mobile Bottom Navigation"
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeNav === item.label;

        return (
          <button
            key={item.label}
            type="button"
            onClick={() => setActiveNav(item.label)}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-colors cursor-pointer ${
              isActive ? 'text-[#4F46E5] font-semibold' : 'text-[#9CA3AF] hover:text-[#6B7280]'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] tracking-tight">{item.label}</span>
            {isActive && (
              <span className="w-4 h-0.5 rounded-full bg-[#4F46E5] mt-0.5" />
            )}
          </button>
        );
      })}
    </nav>
  );
};
