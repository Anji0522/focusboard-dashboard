import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { Task, TaskStats, FilterState, FocusNoteSlide, TaskStatus } from '../types/task';
import { INITIAL_TASKS, FOCUS_NOTES_SLIDES } from '../data/initialData';

const LOCAL_STORAGE_KEY = 'focusboard_tasks_v2';

interface TaskContextType {
  tasks: Task[];
  filteredTasks: Task[];
  stats: TaskStats;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  createTask: (taskData: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
  deleteTask: (id: string) => void;
  updateTaskStatus: (id: string, newStatus: TaskStatus) => void;
  cycleTaskStatus: (id: string) => void;
  resetToDefaultData: () => void;
  
  // Carousel state
  carouselSlides: FocusNoteSlide[];
  activeSlide: number;
  nextSlide: () => void;
  prevSlide: () => void;
  goToSlide: (index: number) => void;

  // Modal / UI state
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
  editingTask: Task | null;
  setEditingTask: (task: Task | null) => void;
  deletingTask: Task | null;
  setDeletingTask: (task: Task | null) => void;
  isMobileNavOpen: boolean;
  setIsMobileNavOpen: (open: boolean) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load tasks from localStorage or fall back to INITIAL_TASKS
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse tasks from localStorage:', e);
    }
    return INITIAL_TASKS;
  });

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to write tasks to localStorage:', e);
    }
  }, [tasks]);

  // Filters state
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    status: 'All',
    priority: 'All',
    category: 'All',
    sortBy: 'dueDateAsc',
  });

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Carousel state
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const carouselSlides = FOCUS_NOTES_SLIDES;

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % carouselSlides.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
  };

  const goToSlide = (index: number) => {
    if (index >= 0 && index < carouselSlides.length) {
      setActiveSlide(index);
    }
  };

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Derived Statistics (DO NOT hardcode)
  const stats: TaskStats = useMemo(() => {
    const total = tasks.length;
    const todo = tasks.filter((t) => t.status === 'To do').length;
    const inProgress = tasks.filter((t) => t.status === 'In progress').length;
    const completed = tasks.filter((t) => t.status === 'Completed').length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      todo,
      inProgress,
      completed,
      completionRate,
    };
  }, [tasks]);

  // Derived Filtered and Sorted Tasks
  const filteredTasks = useMemo(() => {
    const query = filters.searchQuery.trim().toLowerCase();

    const filtered = tasks.filter((task) => {
      // Search filter (title, subtitle or description)
      if (query) {
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesSub = task.subtitle?.toLowerCase().includes(query) ?? false;
        const matchesDesc = task.description.toLowerCase().includes(query);
        const matchesCat = task.category.toLowerCase().includes(query);
        if (!matchesTitle && !matchesSub && !matchesDesc && !matchesCat) return false;
      }

      // Status filter
      if (filters.status !== 'All' && task.status !== filters.status) {
        return false;
      }

      // Priority filter
      if (filters.priority !== 'All' && task.priority !== filters.priority) {
        return false;
      }

      // Category filter
      if (filters.category !== 'All' && task.category !== filters.category) {
        return false;
      }

      return true;
    });

    // Sorting
    return [...filtered].sort((a, b) => {
      if (filters.sortBy === 'dueDateAsc') {
        return a.dueDate.localeCompare(b.dueDate);
      }
      if (filters.sortBy === 'dueDateDesc') {
        return b.dueDate.localeCompare(a.dueDate);
      }
      if (filters.sortBy === 'priorityDesc') {
        const weight: Record<string, number> = { High: 3, Medium: 2, Low: 1 };
        return (weight[b.priority] || 0) - (weight[a.priority] || 0);
      }
      if (filters.sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });
  }, [tasks, filters]);

  // State Mutations (Immutable)
  const createTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const updateTask = (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
    if (editingTask?.id === id) {
      setEditingTask(null);
    }
  };

  const updateTaskStatus = (id: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, status: newStatus } : task))
    );
  };

  const cycleTaskStatus = (id: string) => {
    const cycleMap: Record<TaskStatus, TaskStatus> = {
      'To do': 'In progress',
      'In progress': 'Completed',
      'Completed': 'To do',
    };
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, status: cycleMap[task.status] } : task
      )
    );
  };

  const resetToDefaultData = () => {
    setTasks(INITIAL_TASKS);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_TASKS));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        filteredTasks,
        stats,
        filters,
        setFilters,
        updateFilter,
        createTask,
        updateTask,
        deleteTask,
        updateTaskStatus,
        cycleTaskStatus,
        resetToDefaultData,
        carouselSlides,
        activeSlide,
        nextSlide,
        prevSlide,
        goToSlide,
        isCreateModalOpen,
        setIsCreateModalOpen,
        editingTask,
        setEditingTask,
        deletingTask,
        setDeletingTask,
        isMobileNavOpen,
        setIsMobileNavOpen,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskManager = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskManager must be used within a TaskProvider');
  }
  return context;
};
