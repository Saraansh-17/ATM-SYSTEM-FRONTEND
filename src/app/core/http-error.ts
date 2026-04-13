import { HttpErrorResponse } from '@angular/common/http';

export function extractErrorMessage(err: unknown): string {
  if (err instanceof HttpErrorResponse) {
    const body = err.error;
    if (typeof body === 'string' && body.trim()) {
      return body.length > 200 ? err.statusText || 'Request failed' : body;
    }
    if (body && typeof body === 'object') {
      const o = body as Record<string, unknown>;
      if (typeof o['error'] === 'string' && o['error']) {
        return o['error'];
      }
      if (typeof o['message'] === 'string' && o['message']) {
        return o['message'];
      }
      if (typeof o['detail'] === 'string' && o['detail']) {
        return o['detail'];
      }
    }
    return err.message || err.statusText || `Error ${err.status}`;
  }
  if (err instanceof Error) {
    return err.message;
  }
  return 'Something went wrong';
}
