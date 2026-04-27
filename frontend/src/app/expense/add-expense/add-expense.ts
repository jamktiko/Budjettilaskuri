import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BudgetService } from '../../shared/budget.service';

@Component({
  selector: 'app-add-expense',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-expense.html',
  styleUrls: ['./add-expense.css'],
})
export class AddExpense {
  category = '';
  amount: number | null = null;

  constructor(private budget: BudgetService) {}

  addExpense() {
    if (!this.category || !this.amount) return;

    this.budget.addExpense({
      category: this.category,
      amount: this.amount,
    });

    // tyhjennä kentät
    this.category = '';
    this.amount = null;
  }
}
