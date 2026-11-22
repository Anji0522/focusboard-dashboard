import React, { useState, useEffect, useRef } from 'react';
import { X, Calendar, AlertCircle } from 'lucide-react';
import { useTaskManager } from '../../context/TaskContext';

export const TaskModal = () => {
  const { 
    isCreateModalOpen, 
    setIsCreateModalOpen, 
    editingTask, 
    setEditingTask, 
    createTask, 
    updateTask 
  } = useTaskManager();

  const isOpen = isCreateModalOpen || editingTask !== null;
  const isEditing = editingTask !== null;

  // Form State
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Design');
  const [status, setStatus] = useState('To do');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState(null);

  const titleInputRef = useRef(null);

  // Prefill or reset form on open/close
  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || '');
      setSubtitle(editingTask.subtitle || '');
      setDescription(editingTask.description || '');
      setCategory(editingTask.category || 'Design');
      setStatus(editingTask.status || 'To do');
      setPriority(editingTask.priority || 'Medium');
      setDueDate(editingTask.dueDate || '');
      setError(null);
    } else if (isCreateModalOpen) {
      setTitle('');
      setSubtitle('');
      setDescription('');
      setCategory('Design');
      setStatus('To do');
      setPriority('Medium');
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 2);
      setDueDate(defaultDate.toISOString().split('T')[0]);
      setError(null);
    }
  }, [editingTask, isCreateModalOpen]);

  // Autofocus when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Keyboard escape listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleClose = () => {
    setIsCreateModalOpen(false);
    setEditingTask(null);
    setError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('Task title is required.');
      titleInputRef.current?.focus();
      return;
    }

    if (trimmedTitle.length < 3) {
      setError('Task title must be at least 3 characters long.');
      titleInputRef.current?.focus();
      return;
    }

    const taskPayload = {
      title: trimmedTitle,
      subtitle: subtitle.trim() || undefined,
      description: description.trim(),
      category,
      status,
      priority,
      dueDate: dueDate || new Date().toISOString().split('T')[0],
    };

    if (isEditing && editingTask) {
      updateTask(editingTask.id, taskPayload);
    } else {
      createTask(taskPayload);
    }

    handleClose();
  };

  if (!isOpen) return null;

  const categories = [
    'Design',
    'Development',
    'Content',
    'Research',
    'Product',
    'Operations',
  ];

  const statuses = ['To do', 'In progress', 'Completed'];
  const priorities = ['Low', 'Medium', 'High'];

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] w-full max-w-lg sm:max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#F3F4F6] flex items-start justify-between">
          <div>
            <h2 id="modal-title" className="text-xl font-bold text-[#111827] tracking-tight">
              {isEditing ? 'Edit task' : 'Create new task'}
            </h2>
            <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
              Add your task details to stay on top of your work.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 -mr-1 text-[#9CA3AF] hover:text-[#111827] rounded-lg hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Task Title */}
          <div>
            <label htmlFor="task-title" className="block text-xs font-semibold text-[#111827] mb-1.5">
              Task title <span className="text-rose-500">*</span>
            </label>
            <input
              id="task-title"
              ref={titleInputRef}
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError(null);
              }}
              placeholder="e.g. Update pricing page"
              className={`w-full px-3.5 py-2.5 text-sm rounded-lg border bg-white text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:ring-1 transition-all ${
                error
                  ? 'border-rose-400 focus:ring-rose-400'
                  : 'border-[#E5E7EB] focus:border-[#4F46E5] focus:ring-[#4F46E5]'
              }`}
            />
          </div>

          {/* Subtitle / Context */}
          <div>
            <label htmlFor="task-subtitle" className="block text-xs font-semibold text-[#111827] mb-1.5">
              Subtitle / Context
            </label>
            <input
              id="task-subtitle"
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. Website redesign · Due soon"
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#E5E7EB] bg-white text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="task-desc" className="block text-xs font-semibold text-[#111827] mb-1.5">
              Description
            </label>
            <textarea
              id="task-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add notes about this task..."
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#E5E7EB] bg-white text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] transition-all resize-none"
            />
          </div>

          {/* Category & Due Date Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="task-category" className="block text-xs font-semibold text-[#111827] mb-1.5">
                Category
              </label>
              <select
                id="task-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#E5E7EB] bg-white text-[#111827] focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="task-due-date" className="block text-xs font-semibold text-[#111827] mb-1.5">
                Due date
              </label>
              <div className="relative">
                <input
                  id="task-due-date"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full pl-3.5 pr-8 py-2.5 text-sm rounded-lg border border-[#E5E7EB] bg-white text-[#111827] focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] cursor-pointer"
                />
                <Calendar className="w-4 h-4 text-[#9CA3AF] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Status & Priority Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="task-status" className="block text-xs font-semibold text-[#111827] mb-1.5">
                Status
              </label>
              <select
                id="task-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#E5E7EB] bg-white text-[#111827] focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] cursor-pointer"
              >
                {statuses.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="task-priority" className="block text-xs font-semibold text-[#111827] mb-1.5">
                Priority
              </label>
              <select
                id="task-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#E5E7EB] bg-white text-[#111827] focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] cursor-pointer"
              >
                {priorities.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <p className="text-xs text-[#9CA3AF] pt-1">
            * Required field
          </p>

          {/* Action buttons */}
          <div className="pt-4 border-t border-[#F3F4F6] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-lg border border-[#E5E7EB] bg-white text-sm font-medium text-[#374151] hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] active:bg-[#3730A3] text-white text-sm font-medium shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:ring-offset-2 cursor-pointer"
            >
              {isEditing ? 'Save changes' : 'Create task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
