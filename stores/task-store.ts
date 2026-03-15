import { create } from 'zustand';

import {
  createTask as createTaskRequest,
  getTaskById,
  getTasks,
  updateTask as updateTaskRequest,
} from '@/lib/api/tasks';
import { TASKS as seedTasks } from '@/mock-data/tasks';
import { CreateTaskInput, Task } from '@/types/task';

type TaskStore = {
  createTaskError: string | null;
  error: string | null;
  isCreatingTask: boolean;
  isFetchingList: boolean;
  isFetchingTask: boolean;
  isUpdatingTask: boolean;
  selectedTaskId: string | null;
  tasks: Task[];
  updateTaskError: string | null;
  addTask: (task: CreateTaskInput) => Promise<Task>;
  completeTask: (id: string, completed?: boolean) => Promise<Task | undefined>;
  deleteTask: (id: string) => void;
  fetchTaskById: (id: string) => Promise<Task | undefined>;
  fetchTasks: () => Promise<void>;
  updateTask: (task: Task) => Promise<Task>;
};

function replaceTask(tasks: Task[], task: Task) {
  const existingIndex = tasks.findIndex((item) => item.id === task.id);

  if (existingIndex === -1) {
    return [task, ...tasks];
  }

  return tasks.map((item) => (item.id === task.id ? task : item));
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  createTaskError: null,
  error: null,
  isCreatingTask: false,
  isFetchingList: false,
  isFetchingTask: false,
  isUpdatingTask: false,
  selectedTaskId: null,
  tasks: seedTasks,
  updateTaskError: null,
  addTask: async (task) => {
    set({
      createTaskError: null,
      isCreatingTask: true,
    });

    try {
      const createdTask = await createTaskRequest(task);

      set((state) => ({
        isCreatingTask: false,
        tasks: replaceTask(state.tasks, createdTask),
      }));

      return createdTask;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to create task';

      set({
        createTaskError: message,
        isCreatingTask: false,
      });

      throw error instanceof Error ? error : new Error(message);
    }
  },
  completeTask: async (id, completed = true) => {
    const task = get().tasks.find((item) => item.id === id);

    if (!task) {
      return undefined;
    }

    set({
      isUpdatingTask: true,
      updateTaskError: null,
    });

    try {
      const updatedTask = await updateTaskRequest({
        ...task,
        completed,
        status: completed ? 'completed' : 'pending',
      });

      set((state) => ({
        isUpdatingTask: false,
        tasks: replaceTask(state.tasks, updatedTask),
      }));

      return updatedTask;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to update task status';

      set({
        isUpdatingTask: false,
        updateTaskError: message,
      });

      throw error instanceof Error ? error : new Error(message);
    }
  },
  deleteTask: (id) => {
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
      selectedTaskId: state.selectedTaskId === id ? null : state.selectedTaskId,
    }));
  },
  fetchTaskById: async (id) => {
    set({
      error: null,
      isFetchingTask: true,
      selectedTaskId: id,
    });

    try {
      const task = await getTaskById(id);

      set((state) => ({
        isFetchingTask: false,
        tasks: replaceTask(state.tasks, task),
      }));

      return task;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unable to load task details',
        isFetchingTask: false,
      });

      return get().tasks.find((task) => task.id === id);
    }
  },
  fetchTasks: async () => {
    set({
      error: null,
      isFetchingList: true,
    });

    try {
      const tasks = await getTasks();
      set({
        isFetchingList: false,
        tasks,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unable to load tasks',
        isFetchingList: false,
      });
    }
  },
  updateTask: async (task) => {
    set({
      isUpdatingTask: true,
      updateTaskError: null,
    });

    try {
      const updatedTask = await updateTaskRequest(task);

      set((state) => ({
        isUpdatingTask: false,
        tasks: replaceTask(state.tasks, updatedTask),
      }));

      return updatedTask;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to update task';

      set({
        isUpdatingTask: false,
        updateTaskError: message,
      });

      throw error instanceof Error ? error : new Error(message);
    }
  },
}));
