import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';

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
    MatDialogModule,
  ],
  templateUrl: './addbudget.html',
  styleUrls: ['./addbudget.css'],
})
export class AddBudget implements OnInit {
  // Toteutetaan OnInit
  private fb = inject(FormBuilder);
  private budgetService = inject(BudgetService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private dialogRef = inject(MatDialogRef<AddBudget>);

  isSubmitted = false;
  createdBudget: any = null;
  isEditing = false;
  currentBudgetId: string | null = null;
  loading = true; // Lisätään lataustila

  form = this.fb.group({
    category: ['Yleinen'],
    amount: [0, [Validators.required, Validators.min(1)]],
    time: ['monthly'],
  });

  async ngOnInit() {
    await this.checkExistingBudget();
  }

  async checkExistingBudget() {
    this.loading = true;
    try {
      const budgets = (await this.budgetService.getBudgets()) as any[];
      const now = new Date();

      // Etsitään budjetti, joka on luotu tässä kuussa
      const existing = budgets.find((b) => {
        const d = new Date(b.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      });

      if (existing) {
        this.createdBudget = existing;
        this.currentBudgetId = existing._id;
        this.isSubmitted = true; // Näytetään suoraan se "onnistumiskortti"
      }
    } catch (err) {
      console.error('Virhe tarkistuksessa', err);
    } finally {
      this.loading = false;
    }
  }

  startEdit(budget: any) {
    this.isEditing = true;
    this.isSubmitted = false;
    this.currentBudgetId = budget._id;

    this.form.patchValue({
      amount: budget.amount,
      category: budget.category || 'Yleinen',
      time: budget.time || 'monthly',
    });
  }

  async onSubmit() {
    if (this.form.invalid) return;
    const budgetData = this.form.value;

    try {
      if (this.isEditing && this.currentBudgetId) {
        const updated = await this.budgetService.updateBudget(this.currentBudgetId, budgetData);
        this.createdBudget = updated;
        this.snackBar.open('Budjetti päivitetty!', 'OK', { duration: 2000 });
      } else {
        const saved = await this.budgetService.addBudget(budgetData);
        this.createdBudget = saved;
        this.snackBar.open('Budjetti tallennettu!', 'OK', { duration: 3000 });
      }

      this.isSubmitted = true;
      this.isEditing = false;
      this.dialogRef.close(true);
    } catch (err: any) {
      this.snackBar.open(err.error?.message || 'Virhe tallennuksessa', 'OK', { duration: 5000 });
    }
  }
}
