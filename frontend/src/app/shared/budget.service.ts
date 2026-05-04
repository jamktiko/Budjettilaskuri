import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { Transaction } from '../models/transaction.model';

@Injectable({
  providedIn: 'root',
})
export class BudgetService1 {
  // =========================
  // STATE
  // =========================
  private transactions = new BehaviorSubject<Transaction[]>([]);
  transactions$ = this.transactions.asObservable();

  // =========================
  // MUTATION
  // =========================
  addTransaction(transaction: Transaction) {
    this.transactions.next([...this.transactions.value, transaction]);
  }

  // =========================
  // DERIVED STREAMS
  // =========================

  incomeTotal$ = this.transactions$.pipe(
    map((list) => list.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)),
  );

  expensesTotal$ = this.transactions$.pipe(
    map((list) => list.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)),
  );

  balance$ = combineLatest([this.incomeTotal$, this.expensesTotal$]).pipe(
    map(([income, expenses]) => income - expenses),
  );

  // =========================
  // 🧠 OPTIONAL (TÄRKEÄ FIX SUN VIRHEISIIN)
  // =========================

  // 👉 helpottaa IncomeExpense + PieChart
  incomeTransactions$ = this.transactions$.pipe(
    map((list) => list.filter((t) => t.type === 'income')),
  );

  expenseTransactions$ = this.transactions$.pipe(
    map((list) => list.filter((t) => t.type === 'expense')),
  );

  // 👉 suora snapshot (jos joskus tarvitaan)
  getAll(): Transaction[] {
    return this.transactions.value;
  }
}
