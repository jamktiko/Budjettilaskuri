import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BudgetService } from '../../shared/budget.service';

// Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-add-expense',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './add-expense.html',
  styleUrls: ['./add-expense.css'],
})
export class AddExpense {
  type: 'income' | 'expense' = 'expense';

  category = '';
  source = '';
  amount: number | null = null;

  constructor(private budget: BudgetService) {}

  setType(type: 'income' | 'expense') {
    this.type = type;
  }

  save() {
    if (this.amount === null) return;

    if (this.type === 'income') {
      this.budget.addIncome({
        source: this.source || 'Muu',
        amount: this.amount,
      });
    } else {
      this.budget.addExpense({
        category: this.category || 'Muu',
        amount: this.amount,
      });
    }

    // reset
    this.category = '';
    this.source = '';
    this.amount = null;
  }
}
