import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

export interface BalanceResponse {
  accId: number;
  balance: number;
}

export interface TransactionRow {
  type: string;
  amount: number;
  t_time: string;
}

@Injectable({ providedIn: 'root' })
export class AccountApiService {
  private readonly http = inject(HttpClient);

  private baseUrl(): string {
    const root = environment.apiBase.replace(/\/$/, '');
    return `${root}/api/accounts/${environment.accountId}`;
  }

  getBalance(): Observable<BalanceResponse> {
    return this.http.get<BalanceResponse>(`${this.baseUrl()}/balance`);
  }

  deposit(amount: number): Observable<BalanceResponse> {
    return this.http.post<BalanceResponse>(`${this.baseUrl()}/deposit`, { amount });
  }

  withdraw(amount: number): Observable<BalanceResponse> {
    return this.http.post<BalanceResponse>(`${this.baseUrl()}/withdraw`, { amount });
  }

  getTransactions(): Observable<TransactionRow[]> {
    return this.http.get<TransactionRow[]>(`${this.baseUrl()}/transactions`);
  }
}
