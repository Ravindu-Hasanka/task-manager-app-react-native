import { DateFilter, Filter, TaskSortOrder } from '../types/task-filter';
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

export function isTaskDueToday(task: Task, referenceDate = new Date()) {
  const dueDate = new Date(task.dueDate);

  if (Number.isNaN(dueDate.getTime())) {
    return false;
  }

  return (
    dueDate.getFullYear() === referenceDate.getFullYear() &&
    dueDate.getMonth() === referenceDate.getMonth() &&
    dueDate.getDate() === referenceDate.getDate()
  );
}

export function isTaskDueOnDate(task: Task, referenceDate: Date) {
  const dueDate = new Date(task.dueDate);

  if (Number.isNaN(dueDate.getTime())) {
    return false;
  }

  return (
    dueDate.getFullYear() === referenceDate.getFullYear() &&
    dueDate.getMonth() === referenceDate.getMonth() &&
    dueDate.getDate() === referenceDate.getDate()
  );
}

function getTaskDueDate(task: Task) {
  return new Date(task.dueDate);
}

function getStartOfDay(referenceDate: Date) {
  const startOfDay = new Date(referenceDate);
  startOfDay.setHours(0, 0, 0, 0);
  return startOfDay;
}

export function isTaskOverdue(task: Task, referenceDate = new Date()) {
  const dueDate = getTaskDueDate(task);

  if (Number.isNaN(dueDate.getTime())) {
    return false;
  }

  return dueDate.getTime() < getStartOfDay(referenceDate).getTime();
}

export function isTaskUpcoming(task: Task, referenceDate = new Date()) {
  const dueDate = getTaskDueDate(task);

  if (Number.isNaN(dueDate.getTime())) {
    return false;
  }

  return (
    dueDate.getTime() > getStartOfDay(referenceDate).getTime() &&
    !isTaskDueToday(task, referenceDate)
  );
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

export function matchesTaskDateFilter(task: Task, filter: DateFilter, referenceDate = new Date()) {
  if (filter === 'today') {
    return isTaskDueToday(task, referenceDate);
  }

  if (filter === 'upcoming') {
    return isTaskUpcoming(task, referenceDate);
  }

  if (filter === 'overdue') {
    return isTaskOverdue(task, referenceDate);
  }

  return true;
}

export function matchesTaskPickedDate(task: Task, selectedDate: Date | null) {
  if (!selectedDate) {
    return true;
  }

  return isTaskDueOnDate(task, selectedDate);
}

export function sortTasksByDueDate(tasks: Task[], sortOrder: TaskSortOrder) {
  return [...tasks].sort((leftTask, rightTask) => {
    const leftDate = getTaskDueDate(leftTask);
    const rightDate = getTaskDueDate(rightTask);
    const leftTime = Number.isNaN(leftDate.getTime())
      ? Number.MAX_SAFE_INTEGER
      : leftDate.getTime();
    const rightTime = Number.isNaN(rightDate.getTime())
      ? Number.MAX_SAFE_INTEGER
      : rightDate.getTime();

    return sortOrder === 'due-asc' ? leftTime - rightTime : rightTime - leftTime;
  });
}
