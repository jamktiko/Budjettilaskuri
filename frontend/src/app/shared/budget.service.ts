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
  // 🧾 lista kuluista
  private expenses = new BehaviorSubject<Expense[]>([]);

  // 🔓 ulos komponentteihin
  expenses$ = this.expenses.asObservable();

  // ➕ lisää kulu
  addExpense(expense: Expense) {
    const current = this.expenses.value;
    this.expenses.next([...current, expense]);
  }

  // 💰 laske menot yhteensä
  getTotalExpenses(): number {
    return this.expenses.value.reduce((sum, e) => sum + e.amount, 0);
  }

  // 📊 hae kaikki kulut (jos joskus tarvitset suoraan)
  getExpenses(): Expense[] {
    return this.expenses.value;
  }
}
