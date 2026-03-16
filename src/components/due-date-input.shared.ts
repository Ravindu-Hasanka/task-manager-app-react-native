export function parseDueDate(value: string): Date | null {
  if (!value.trim()) {
    return null;
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate;
}

function getSeedDate(baseDate: Date | null) {
  const seedDate = baseDate ? new Date(baseDate) : new Date();
  seedDate.setSeconds(0, 0);
  return seedDate;
}

export function mergeDatePart(baseDate: Date | null, nextDatePart: Date) {
  const mergedDate = getSeedDate(baseDate);
  mergedDate.setFullYear(
    nextDatePart.getFullYear(),
    nextDatePart.getMonth(),
    nextDatePart.getDate()
  );
  return mergedDate.toISOString();
}

export function mergeTimePart(baseDate: Date | null, nextTimePart: Date) {
  const mergedDate = getSeedDate(baseDate);
  mergedDate.setHours(nextTimePart.getHours(), nextTimePart.getMinutes(), 0, 0);
  return mergedDate.toISOString();
}

export function formatDueDateLabel(date: Date | null) {
  if (!date) {
    return 'Select date';
  }

  return new Intl.DateTimeFormat(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function formatDueTimeLabel(date: Date | null) {
  if (!date) {
    return 'Select time';
  }

  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

export function formatDateInputValue(date: Date | null) {
  if (!date) {
    return '';
  }

  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function formatTimeInputValue(date: Date | null) {
  if (!date) {
    return '';
  }

  const hours = `${date.getHours()}`.padStart(2, '0');
  const minutes = `${date.getMinutes()}`.padStart(2, '0');

  return `${hours}:${minutes}`;
}
