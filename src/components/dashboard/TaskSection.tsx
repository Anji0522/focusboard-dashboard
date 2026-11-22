import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  ChevronDown, 
  Calendar, 
  MoreHorizontal, 
  Check, 
  Edit3, 
  Trash2, 
  X,
  Sparkles 
} from 'lucide-react';
import { useTaskManager } from '../../context/TaskContext';
import type { Task, TaskPriority, TaskStatus } from '../../types/task';

export const TaskSection: React.FC = () => {
  const { 
    tasks, 
    filteredTasks, 
    filters, 
    updateFilter, 
    cycleTaskStatus, 
    updateTaskStatus, 
    setEditingTask, 
    setDeletingTask, 
    setIsCreateModalOpen 
  } = useTaskManager();

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Status tabs matching Figma
  const tabs: { label: string; value: 'All' | TaskStatus; count?: number }[] = [
    { label: `All tasks ${tasks.length}`, value: 'All' },
    { label: 'In progress', value: 'In progress' },
    { label: 'Completed', value: 'Completed' },
  ];

  // Helper for Category Tag colors matching Figma
  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'Design':
        return 'bg-[#EEF2FF] text-[#4F46E5]';
      case 'Development':
        return 'bg-[#EDE9FE] text-[#6D28D9]';
      case 'Content':
        return 'bg-[#EEF2FF] text-[#4F46E5]';
      case 'Research':
        return 'bg-[#F3F4F6] text-[#374151]';
      default:
        return 'bg-[#F1F5F9] text-[#475569]';
    }
  };

  // Helper for Priority Badge colors matching Figma
  const getPriorityBadgeClass = (priority: TaskPriority) => {
    switch (priority) {
      case 'High':
        return 'bg-[#FEF3C7] text-[#D97706]';
      case 'Medium':
        return 'bg-[#D1FAE5] text-[#059669]';
      case 'Low':
        return 'bg-[#E0F2FE] text-[#0284C7]';
    }
  };

  // Helper to format due date as "Nov 22", "Nov 24", etc.
  const formatShortDate = (dateString: string) => {
    try {
      const date = new Date(dateString + 'T00:00:00');
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
      }).format(date);
    } catch {
      return dateString;
    }
  };

  return (
    <section className="space-y-4" aria-labelledby="my-tasks-title">
      {/* 1. Section Header matching Figma */}
      <div className="flex items-center justify-between">
        <div>
          <h2 id="my-tasks-title" className="text-xl font-bold text-[#111827] tracking-tight">
            My tasks
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
            Manage and track everything in one place.
          </p>
        </div>

        {/* Desktop "View all tasks" link / Mobile "+" button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              updateFilter('status', 'All');
              updateFilter('priority', 'All');
              updateFilter('searchQuery', '');
            }}
            className="hidden sm:inline-block text-sm font-semibold text-[#4F46E5] hover:text-[#4338CA] transition-colors cursor-pointer"
          >
            View all tasks
          </button>

          {/* Mobile "+" Button matching Figma mobile design (36x36px indigo) */}
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="sm:hidden w-9 h-9 rounded-xl bg-[#4F46E5] text-white flex items-center justify-center shadow-sm shadow-indigo-200 active:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            aria-label="Create task"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* 2. Filter & Tab Controls bar matching Figma */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
        {/* Left Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0" role="tablist">
          {tabs.map((tab) => {
            const isActive = filters.status === tab.value;
            return (
              <button
                key={tab.label}
                role="tab"
                aria-selected={isActive}
                onClick={() => updateFilter('status', tab.value)}
                className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  isActive
                    ? 'bg-[#EEF2FF] text-[#4F46E5] font-semibold'
                    : 'text-[#6B7280] hover:text-[#111827] hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Right Controls: Search bar & Priority dropdown */}
        <div className="flex items-center gap-2.5">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-60">
            <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => updateFilter('searchQuery', e.target.value)}
              placeholder="Find a task..."
              className="w-full pl-9 pr-7 py-1.5 text-xs sm:text-sm bg-white border border-[#E5E7EB] rounded-lg placeholder-[#9CA3AF] text-[#111827] focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] transition-all"
            />
            {filters.searchQuery && (
              <button
                type="button"
                onClick={() => updateFilter('searchQuery', '')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] p-0.5"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Priority dropdown */}
          <div className="relative shrink-0">
            <select
              value={filters.priority}
              onChange={(e) => updateFilter('priority', e.target.value as 'All' | TaskPriority)}
              className="appearance-none bg-white border border-[#E5E7EB] rounded-lg pl-3 pr-7 py-1.5 text-xs sm:text-sm font-medium text-[#6B7280] focus:outline-none focus:border-[#4F46E5] cursor-pointer"
              aria-label="Filter tasks by priority"
            >
              <option value="All">Priority: All</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#9CA3AF] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 3. Task Rows / Cards matching Figma */}
      <div className="space-y-2.5 pt-1">
        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-10 text-center shadow-xs">
            <Sparkles className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-[#111827]">No tasks found</h3>
            <p className="text-xs text-[#6B7280] mt-1">
              Try resetting your search query or status filter.
            </p>
            <button
              type="button"
              onClick={() => {
                updateFilter('searchQuery', '');
                updateFilter('status', 'All');
                updateFilter('priority', 'All');
              }}
              className="mt-3 px-3 py-1.5 text-xs font-semibold text-[#4F46E5] bg-[#EEF2FF] hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredTasks.map((task: Task) => {
            const isCompleted = task.status === 'Completed';
            const categoryClass = getCategoryBadgeClass(task.category);
            const priorityClass = getPriorityBadgeClass(task.priority);
            const isMenuOpen = activeMenuId === task.id;

            return (
              <div
                key={task.id}
                className={`bg-white rounded-xl border border-[#E5E7EB] hover:border-slate-300 transition-all p-3.5 sm:px-4 sm:py-3.5 shadow-xs relative ${
                  isCompleted ? 'bg-slate-50/50' : ''
                }`}
              >
                {/* Desktop and Tablet Row Layout */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Left: Checkbox & Title & Subtitle */}
                  <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                    {/* Checkbox button matching Figma outline vs filled */}
                    <button
                      type="button"
                      onClick={() => cycleTaskStatus(task.id)}
                      className={`w-5 h-5 mt-0.5 sm:mt-0 rounded-md flex items-center justify-center shrink-0 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        isCompleted
                          ? 'bg-[#DCFCE7] border-2 border-[#16A34A] text-[#16A34A]'
                          : 'border-2 border-indigo-400 hover:border-indigo-600 bg-white'
                      }`}
                      aria-label={`Mark task "${task.title}" as ${isCompleted ? 'incomplete' : 'completed'}`}
                      title={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                    >
                      {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>

                    {/* Task Title & Subtitle */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-sm font-semibold tracking-tight transition-colors ${
                            isCompleted ? 'text-[#9CA3AF] line-through' : 'text-[#111827]'
                          }`}
                        >
                          {task.title}
                        </span>

                        {/* Mobile-only tags placement */}
                        <span
                          className={`sm:hidden text-[10px] font-semibold px-2 py-0.5 rounded-md ${categoryClass}`}
                        >
                          {task.category}
                        </span>
                      </div>

                      <p className="text-xs text-[#6B7280] mt-0.5 truncate">
                        {task.subtitle || task.description}
                      </p>
                    </div>
                  </div>

                  {/* Right: Badges, Date & Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-2.5 sm:gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F3F4F6]">
                    <div className="flex items-center gap-2 sm:gap-3">
                      {/* Desktop Category Tag */}
                      <span
                        className={`hidden sm:inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-md ${categoryClass}`}
                      >
                        {task.category}
                      </span>

                      {/* Priority Badge */}
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-md ${priorityClass}`}
                      >
                        {task.priority}
                      </span>

                      {/* Due Date with Calendar icon */}
                      <span className="flex items-center gap-1.5 text-xs text-[#6B7280] font-medium">
                        <Calendar className="w-3.5 h-3.5 text-[#9CA3AF]" />
                        <span>{formatShortDate(task.dueDate)}</span>
                      </span>
                    </div>

                    {/* Action buttons (Direct Edit/Delete + "..." Menu) */}
                    <div className="flex items-center gap-1 relative">
                      {/* Direct Edit Button */}
                      <button
                        type="button"
                        onClick={() => setEditingTask(task)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors cursor-pointer"
                        title="Edit task"
                        aria-label={`Edit ${task.title}`}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {/* Direct Delete Button */}
                      <button
                        type="button"
                        onClick={() => setDeletingTask(task)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete task"
                        aria-label={`Delete ${task.title}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      {/* "..." menu button */}
                      <button
                        type="button"
                        onClick={() => setActiveMenuId(isMenuOpen ? null : task.id)}
                        className="p-1.5 text-[#9CA3AF] hover:text-[#111827] rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                        aria-label="Task options"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>

                      {/* Dropdown Menu */}
                      {isMenuOpen && (
                        <div 
                          className="absolute right-0 top-8 w-40 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-30 animate-in fade-in zoom-in-95"
                          onMouseLeave={() => setActiveMenuId(null)}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              updateTaskStatus(task.id, 'To do');
                              setActiveMenuId(null);
                            }}
                            className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                          >
                            Set to To do
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              updateTaskStatus(task.id, 'In progress');
                              setActiveMenuId(null);
                            }}
                            className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                          >
                            Set to In progress
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              updateTaskStatus(task.id, 'Completed');
                              setActiveMenuId(null);
                            }}
                            className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                          >
                            Set to Completed
                          </button>
                          <div className="border-t border-slate-100 my-1" />
                          <button
                            type="button"
                            onClick={() => {
                              setEditingTask(task);
                              setActiveMenuId(null);
                            }}
                            className="w-full text-left px-3 py-1.5 text-xs text-indigo-600 hover:bg-indigo-50 font-medium flex items-center gap-2"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit task</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setDeletingTask(task);
                              setActiveMenuId(null);
                            }}
                            className="w-full text-left px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 font-medium flex items-center gap-2"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete task</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};
