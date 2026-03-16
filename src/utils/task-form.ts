import * as yup from 'yup';

import { CreateTaskInput, TASK_PRIORITIES, TaskPriority } from '../types/task';

export type TaskFormValues = Omit<CreateTaskInput, 'priority'> & {
  priority?: TaskPriority;
};

export const taskFormDefaults: TaskFormValues = {
  title: '',
  description: '',
  category: '',
  dueDate: '',
  priority: undefined,
};

export const taskFormSchema: yup.ObjectSchema<TaskFormValues> = yup.object({
  title: yup.string().trim().required('Title is required'),
  description: yup.string().trim().required('Description is required'),
  category: yup.string().trim().required('Category is required'),
  dueDate: yup
    .string()
    .required('Due date is required')
    .test('valid-date', 'Please choose a valid date and time', (value) => {
      if (!value) {
        return false;
      }

      return !Number.isNaN(Date.parse(value));
    }),
  priority: yup.mixed<TaskPriority>().oneOf(TASK_PRIORITIES).required('Priority is required'),
});

export function mapTaskFormValuesToInput(values: TaskFormValues): CreateTaskInput {
  if (!values.priority) {
    throw new Error('Priority is required');
  }

  return {
    title: values.title,
    description: values.description,
    category: values.category,
    dueDate: values.dueDate,
    priority: values.priority,
  };
}
