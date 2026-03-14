import { Task } from '../types/task';

export const TASKS: Task[] = [
  {
    id: '1',
    priority: 'HIGH PRIORITY',
    time: '9:30 AM',
    title: 'Review Lab Results',
    subtitle: 'Patient A - Cardiovascular Unit',
    status: 'Pending',
  },
  {
    id: '2',
    priority: 'MEDIUM PRIORITY',
    time: '8:00 AM',
    title: 'Consultation - Ward 4',
    subtitle: 'Routine morning checkup',
    status: 'Completed',
  },
  {
    id: '3',
    priority: 'NORMAL',
    time: '11:00 AM',
    title: 'Surgery Prep - Room 2',
    subtitle: 'Patient B - Pre-op Briefing',
    status: 'Pending',
  },
];