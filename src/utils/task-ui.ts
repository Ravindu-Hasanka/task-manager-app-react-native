import { Filter } from '../types/task-filter';
import { Task } from '../types/task';

export function isTaskCompleted(task: Task) {
  return task.completed || task.status === 'completed';
}

export function getTaskStatusLabel(task: Task) {
  return isTaskCompleted(task) ? 'Completed' : 'Pending';
}

export function getTaskPriorityLabel(task: Task) {
  return `${task.priority.toUpperCase()} PRIORITY`;
}

export function getTaskDueLabel(task: Task) {
  const dueDate = new Date(task.dueDate);

  if (Number.isNaN(dueDate.getTime())) {
    return task.dueDate;
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(dueDate);
}

export function getTaskCreatedLabel(task: Task) {
  const createdDate = new Date(task.createdAt);

  if (Number.isNaN(createdDate.getTime())) {
    return task.createdAt;
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(createdDate);
}

export function matchesTaskSearch(task: Task, search: string) {
  const searchValue = search.trim().toLowerCase();

  if (!searchValue) {
    return true;
  }

  return [task.title, task.description, task.category].some((value) =>
    value.toLowerCase().includes(searchValue)
  );
}

export function matchesTaskFilter(task: Task, filter: Filter) {
  const completed = isTaskCompleted(task);

  if (filter === 'completed') {
    return completed;
  }

  if (filter === 'pending') {
    return !completed;
  }

  return true;
}
