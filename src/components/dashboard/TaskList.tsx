import React from 'react';
import { 
  Calendar, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Plus, 
  Sparkles 
} from 'lucide-react';
import { useTaskManager } from '../../context/TaskContext';
import type { Task, TaskPriority, TaskStatus } from '../../types/task';

export const TaskList: React.FC = () => {
  const { 
    filteredTasks, 
    tasks, 
    cycleTaskStatus, 
    updateTaskStatus, 
    setEditingTask, 
    setDeletingTask, 
    setIsCreateModalOpen,
    updateFilter
  } = useTaskManager();

  // Helper for Priority styling
  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case 'High':
        return {
          bg: 'bg-rose-50 border-rose-200 text-rose-700',
          dot: 'bg-rose-500',
        };
      case 'Medium':
        return {
          bg: 'bg-amber-50 border-amber-200 text-amber-700',
          dot: 'bg-amber-500',
        };
      case 'Low':
        return {
          bg: 'bg-slate-100 border-slate-200 text-slate-600',
          dot: 'bg-slate-400',
        };
    }
  };

  // Helper for Status indicator
  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-50" />;
      case 'In progress':
        return <Clock className="w-5 h-5 text-amber-600" />;
      case 'To do':
        return <Circle className="w-5 h-5 text-slate-300 hover:text-slate-400" />;
    }
  };

  // Format date helper
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString + 'T00:00:00');
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(date);
    } catch {
      return dateString;
    }
  };

  // Empty states
  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center my-6">
        <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800">Your task board is empty</h3>
        <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
          Start by creating your first task to track progress and boost your daily focus.
        </p>
        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create Task</span>
        </button>
      </div>
    );
  }

  if (filteredTasks.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center my-6 shadow-xs">
        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
          <Circle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800">No matching tasks found</h3>
        <p className="text-sm text-slate-500 mt-1">
          Try adjusting your search criteria, category or status filters.
        </p>
        <button
          type="button"
          onClick={() => {
            updateFilter('searchQuery', '');
            updateFilter('status', 'All');
            updateFilter('priority', 'All');
            updateFilter('category', 'All');
          }}
          className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors"
        >
          Reset All Filters
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3" role="region" aria-label="Tasks List">
      {/* Task Rows / Cards */}
      {filteredTasks.map((task: Task) => {
        const priorityStyle = getPriorityBadge(task.priority);
        const isCompleted = task.status === 'Completed';

        return (
          <div
            key={task.id}
            className={`group bg-white rounded-2xl border transition-all p-4 sm:p-5 hover:border-slate-300 hover:shadow-sm ${
              isCompleted ? 'border-slate-200/80 bg-slate-50/50' : 'border-slate-200'
            }`}
          >
            {/* Desktop and Tablet Layout */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Left: Status Toggle & Info */}
              <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                {/* Status Toggle Button with tooltip */}
                <button
                  type="button"
                  onClick={() => cycleTaskStatus(task.id)}
                  className="mt-0.5 sm:mt-0 p-1 rounded-lg text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 shrink-0 cursor-pointer"
                  title={`Status: ${task.status}. Click to advance.`}
                  aria-label={`Current status is ${task.status}. Click to cycle to next status.`}
                >
                  {getStatusIcon(task.status)}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3
                      className={`text-sm sm:text-base font-semibold tracking-tight transition-colors ${
                        isCompleted ? 'text-slate-400 line-through' : 'text-slate-900'
                      }`}
                    >
                      {task.title}
                    </h3>

                    {/* Category Tag */}
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/60">
                      {task.category}
                    </span>
                  </div>

                  {task.description && (
                    <p
                      className={`text-xs sm:text-sm mt-1 leading-relaxed line-clamp-2 ${
                        isCompleted ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      {task.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Right: Badges, Due Date & Action Buttons */}
              <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  {/* Status Dropdown selector for quick direct change */}
                  <select
                    value={task.status}
                    onChange={(e) => updateTaskStatus(task.id, e.target.value as TaskStatus)}
                    className={`text-xs font-semibold px-2 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                      task.status === 'Completed'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : task.status === 'In progress'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                    aria-label="Change status directly"
                  >
                    <option value="To do">To do</option>
                    <option value="In progress">In progress</option>
                    <option value="Completed">Completed</option>
                  </select>

                  {/* Priority Badge */}
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg border ${priorityStyle.bg}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${priorityStyle.dot}`} />
                    <span>{task.priority}</span>
                  </span>

                  {/* Due Date */}
                  <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{formatDate(task.dueDate)}</span>
                  </span>
                </div>

                {/* Edit & Delete Actions */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setEditingTask(task)}
                    className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                    aria-label={`Edit task ${task.title}`}
                    title="Edit task"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingTask(task)}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-colors"
                    aria-label={`Delete task ${task.title}`}
                    title="Delete task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
