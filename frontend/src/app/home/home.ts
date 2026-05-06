import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AuthenticatorService } from '@aws-amplify/ui-angular';
import { DataService } from '../data';

import { PieChart } from './pie-chart/pie-chart';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { BudgetService } from '../budget.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule /*PieChart*/, MatProgressBarModule],
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

  // 🔥 uusi dashboard data
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

      this.transactions = data;

      // 🔥 normalize type (tärkeä bugien estoon)
      const normalize = (t: any) => (t.type || '').toLowerCase();

      // 🔥 jaottelu
      this.budgets = data.filter((t) => normalize(t) === 'budget');
      this.expenses = data.filter((t) => normalize(t) === 'expense');

      // 🔥 income/expense stats
      const totals = data.reduce(
        (acc, curr) => {
          const type = normalize(curr);

          if (type === 'income') acc.income += curr.amount;
          if (type === 'expense') acc.expenses += curr.amount;

          return acc;
        },
        { income: 0, expenses: 0 },
      );

      this.stats = {
        income: totals.income,
        expenses: totals.expenses,
        balance: totals.income - totals.expenses,
      };

      // 🔥 kuukausilaskenta
      this.calculateMonthlySummary();

      console.log('Tapahtumat haettu:', this.transactions);
    } catch (err) {
      console.error('Tapahtumien haku epäonnistui:', err);
    } finally {
      this.loading = false;
    }
  }

  // 🔥 YDIN: kuukausibudjetti
  calculateMonthlySummary() {
    const monthlyBudget = this.budgets.reduce((sum, b) => sum + (b.amount || 0), 0);

    const monthlySpent = this.expenses.reduce((sum, e) => sum + (e.amount || 0), 0);

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
