import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { Transaction } from '../models/transaction.model';

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  // =========================
  // STATE
  // =========================
  private transactions = new BehaviorSubject<Transaction[]>([]);
  transactions$ = this.transactions.asObservable();

  // =========================
  // MUTATION
  // =========================
 addTransaction(transaction: Transaction) {
  let amount = Number(transaction.amount);

  if (transaction.type === 'expense') {
    amount = -Math.abs(amount);   // aina negatiivinen
  } else {
    amount = Math.abs(amount);    // aina positiivinen
  }

  const fixedTransaction = {
    ...transaction,
    amount
  };

  this.transactions.next([...this.transactions.value, fixedTransaction]);
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
  map(([income, expenses]) => income + expenses),
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
