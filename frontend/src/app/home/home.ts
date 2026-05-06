import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { AuthenticatorService } from '@aws-amplify/ui-angular';
import { DataService } from '../data';

import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { BudgetService } from '../budget.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home {
  // UI
  connectionStatus = 'Ei testattu';
  isLoading = false;
  isError = false;
  loading = false;

  // DATA
  transactions: any[] = [];
  budgets: any[] = [];
  expenses: any[] = [];

  // STATS
  stats = {
    balance: 0,
    income: 0,
    expenses: 0,
  };

  // dashboard
  monthlySummary: {
    monthlyBudget: number;
    monthlySpent: number;
    remaining: number;
    percentUsed: number;
  } | null = null;

  constructor(
    private dataService: DataService,
    public authenticator: AuthenticatorService,
    private router: Router,
    private authservice: AuthService,
    private http: HttpClient,
    private budget: BudgetService,
  ) {}

  async ngOnInit() {
    const token = await this.authservice.getIdToken();

    if (token) {
      this.http
        .get('/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .subscribe({
          next: (user) => console.log('Käyttäjä synkronoitu tietokantaan:', user),
          error: (err) => console.error('Synkronointi epäonnistui:', err),
        });
    }

    this.getTransactions();
  }

  async getTransactions() {
    this.loading = true;

    try {
      const data = (await this.budget.getTransactions()) as any[];

      console.log('ALL DATA:', data);

      this.transactions = data;

      const normalize = (t: any) => (t.type || '').toLowerCase();

      const toNumber = (v: any) => Number(v) || 0;

      // 🔥 jaottelu
      this.budgets = data.filter((t) => normalize(t) === 'budget');

      this.expenses = data.filter((t) => normalize(t) === 'expense');

      console.log('BUDGETS:', this.budgets);
      console.log('EXPENSES:', this.expenses);

      // 🔥 stats
      const totals = data.reduce(
        (acc, curr) => {
          const type = normalize(curr);
          const amount = toNumber(curr.amount);

          if (type === 'income') acc.income += amount;
          if (type === 'expense') acc.expenses += amount;

          return acc;
        },
        { income: 0, expenses: 0 },
      );

      this.stats = {
        income: totals.income,
        expenses: totals.expenses,
        balance: totals.income - totals.expenses,
      };

      this.calculateMonthlySummary();
    } catch (err) {
      console.error('Tapahtumien haku epäonnistui:', err);
    } finally {
      this.loading = false;
    }
  }

  calculateMonthlySummary() {
    const monthlyBudget = this.budgets.reduce((sum, b) => sum + (Number(b.amount) || 0), 0);

    const monthlySpent = this.expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

    const remaining = monthlyBudget - monthlySpent;

    const percentUsed = monthlyBudget > 0 ? (monthlySpent / monthlyBudget) * 100 : 0;

    this.monthlySummary = {
      monthlyBudget,
      monthlySpent,
      remaining,
      percentUsed,
    };
  }
}
