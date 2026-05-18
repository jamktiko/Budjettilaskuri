import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogRef, MatDialogModule, MatDialog } from '@angular/material/dialog';

// TÄMÄ on sun ainoa backend service
import { BudgetService } from '../budget.service';

import { NotificationsDialogComponent } from '../app';

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
  private dialog = inject(MatDialog);

  isSubmitted = false;
  createdBudget: any = null;
  isEditing = false;
  currentBudgetId: string | null = null;
  loading = true; // Lisätään lataustila

  form = this.fb.group({
    category: ['Yleinen'],
    amount: [null, [Validators.required, Validators.min(1)]],
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

      const existing = budgets.find((b) => {
        const d = new Date(b.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      });

      if (existing) {
        this.createdBudget = existing;
        this.currentBudgetId = existing._id;
        this.isSubmitted = true;
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
      // MUOKATAAN VANHAA
      if (this.isEditing && this.currentBudgetId) {
        await this.budgetService.updateBudget(this.currentBudgetId, budgetData);
        this.snackBar.open('Budjetti päivitetty!', 'OK', { duration: 2000 });
        this.dialogRef.close(true); // Suljetaan AddBudget-ikkuna heti
      }
      // LUODAAN UUSI
      else {
        await this.budgetService.addBudget(budgetData);
        this.snackBar.open('Budjetti tallennettu!', 'OK', { duration: 3000 });

        // Tarkistetaan, onko ilmoitusasetus jo tehty
        const notifSetting = localStorage.getItem('notificationsEnabled');

        if (notifSetting === null) {
          // Avataan ilmoitusten kyselydialogi
          const notifRef = this.dialog.open(NotificationsDialogComponent);

          notifRef.afterClosed().subscribe((result) => {
            if (typeof result === 'boolean') {
              localStorage.setItem('notificationsEnabled', String(result));
              // Laukaistaan storage-event manuaalisesti, jotta app.ts huomaa muutoksen heti
              window.dispatchEvent(new Event('storage'));
            }
            // Suljetaan AddBudget-ikkuna vasta kun kysymykseen on vastattu
            this.dialogRef.close(true);
          });
        } else {
          // Jos asetus oli jo olemassa, suljetaan ikkuna normaalisti
          this.dialogRef.close(true);
        }
      }
    } catch (err: any) {
      this.snackBar.open(err.error?.message || 'Virhe tallennuksessa', 'OK', { duration: 5000 });
    }
  }
}
