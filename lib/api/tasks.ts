import { apiClient } from '@/lib/api/client';
import { Task } from '@/types/task';

export async function getTasks() {
  const response = await apiClient.get<Task[]>('/todo');
  console.log('Fetched tasks:', response.data);
  return response.data;
}

export async function getTaskById(id: string) {
  const response = await apiClient.get<Task>(`/todo/${id}`);
  return response.data;
}
