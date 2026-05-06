import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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
  private router = inject(Router);

  categories = ['Ruoka', 'Auto', 'Vuokra', 'Viihde', 'Muu'];

  // Jaksojen on vastattava Mongoon määriteltyä enumia ('monthly', 'weekly')
  periods = [
    { value: 'monthly', viewValue: 'Kuukausi' },
    { value: 'weekly', viewValue: 'Viikko' },
  ];

  form = this.fb.group({
    category: ['', Validators.required],
    amount: [0, [Validators.required, Validators.min(1)]],
    time: ['monthly', Validators.required],
  });

  async onSubmit() {
    if (this.form.invalid) return;

    // Luodaan objekti joka vastaa tismalleen backendin Mongoose-mallia
    const budgetData = {
      category: this.form.value.category,
      amount: this.form.value.amount,
      time: this.form.value.time,
    };

    try {
      await this.budgetService.addBudget(this.form.value);
      this.snackBar.open('Budjetti tallennettu!', 'OK', { duration: 3000 });
      this.router.navigate(['/home']);
    } catch (err: any) {
      const errorMsg = err.error?.error || 'Virhe tallennuksessa';
      this.snackBar.open(errorMsg, 'OK', { duration: 5000 });
    }
  }
}
