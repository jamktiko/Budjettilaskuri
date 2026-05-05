import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

// TÄMÄ on sun ainoa backend service
import { BudgetService } from '../budget.service';

@Component({
  selector: 'app-addbudget',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  templateUrl: './addbudget.html',
  styleUrls: ['./addbudget.css'],
})
export class AddBudget {
  private fb = inject(FormBuilder);
  private budgetService = inject(BudgetService);
  private snackBar = inject(MatSnackBar);

  categories = ['Ruoka', 'Auto', 'Vuokra', 'Viihde', 'Muu'];

  form = this.fb.group({
    category: ['', Validators.required],
    limit: [0, [Validators.required, Validators.min(1)]],
    period: ['monthly', Validators.required],
  });

  async onSubmit() {
    if (this.form.invalid) return;

    const budget = {
      id: crypto.randomUUID(),
      type: 'budget', // 🔥 tärkeä erotus backendille
      category: this.form.value.category,
      amount: this.form.value.limit, // backend ei tunne "limit"
      period: this.form.value.period,
      createdAt: new Date(),
    };

    try {
      await this.budgetService.addTransaction(budget);

      this.snackBar.open('Budget saved', 'OK', {
        duration: 2000,
      });

      this.form.reset({
        category: '',
        limit: 0,
        period: 'monthly',
      });
    } catch (err) {
      this.snackBar.open('Error saving budget', 'OK', {
        duration: 2000,
      });
    }
  }
}
