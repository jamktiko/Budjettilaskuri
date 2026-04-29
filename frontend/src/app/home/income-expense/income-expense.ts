import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Transaction } from '../../models/transaction.model';

@Component({
  selector: 'app-income-expense',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './income-expense.html',
})
export class IncomeExpense {
  @Input() transactions: Transaction[] | null = [];
}
