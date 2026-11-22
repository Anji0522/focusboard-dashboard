import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Check, Plus } from 'lucide-react';
import { useTaskManager } from '../../context/TaskContext';

export const CalendarView = () => {
  const { tasks, cycleTaskStatus, setIsCreateModalOpen } = useTaskManager();
  const [currentMonth] = useState('November 2026');

  // Days of November 2026: Nov 1 was Sunday (day 0), 30 days total
  const daysInMonth = 30;
  const startDayOffset = 0; // Sunday
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Group tasks by day in November
  const getTasksForDay = (day) => {
    const dayStr = day < 10 ? `0${day}` : `${day}`;
    const dateTarget = `2026-11-${dayStr}`;
    return tasks.filter((t) => t.dueDate === dateTarget);
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-[#FEF3C7] text-[#D97706]';
      case 'Medium':
        return 'bg-[#D1FAE5] text-[#059669]';
      case 'Low':
        return 'bg-[#E0F2FE] text-[#0284C7]';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight">
            Schedule & Deadlines
          </h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Visual calendar timeline for all your upcoming task deliverables.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white border border-[#E5E7EB] rounded-lg px-3 py-1.5 shadow-xs">
            <CalendarIcon className="w-4 h-4 text-[#4F46E5] mr-2" />
            <span className="text-sm font-bold text-[#111827]">{currentMonth}</span>
          </div>
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#4F46E5] text-white text-xs font-semibold rounded-lg hover:bg-[#4338CA] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Calendar Grid Container */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 sm:p-6 shadow-xs overflow-hidden">
        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-[#6B7280] uppercase tracking-wider pb-3 border-b border-[#F3F4F6]">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Calendar Day Cells */}
        <div className="grid grid-cols-7 gap-2 pt-3">
          {/* Empty offset days */}
          {Array.from({ length: startDayOffset }).map((_, i) => (
            <div key={`offset-${i}`} className="min-h-[90px] bg-slate-50/40 rounded-xl p-2" />
          ))}

          {/* Actual days */}
          {daysArray.map((day) => {
            const dayTasks = getTasksForDay(day);
            const isToday = day === 22; // local current demo day

            return (
              <div
                key={day}
                className={`min-h-[100px] border rounded-xl p-2 flex flex-col justify-between transition-colors ${
                  isToday
                    ? 'border-[#4F46E5] bg-[#EEF2FF]/30'
                    : 'border-[#F3F4F6] bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                      isToday ? 'bg-[#4F46E5] text-white' : 'text-[#111827]'
                    }`}
                  >
                    {day}
                  </span>
                  {dayTasks.length > 0 && (
                    <span className="text-[10px] font-bold text-[#6B7280]">
                      {dayTasks.length} task{dayTasks.length > 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                {/* Day tasks list */}
                <div className="space-y-1 mt-1 flex-1">
                  {dayTasks.map((t) => {
                    const isCompleted = t.status === 'Completed';
                    return (
                      <div
                        key={t.id}
                        onClick={() => cycleTaskStatus(t.id)}
                        className={`text-[10px] p-1 rounded-md border cursor-pointer truncate transition-transform hover:scale-[1.02] flex items-center gap-1 ${
                          isCompleted
                            ? 'bg-slate-100 text-slate-400 line-through border-slate-200'
                            : `${getPriorityBadgeClass(t.priority)} border-transparent font-medium`
                        }`}
                        title={`${t.title} (${t.status}) - Click to toggle status`}
                      >
                        {isCompleted && <Check className="w-2.5 h-2.5 shrink-0 stroke-[3]" />}
                        <span className="truncate">{t.title}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
