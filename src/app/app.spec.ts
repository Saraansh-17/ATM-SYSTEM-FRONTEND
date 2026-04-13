import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { App } from './app';
import { environment } from '../environments/environment';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should not fetch balance until the user clicks Check available balance', async () => {
    const fixture = TestBed.createComponent(App);
    const httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    httpMock.verify();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('ATM Console');
    expect(compiled.textContent).toContain('Check available balance');

    const btn = compiled.querySelector('button[aria-label="Check available balance"]') as HTMLButtonElement;
    expect(btn).toBeTruthy();
    btn.click();
    fixture.detectChanges();

    const req = httpMock.expectOne(
      (r) => r.url.endsWith(`/api/accounts/${environment.accountId}/balance`) && r.method === 'GET'
    );
    req.flush({ accId: environment.accountId, balance: 250 });
    await fixture.whenStable();
    fixture.detectChanges();

    expect(compiled.textContent).toContain('250');
    httpMock.verify();
  });
});
