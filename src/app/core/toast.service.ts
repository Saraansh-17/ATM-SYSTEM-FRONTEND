import { Injectable, signal } from '@angular/core';

export type ToastVariant = 'success' | 'error';

export interface ToastItem {
  id: number;
  message: string;
  variant: ToastVariant;
}

const DISMISS_MS = 4200;

@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 0;
  readonly items = signal<ToastItem[]>([]);

  success(message: string): void {
    this.push(message, 'success');
  }

  error(message: string): void {
    this.push(message, 'error');
  }

  dismiss(id: number): void {
    this.items.update((list) => list.filter((t) => t.id !== id));
  }

  private push(message: string, variant: ToastVariant): void {
    const id = ++this.nextId;
    const toast: ToastItem = { id, message, variant };
    this.items.update((list) => [...list, toast]);
    globalThis.setTimeout(() => this.dismiss(id), DISMISS_MS);
  }
}
