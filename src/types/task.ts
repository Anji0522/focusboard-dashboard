export type TaskStatus = 'To do' | 'In progress' | 'Completed';

export type TaskPriority = 'Low' | 'Medium' | 'High';

export type TaskCategory = 'Design' | 'Development' | 'Content' | 'Research' | 'Product' | 'Operations' | 'Marketing';

export interface Task {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  category: TaskCategory;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string; // ISO date string YYYY-MM-DD
  createdAt: string;
}

export interface FocusNoteSlide {
  id: string;
  tag: string;
  counter: string;
  headline: string;
  subtitle: string;
  cardSubtext: string;
  cardTitle: string;
  cardProgress: number; // percentage e.g. 62
}

export interface TaskStats {
  total: number;
  todo: number;
  inProgress: number;
  completed: number;
  completionRate: number;
}

export type SortOption = 'dueDateAsc' | 'dueDateDesc' | 'priorityDesc' | 'newest';

export interface FilterState {
  searchQuery: string;
  status: 'All' | TaskStatus;
  priority: 'All' | TaskPriority;
  category: 'All' | TaskCategory;
  sortBy: SortOption;
}
