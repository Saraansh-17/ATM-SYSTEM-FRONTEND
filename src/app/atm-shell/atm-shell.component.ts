import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';

import { AccountApiService, TransactionRow } from '../core/account-api.service';
import { extractErrorMessage } from '../core/http-error';
import { ToastService } from '../core/toast.service';

type Panel = 'none' | 'deposit' | 'withdraw' | 'history';

@Component({
  selector: 'app-atm-shell',
  imports: [DatePipe, DecimalPipe],
  templateUrl: './atm-shell.component.html',
  styleUrl: './atm-shell.component.scss'
})
export class AtmShellComponent {
  private readonly api = inject(AccountApiService);
  private readonly toast = inject(ToastService);

  readonly activePanel = signal<Panel>('none');
  readonly balance = signal<number | null>(null);
  readonly balanceRevealed = signal(false);
  readonly balanceLoading = signal(false);
  readonly amountDraft = signal('');
  readonly submitting = signal(false);
  readonly transactions = signal<TransactionRow[]>([]);
  readonly historyLoading = signal(false);

  openDeposit(): void {
    this.balanceRevealed.set(false);
    this.amountDraft.set('');
    this.activePanel.set('deposit');
  }

  openWithdraw(): void {
    this.balanceRevealed.set(false);
    this.amountDraft.set('');
    this.activePanel.set('withdraw');
  }

  openHistory(): void {
    this.activePanel.set('history');
    this.loadHistory();
  }

  closePanel(): void {
    this.activePanel.set('none');
  }

  checkAvailableBalance(): void {
    this.balanceLoading.set(true);
    this.api.getBalance().subscribe({
      next: (res) => {
        this.balance.set(res.balance);
        this.balanceRevealed.set(true);
        this.balanceLoading.set(false);
      },
      error: (err) => {
        this.balanceLoading.set(false);
        this.toast.error(extractErrorMessage(err));
      }
    });
  }

  hideBalance(): void {
    this.balanceRevealed.set(false);
  }

  submitDeposit(): void {
    const amount = this.parseAmount();
    if (amount === null) {
      this.toast.error('Enter a valid positive amount');
      return;
    }
    this.submitting.set(true);
    this.api.deposit(amount).subscribe({
      next: (res) => {
        this.balance.set(res.balance);
        this.submitting.set(false);
        this.toast.success('Deposit successful');
        this.closePanel();
      },
      error: (err) => {
        this.submitting.set(false);
        this.toast.error(extractErrorMessage(err));
      }
    });
  }

  submitWithdraw(): void {
    const amount = this.parseAmount();
    if (amount === null) {
      this.toast.error('Enter a valid positive amount');
      return;
    }
    this.submitting.set(true);
    this.api.withdraw(amount).subscribe({
      next: (res) => {
        this.balance.set(res.balance);
        this.submitting.set(false);
        this.toast.success('Withdrawal successful');
        this.closePanel();
      },
      error: (err) => {
        this.submitting.set(false);
        this.toast.error(extractErrorMessage(err));
      }
    });
  }

  private loadHistory(): void {
    this.historyLoading.set(true);
    this.api.getTransactions().subscribe({
      next: (rows) => {
        this.transactions.set(rows);
        this.historyLoading.set(false);
      },
      error: (err) => {
        this.historyLoading.set(false);
        this.toast.error(extractErrorMessage(err));
      }
    });
  }

  private parseAmount(): number | null {
    const raw = this.amountDraft().trim();
    const n = Number(raw);
    if (!Number.isFinite(n) || n <= 0) {
      return null;
    }
    return n;
  }
}
