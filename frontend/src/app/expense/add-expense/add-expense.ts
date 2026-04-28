import { Component } from '@angular/core';
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
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule],
  templateUrl: './add-expense.html',
  styleUrls: ['./add-expense.css'],
})
export class AddExpense {
  category = '';
  amount: number | null = null;

  constructor(private budget: BudgetService) {}

  addExpense() {
    if (!this.category || this.amount === null) return;

    this.budget.addExpense({
      category: this.category,
      amount: this.amount,
    });

    this.category = '';
    this.amount = null;
  }
}
