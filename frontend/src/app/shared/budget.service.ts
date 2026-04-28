import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Expense {
  category: string;
  amount: number;
}

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  // 💰 tulot
  private income = new BehaviorSubject<number>(0);
  income$ = this.income.asObservable();

  // 🧾 kulut
  private expenses = new BehaviorSubject<Expense[]>([]);
  expenses$ = this.expenses.asObservable();

  // ➕ aseta tulot
  setIncome(value: number) {
    this.income.next(value);
  }

  // ➕ lisää kulu
  addExpense(expense: Expense) {
    const current = this.expenses.value;
    this.expenses.next([...current, expense]);
  }

  // 💰 kulut yhteensä
  getTotalExpenses(): number {
    return this.expenses.value.reduce((sum, e) => sum + e.amount, 0);
  }

  // 🧾 kaikki kulut
  getExpenses(): Expense[] {
    return this.expenses.value;
  }

  // 🧮 saldo
  getBalance(): number {
    return this.income.value - this.getTotalExpenses();
  }
}
