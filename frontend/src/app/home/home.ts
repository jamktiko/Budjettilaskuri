import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AuthenticatorService } from '@aws-amplify/ui-angular';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { BudgetService } from '../budget.service';

// Tuodaan omat komponentit
import { PieChart } from './pie-chart/pie-chart';
// import { Summary } from './summary/summary'; // Jos sinulla on tämä
// import { IncomeExpense } from './income-expense/income-expense'; // Jos sinulla on tämä

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, PieChart, MatProgressBarModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home implements OnInit {
  loading = false;

  // DATA
  transactions: any[] = [];

  // MUUTTUJAT chartille
  chartLabels: string[] = ['Ei dataa'];
  chartData: number[] = [0];

  // STATS (Summary-komponentille)
  stats = {
    balance: 0,
    income: 0,
    expenses: 0,
  };

  // DASHBOARD DATA (Edistymispalkille)
  monthlySummary = {
    monthlyBudget: 0,
    monthlySpent: 0,
    remaining: 0,
    percentUsed: 0,
  };

  private manualBudgetTotal = 0; // Asetettujen budjettien summa
  private incomeTotal = 0; // Tulojen summa
  private expenseTotal = 0; // Menojen summa

  constructor(
    public authenticator: AuthenticatorService,
    private authservice: AuthService,
    private http: HttpClient,
    private budget: BudgetService,
  ) {}

  async ngOnInit() {
    // Synkronoidaan käyttäjä
    const token = await this.authservice.getIdToken();
    if (token) {
      this.http
        .get('/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .subscribe({
          next: (user) => console.log('Käyttäjä OK'),
          error: (err) => console.error('Synkronointi epäonnistui'),
        });
    }

    // 3. HAETAAN SEKÄ TAPAHTUMAT ETTÄ BUDJETIT
    this.getTransactions();
    this.getBudgetData();
  }

  async getTransactions() {
    this.loading = true;
    try {
      const data = (await this.budget.getTransactions()) as any[];
      this.transactions = data;

      const totals = data.reduce(
        (acc, curr) => {
          if (curr.type === 'income') acc.income += curr.amount;
          if (curr.type === 'expense') acc.expenses += curr.amount;
          return acc;
        },
        { income: 0, expenses: 0 },
      );
      this.incomeTotal = totals.income;
      this.expenseTotal = totals.expenses;
      this.stats = {
        income: totals.income,
        expenses: totals.expenses,
        balance: totals.income - totals.expenses,
      };
      this.updateDashboard();
    } catch (err) {
      console.error('Datan haku epäonnistui');
    } finally {
      this.loading = false;
    }
  }

  // 4. HAETAAN BUDJETIT PIIRAKKAA VARTEN
  async getBudgetData() {
    try {
      const budgets = (await this.budget.getBudgets()) as any[];
      if (budgets && budgets.length > 0) {
        this.chartLabels = budgets.map((b) => b.category);
        this.chartData = budgets.map((b) => b.amount);

        this.manualBudgetTotal = budgets.reduce((sum, b) => sum + (b.amount || 0), 0);
        this.updateDashboard();
      }
    } catch (err) {
      console.error('Budjettien haku epäonnistui');
    }
  }
  updateDashboard() {
    // KOKONAISBUDJETTI = Asetetut rajat + Tulot
    const totalBudget = this.manualBudgetTotal;
    const spent = this.expenseTotal - this.incomeTotal;

    this.monthlySummary = {
      monthlyBudget: totalBudget,
      monthlySpent: spent,
      remaining: totalBudget - spent,
      percentUsed: totalBudget > 0 ? (spent / totalBudget) * 100 : 0,
    };
  }
}
