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

  isSubmitted = false;
  createdBudget: any = null;
  isEditing = false;
  currentBudgetId: string | null = null;

  startEdit(budget: any) {
    this.isEditing = true;
    this.isSubmitted = false;
    this.currentBudgetId = budget._id; // Backendin antama ID

    // Täytetään lomake vanhoilla tiedoilla
    this.form.patchValue({
      amount: budget.amount,
    });
  }

  //categories = ['Ruoka', 'Auto', 'Vuokra', 'Viihde', 'Muu'];

  // Jaksojen on vastattava Mongoon määriteltyä enumia ('monthly', 'weekly')
  // periods = [
  //   { value: 'monthly', viewValue: 'Kuukausi' },
  //   { value: 'weekly', viewValue: 'Viikko' },
  // ];

  form = this.fb.group({
    amount: [0, [Validators.required, Validators.min(1)]],
  });

  async onSubmit() {
    if (this.form.invalid) return;

    // Käytetään suoraan lomakkeen arvoja
    const budgetData = this.form.value;

    try {
      if (this.isEditing && this.currentBudgetId) {
        // 1. MUOKKAUS
        const updated = await this.budgetService.updateBudget(this.currentBudgetId, budgetData);
        this.createdBudget = updated; // Tallennetaan backendin palauttama päivitetty data
        this.snackBar.open('Budjetti päivitetty!', 'OK', { duration: 2000 });
      } else {
        // 2. UUSI TALLENNUS
        const saved = await this.budgetService.addBudget(budgetData);
        this.createdBudget = saved; // Tallennetaan backendin palauttama uusi data (sisältää ID:n)
        this.snackBar.open('Budjetti tallennettu!', 'OK', { duration: 3000 });
      }

      // Asetetaan näkymä onnistuneeksi (lomake katoaa, yhteenveto tulee näkyviin)
      this.isSubmitted = true;
      this.isEditing = false;

      // HUOM: Jos haluat että käyttäjä näkee yhteenvedon, ÄLÄ navigoi heti kotiin.
      // Navigointi kannattaa tehdä vasta "Palaa Dashboardille" -napista HTML-puolella.
      // this.router.navigate(['/home']);
    } catch (err: any) {
      // Haetaan virheviesti backendiltä tai käytetään oletusta
      const errorMsg = err.error?.error || err.error?.message || 'Toiminto epäonnistui';
      this.snackBar.open(errorMsg, 'OK', { duration: 5000 });
      console.error('Tallennusvirhe:', err);
    }
  }
}
