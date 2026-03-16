export const APP_ROUTES = {
  addTask: '/add-task',
  dashboard: '/',
  taskDetails: (id: string) => ({
    pathname: '/task/[id]' as const,
    params: { id },
  }),
  taskEdit: (id: string) => ({
    pathname: '/task/[id]/edit' as const,
    params: { id },
  }),
  tasks: '/tasks',
};
