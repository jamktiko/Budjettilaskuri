import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { AuthenticatorService } from '@aws-amplify/ui-angular';
import { BudgetService } from '../shared/budget.service';
import { DataService } from '../data';

import { Summary } from './summary/summary';
import { IncomeExpense } from './income-expense/income-expense';
import { PieChart } from './pie-chart/pie-chart';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, Summary, IncomeExpense, PieChart],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home {
  // UI
  connectionStatus = 'Ei testattu';
  isLoading = false;
  isError = false;

  // DATA
  income$;
  expenses$;
  balance$;
  transactions$;

  constructor(
    private dataService: DataService,
    public authenticator: AuthenticatorService,
    private router: Router,
    private budget: BudgetService,
  ) {
    this.income$ = this.budget.incomeTotal$;
    this.expenses$ = this.budget.expensesTotal$;
    this.balance$ = this.budget.balance$;
    this.transactions$ = this.budget.transactions$;
  }

  testConnection() {
    this.isLoading = true;
    this.isError = false;

    this.dataService.testDbConnection().subscribe({
      next: (res) => {
        this.connectionStatus = res.message;
        this.isLoading = false;
      },
      error: () => {
        this.connectionStatus = 'Virhe';
        this.isError = true;
        this.isLoading = false;
      },
    });
  }
}
