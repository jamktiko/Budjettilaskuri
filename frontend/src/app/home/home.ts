import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AuthenticatorService } from '@aws-amplify/ui-angular';
import { AuthService } from '../auth.service';
import { BudgetService } from '../budget.service';

// Tuodaan omat komponentit
import { PieChart } from './pie-chart/pie-chart';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, PieChart, MatProgressBarModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home implements OnInit {
  // RIIPPUVUUDET
  public authenticator = inject(AuthenticatorService);
  private authservice = inject(AuthService);
  private http = inject(HttpClient);
  private budget = inject(BudgetService);

  // 2. TILA
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

  // 3. KÄYNNISTYS
  async ngOnInit() {
    this.syncUser();
    // Haetaan data rinnakkain, jotta sivu latautuu nopeammin
    await Promise.all([this.getTransactions(), this.getBudgetData()]);
  }

  // 4. METODIT
  private async syncUser() {
    const token = await this.authservice.getIdToken();
    if (!token) return;

    this.http.get('/api/users/me', { headers: { Authorization: `Bearer ${token}` } }).subscribe({
      next: () => console.log('Käyttäjä OK'),
      error: () => console.error('Synkronointi epäonnistui'),
    });
  }

  async getTransactions() {
    this.loading = true;
    try {
      this.transactions = (await this.budget.getTransactions()) as any[];

      // Lasketaan statsit suoraan yhteen paikkaan
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

  async getBudgetData() {
    try {
      const budgets = (await this.budget.getBudgets()) as any[];
      if (!budgets?.length) return; // Keskeytetään jos ei dataa

      this.chartLabels = budgets.map((b) => b.category);
      this.chartData = budgets.map((b) => b.amount);
      this.manualBudgetTotal = budgets.reduce((sum, b) => sum + (b.amount || 0), 0);

      this.updateDashboard();
    } catch (err) {
      console.error('Budjettien haku epäonnistui');
    }
  }

  updateDashboard() {
    // 1. Perusbudjetti
    const baseBudget = this.manualBudgetTotal;

    // 2. Puhtaat menot (esim. 900 €) - ei vähennellä tuloja!
    const totalSpent = this.stats.expenses;

    // 3. Tulot (esim. 200 €)
    const totalIncome = this.stats.income;

    // 4. LASKETAAN KÄYTETTÄVISSÄ OLEVA RAHA (Perusbudjetti + Tulot)
    // Esim. 1 300 € + 200 € = 1 500 €
    const availableMoney = baseBudget + totalIncome;

    this.monthlySummary = {
      // Näyttää vasemmassa laatikossa asetetun budjetin (1 300 €)
      monthlyBudget: baseBudget,

      // Näyttää keskellä rehelliset menot (900 €)
      monthlySpent: totalSpent,

      // Jäljellä: Käytettävissä oleva raha miinus menot (1 500 € - 900 € = 600 €)
      remaining: availableMoney - totalSpent,

      percentUsed: availableMoney > 0 ? (totalSpent / availableMoney) * 100 : 0,
    };
  }
}
