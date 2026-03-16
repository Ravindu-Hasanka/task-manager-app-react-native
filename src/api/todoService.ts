import { apiClient } from '../api/axiosInstance';
import { CreateTaskInput, Task } from '../types/task';

export async function getTasks() {
  const response = await apiClient.get<Task[]>('/todo');
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

export async function updateTask(task: Task) {
  const now = new Date().toISOString();
  const response = await apiClient.put<Task>(`/todo/${task.id}`, {
    title: task.title.trim(),
    description: task.description.trim(),
    priority: task.priority,
    completed: task.completed,
    category: task.category.trim(),
    dueDate: new Date(task.dueDate).toISOString(),
    status: task.status,
    createdAt: task.createdAt,
    updatedAt: now,
  });

  return response.data;
}

export async function deleteTask(id: string) {
  await apiClient.delete(`/todo/${id}`);
}
