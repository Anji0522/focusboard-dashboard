import React from 'react';
import { Plus } from 'lucide-react';
import { useTaskManager } from '../../context/TaskContext';

export const PageHeader = () => {
  const { setIsCreateModalOpen } = useTaskManager();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight leading-tight">
          Your work, in focus.
        </h1>
        <p className="text-sm text-[#6B7280] mt-1">
          Plan your day, stay organized, and celebrate small wins.
        </p>
      </div>

      <button
        type="button"
        onClick={() => setIsCreateModalOpen(true)}
        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] active:bg-[#3730A3] text-white text-sm font-semibold rounded-lg shadow-sm shadow-indigo-100 transition-all focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:ring-offset-2 shrink-0 cursor-pointer"
        aria-label="Create new task"
      >
        <Plus className="w-4 h-4 stroke-[2.5]" />
        <span>New task</span>
      </button>
    </div>
  );
};
