import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AuthenticatorService } from '@aws-amplify/ui-angular';
import { AuthService } from '../auth.service';
import { BudgetService } from '../budget.service';

import { PieChart } from './pie-chart/pie-chart';

// 👉 LISÄTTY
import { NotificationService } from '../shared/notification/notification.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule /* PieChart*/, MatProgressBarModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home implements OnInit {
  // -------------------
  // RIIPPUVUUDET
  // -------------------
  public authenticator = inject(AuthenticatorService);
  private authservice = inject(AuthService);
  private http = inject(HttpClient);
  private budget = inject(BudgetService);

  // 👉 LISÄTTY
  private notificationService = inject(NotificationService);

  // -------------------
  // TILA
  // -------------------
  loading = false;
  transactions: any[] = [];

  chartLabels: string[] = ['Ei dataa'];
  chartData: number[] = [0];

  stats = { balance: 0, income: 0, expenses: 0 };

  monthlySummary = {
    monthlyBudget: 0,
    monthlySpent: 0,
    remaining: 0,
    percentUsed: 0,
  };

  private manualBudgetTotal = 0;

  // -------------------
  // NOTIFIKAATIO FLAGIT
  // -------------------
  private warning80Shown = false;
  private budgetExceededShown = false;

  // -------------------
  // INIT
  // -------------------
  async ngOnInit() {
    this.syncUser();
    await Promise.all([this.getTransactions(), this.getBudgetData()]);
  }

  // -------------------
  // USER SYNC
  // -------------------
  private async syncUser() {
    const token = await this.authservice.getIdToken();
    if (!token) return;

    this.http
      .get('/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe({
        next: () => console.log('Käyttäjä OK'),
        error: () => console.error('Synkronointi epäonnistui'),
      });
  }

  // -------------------
  // TRANSACTIONS
  // -------------------
  async getTransactions() {
    this.loading = true;

    try {
      const allTransactions = (await this.budget.getTransactions()) as any[];

      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      this.transactions = allTransactions.filter((t) => {
        const date = new Date(t.date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      });

      this.stats = this.transactions.reduce(
        (acc, t) => {
          if (t.type === 'income') acc.income += t.amount;
          if (t.type === 'expense') acc.expenses += t.amount;
          acc.balance = acc.income - acc.expenses;
          return acc;
        },
        { income: 0, expenses: 0, balance: 0 },
      );

      this.updateDashboard();
    } catch (err) {
      console.error('Datan haku epäonnistui');
    } finally {
      this.loading = false;
    }
  }

  // -------------------
  // BUDGET
  // -------------------
  async getBudgetData() {
    try {
      const allBudgets = (await this.budget.getBudgets()) as any[];
      if (!allBudgets?.length) return;

      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const budgets = allBudgets.filter((b) => {
        const date = new Date(b.date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      });

      if (!budgets.length) {
        this.chartLabels = ['Ei dataa'];
        this.chartData = [0];
        this.manualBudgetTotal = 0;
        this.updateDashboard();
        return;
      }

      this.chartLabels = budgets.map((b) => b.category);
      this.chartData = budgets.map((b) => b.amount);

      this.manualBudgetTotal = budgets.reduce((sum, b) => sum + (b.amount || 0), 0);

      this.updateDashboard();
    } catch (err) {
      console.error('Budjettien haku epäonnistui');
    }
  }

  // -------------------
  // DASHBOARD
  // -------------------
  updateDashboard() {
    this.monthlySummary.monthlyBudget = this.manualBudgetTotal;
    this.monthlySummary.monthlySpent = this.stats.expenses;

    this.monthlySummary.remaining =
      this.monthlySummary.monthlyBudget - this.monthlySummary.monthlySpent;

    this.monthlySummary.percentUsed =
      this.monthlySummary.monthlyBudget > 0
        ? (this.monthlySummary.monthlySpent / this.monthlySummary.monthlyBudget) * 100
        : 0;

    this.checkBudgetWarnings(); // 👉 TÄRKEÄ
  }

  // -------------------
  // NOTIFICATIONS
  // -------------------
  private checkBudgetWarnings(): void {
    const spent = this.monthlySummary.monthlySpent;
    const budget = this.monthlySummary.monthlyBudget;

    if (!budget) return;

    // 80%
    if (spent >= budget * 0.8 && !this.warning80Shown) {
      this.notificationService.add('80% budjetista käytetty');

      this.warning80Shown = true;
    }

    // 100%
    if (spent >= budget && !this.budgetExceededShown) {
      this.notificationService.add('Budjetti ylitetty');

      this.budgetExceededShown = true;
    }
  }
}
