import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Expense {
  category: string;
  amount: number;
}

export interface Income {
  source: string;
  amount: number;
}

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  // 💰 tulot (lista, ei vain yksi arvo)
  private incomes = new BehaviorSubject<Income[]>([]);
  incomes$ = this.incomes.asObservable();

  // 🧾 kulut
  private expenses = new BehaviorSubject<Expense[]>([]);
  expenses$ = this.expenses.asObservable();

  // ➕ lisää tulo
  addIncome(income: Income) {
    const current = this.incomes.value;
    this.incomes.next([...current, income]);
  }

  // ➕ lisää kulu
  addExpense(expense: Expense) {
    const current = this.expenses.value;
    this.expenses.next([...current, expense]);
  }

  // 💰 tulot yhteensä
  getTotalIncome(): number {
    return this.incomes.value.reduce((sum, i) => sum + i.amount, 0);
  }

  // 🧾 kulut yhteensä
  getTotalExpenses(): number {
    return this.expenses.value.reduce((sum, e) => sum + e.amount, 0);
  }

  // 🧮 saldo
  getBalance(): number {
    return this.getTotalIncome() - this.getTotalExpenses();
  }

  // 🧾 helper: kaikki kulut
  getExpenses(): Expense[] {
    return this.expenses.value;
  }

  // 💰 helper: kaikki tulot
  getIncomes(): Income[] {
    return this.incomes.value;
  }
}
