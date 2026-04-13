import { Component, inject } from '@angular/core';

import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast-host',
  imports: [],
  template: `
    <div class="toast-stack" role="region" aria-label="Notifications">
      @for (t of toast.items(); track t.id) {
        <div
          class="toast"
          [class.toast--error]="t.variant === 'error'"
          [class.toast--success]="t.variant === 'success'"
          role="status"
        >
          <span class="toast__text">{{ t.message }}</span>
          <button type="button" class="toast__close" (click)="toast.dismiss(t.id)" aria-label="Dismiss">
            &times;
          </button>
        </div>
      }
    </div>
  `,
  styles: `
    .toast-stack {
      position: fixed;
      top: 1.25rem;
      right: 1.25rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
      max-width: min(22rem, calc(100vw - 2.5rem));
      pointer-events: none;
    }

    .toast {
      pointer-events: auto;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 0.75rem;
      padding: 0.85rem 1rem;
      border-radius: 12px;
      font-size: 0.9rem;
      line-height: 1.35;
      box-shadow:
        0 12px 40px rgb(0 0 0 / 35%),
        0 0 0 1px rgb(255 255 255 / 0.06);
      backdrop-filter: blur(14px);
      animation: toast-in 0.38s cubic-bezier(0.22, 1, 0.36, 1) both;
    }

    .toast--success {
      background: color-mix(in srgb, var(--atm-accent, #3ecf8e) 22%, rgb(15 22 28 / 0.92));
      color: var(--atm-text, #e8f0f5);
      border: 1px solid color-mix(in srgb, var(--atm-accent, #3ecf8e) 45%, transparent);
    }

    .toast--error {
      background: color-mix(in srgb, var(--atm-danger, #f07167) 20%, rgb(15 22 28 / 0.92));
      color: var(--atm-text, #e8f0f5);
      border: 1px solid color-mix(in srgb, var(--atm-danger, #f07167) 45%, transparent);
    }

    .toast__text {
      flex: 1;
      word-break: break-word;
    }

    .toast__close {
      flex-shrink: 0;
      border: none;
      background: rgb(255 255 255 / 0.08);
      color: inherit;
      width: 1.75rem;
      height: 1.75rem;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1.25rem;
      line-height: 1;
      display: grid;
      place-items: center;
      transition: background 0.2s ease;
    }

    .toast__close:hover {
      background: rgb(255 255 255 / 0.16);
    }

    .toast__close:focus-visible {
      outline: 2px solid var(--atm-accent, #3ecf8e);
      outline-offset: 2px;
    }

    @keyframes toast-in {
      from {
        opacity: 0;
        transform: translateX(120%) scale(0.96);
      }
      to {
        opacity: 1;
        transform: translateX(0) scale(1);
      }
    }
  `
})
export class ToastHostComponent {
  readonly toast = inject(ToastService);
}
