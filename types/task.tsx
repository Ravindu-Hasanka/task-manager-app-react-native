export type Task = {
  id: string;
  priority: 'HIGH PRIORITY' | 'MEDIUM PRIORITY' | 'NORMAL';
  time: string;
  title: string;
  subtitle: string;
  status: 'Pending' | 'Completed';
};