import { apiClient } from '@/lib/api/client';
import { CreateTaskInput, Task } from '@/types/task';

export async function getTasks() {
  const response = await apiClient.get<Task[]>('/todo');
  console.log('Fetched tasks:', response.data);
  return response.data;
}

export async function getTaskById(id: string) {
  const response = await apiClient.get<Task>(`/todo/${id}`);
  return response.data;
}

export async function createTask(task: CreateTaskInput) {
  const now = new Date().toISOString();
  const response = await apiClient.post<Task>('/todo', {
    title: task.title.trim(),
    description: task.description.trim(),
    priority: task.priority,
    completed: false,
    category: task.category.trim(),
    dueDate: new Date(task.dueDate).toISOString(),
    status: 'pending',
    createdAt: now,
    updatedAt: now,
  });

  return response.data;
}
