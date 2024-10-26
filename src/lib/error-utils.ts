export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof APIError) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
}

export function isNetworkError(error: unknown): boolean {
  return (
    error instanceof Error &&
    ('code' in error || error.message.includes('network') || error.message.includes('connection'))
  );
}

export function isAuthError(error: unknown): boolean {
  return error instanceof APIError && (error.status === 401 || error.status === 403);
}

export function handleApiError(error: unknown): never {
  if (error instanceof APIError) {
    if (error.status === 401) {
      throw new APIError('Please log in to continue', 401, 'UNAUTHORIZED');
    }
    if (error.status === 403) {
      throw new APIError('You don\'t have permission to perform this action', 403, 'FORBIDDEN');
    }
    if (error.status === 404) {
      throw new APIError('The requested resource was not found', 404, 'NOT_FOUND');
    }
    if (error.status >= 500) {
      throw new APIError('Server error. Please try again later', error.status, 'SERVER_ERROR');
    }
  }

  if (isNetworkError(error)) {
    throw new APIError('Network error. Please check your connection', 0, 'NETWORK_ERROR');
  }

  throw new APIError('An unexpected error occurred', 0, 'UNKNOWN_ERROR');
}