import { AxiosError, isAxiosError } from 'axios';

type ApiErrorOptions = {
  code?: string;
  isNetworkError?: boolean;
  statusCode?: number;
};

export class ApiError extends Error {
  code?: string;
  isNetworkError: boolean;
  statusCode?: number;

  constructor(message: string, options: ApiErrorOptions = {}) {
    super(message);
    this.name = 'ApiError';
    this.code = options.code;
    this.isNetworkError = options.isNetworkError ?? false;
    this.statusCode = options.statusCode;
  }
}

function getStatusMessage(statusCode?: number) {
  switch (statusCode) {
    case 400:
      return 'The request was invalid. Please review the task details and try again.';
    case 401:
    case 403:
      return 'You do not have permission to perform this action right now.';
    case 404:
      return 'The requested task could not be found on the server.';
    case 408:
      return 'The server took too long to respond. Please try again.';
    case 429:
      return 'Too many requests were sent. Please wait a moment and try again.';
    case 500:
      return 'Something went wrong on the server. Please try again in a moment..';
    case 502:
      return 'Something went wrong on the server. Please try again in a moment..';
    case 503:
      return 'The server is currently unavailable. Please try again in a moment..';
    case 504:
      return 'The server is unavailable right now. Please try again in a moment.';
    default:
      return 'Something went wrong while talking to the server. Please try again.';
  }
}

export function normalizeApiError(error: unknown) {
  if (!isAxiosError(error)) {
    return error instanceof Error ? error : new ApiError('An unexpected error occurred.');
  }

  const axiosError = error as AxiosError<{ message?: string }>;
  const serverMessage = axiosError.response?.data?.message;
  const statusCode = axiosError.response?.status;

  if (axiosError.code === 'ECONNABORTED') {
    return new ApiError('The request timed out. Please check your connection and try again.', {
      code: axiosError.code,
      isNetworkError: true,
      statusCode,
    });
  }

  if (!axiosError.response) {
    return new ApiError('Something went wrong. Please try again.', {
      code: axiosError.code,
      isNetworkError: true,
    });
  }

  return new ApiError(serverMessage || getStatusMessage(statusCode), {
    code: axiosError.code,
    statusCode,
  });
}
