export type Task = {
  id: string;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Normal';
  completed: boolean;
  category: string;
  dueDate: string;
  status: 'pending' | 'completed';
  createdAt: string;
  updatedAt: string;
};
