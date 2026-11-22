import React from 'react';
import { Search, X, Filter, ArrowUpDown } from 'lucide-react';
import { useTaskManager } from '../../context/TaskContext';
import type { TaskStatus, TaskPriority, TaskCategory, SortOption } from '../../types/task';

export const TaskFilters: React.FC = () => {
  const { tasks, filters, updateFilter } = useTaskManager();

  const statusTabs: { label: string; value: 'All' | TaskStatus; count: number }[] = [
    { label: 'All Tasks', value: 'All', count: tasks.length },
    { label: 'To do', value: 'To do', count: tasks.filter((t) => t.status === 'To do').length },
    { label: 'In progress', value: 'In progress', count: tasks.filter((t) => t.status === 'In progress').length },
    { label: 'Completed', value: 'Completed', count: tasks.filter((t) => t.status === 'Completed').length },
  ];

  const categories: ('All' | TaskCategory)[] = [
    'All',
    'Design',
    'Development',
    'Marketing',
    'Research',
    'Product',
    'Operations',
  ];

  const priorities: ('All' | TaskPriority)[] = ['All', 'High', 'Medium', 'Low'];

  const hasActiveFilters =
    filters.searchQuery !== '' ||
    filters.status !== 'All' ||
    filters.priority !== 'All' ||
    filters.category !== 'All' ||
    filters.sortBy !== 'dueDateAsc';

  const clearAllFilters = () => {
    updateFilter('searchQuery', '');
    updateFilter('status', 'All');
    updateFilter('priority', 'All');
    updateFilter('category', 'All');
    updateFilter('sortBy', 'dueDateAsc');
  };

  return (
    <div className="space-y-4">
      {/* Top row: Status Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1 sm:gap-2">
          {statusTabs.map((tab) => {
            const isActive = filters.status === tab.value;
            return (
              <button
                key={tab.label}
                type="button"
                onClick={() => updateFilter('status', tab.value)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium rounded-xl whitespace-nowrap transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    isActive ? 'bg-indigo-500/80 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAllFilters}
            className="hidden sm:flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-semibold px-2 py-1 rounded-md hover:bg-rose-50 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset filters</span>
          </button>
        )}
      </div>

      {/* Second row: Search, Priority filter, Category filter, and Sort */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search input with clear button */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => updateFilter('searchQuery', e.target.value)}
            placeholder="Search by title, description or category..."
            className="w-full pl-10 pr-9 py-2.5 text-sm bg-white border border-slate-200 rounded-xl placeholder-slate-400 text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all shadow-xs"
          />
          {filters.searchQuery && (
            <button
              type="button"
              onClick={() => updateFilter('searchQuery', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              aria-label="Clear search query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns and Sorting */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {/* Priority Filter */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-xs sm:text-sm shadow-xs shrink-0">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <label htmlFor="priority-filter" className="text-slate-500 text-xs font-medium">Priority:</label>
            <select
              id="priority-filter"
              value={filters.priority}
              onChange={(e) => updateFilter('priority', e.target.value as 'All' | TaskPriority)}
              className="bg-transparent text-slate-800 font-semibold focus:outline-none cursor-pointer text-xs sm:text-sm"
            >
              {priorities.map((p) => (
                <option key={p} value={p}>
                  {p === 'All' ? 'All' : p}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-xs sm:text-sm shadow-xs shrink-0">
            <label htmlFor="category-filter" className="text-slate-500 text-xs font-medium">Category:</label>
            <select
              id="category-filter"
              value={filters.category}
              onChange={(e) => updateFilter('category', e.target.value as 'All' | TaskCategory)}
              className="bg-transparent text-slate-800 font-semibold focus:outline-none cursor-pointer text-xs sm:text-sm"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? 'All' : c}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-xs sm:text-sm shadow-xs shrink-0">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <label htmlFor="sort-filter" className="text-slate-500 text-xs font-medium">Sort:</label>
            <select
              id="sort-filter"
              value={filters.sortBy}
              onChange={(e) => updateFilter('sortBy', e.target.value as SortOption)}
              className="bg-transparent text-slate-800 font-semibold focus:outline-none cursor-pointer text-xs sm:text-sm"
            >
              <option value="dueDateAsc">Due Date (Earliest)</option>
              <option value="dueDateDesc">Due Date (Latest)</option>
              <option value="priorityDesc">Priority (High to Low)</option>
              <option value="newest">Newest Added</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
