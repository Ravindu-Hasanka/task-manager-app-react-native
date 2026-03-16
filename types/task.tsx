export const TASK_PRIORITIES = ['High', 'Medium', 'Low'] as const;

export type TaskPriority = (typeof TASK_PRIORITIES)[number];
export type TaskStatus = 'pending' | 'completed';

export type Task = {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  completed: boolean;
  category: string;
  dueDate: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
};

export type CreateTaskInput = {
  title: string;
  description: string;
  priority: TaskPriority;
  category: string;
  dueDate: string;
};
