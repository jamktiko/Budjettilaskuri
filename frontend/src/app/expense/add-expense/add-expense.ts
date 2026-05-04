import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { BudgetService } from '../../budget.service';

@Component({
  selector: 'app-add-expense',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './add-expense.html',
  styleUrls: ['./add-expense.css'],
})
export class AddExpense {
  type: 'income' | 'expense' = 'expense';
  category: string = '';
  amount: number = 0;
  note: string = '';

  constructor(private budget: BudgetService) {}

  setType(type: 'income' | 'expense') {
    this.type = type;
  }

  save() {
    this.budget.addTransaction({
      id: crypto.randomUUID(),
      type: this.type,
      amount: this.amount,
      category: this.category,
      date: new Date(),
      note: this.note,
    });

    // reset
    this.amount = 0;
    this.category = '';
    this.note = '';
  }
}
