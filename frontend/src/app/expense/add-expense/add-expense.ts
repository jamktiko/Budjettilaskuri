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
})
export class AddExpense {
  type: 'income' | 'expense' = 'expense';
  category: string = '';
  amount: number = 0;
  note: string = '';
  loading: boolean = false; // Lisätään lataustila

  constructor(private budget: BudgetService) {}

  setType(type: 'income' | 'expense') {
    this.type = type;
  }

  async save() {
    if (this.amount <= 0 || !this.category) {
      alert('Täytä vähintään summa ja kategoria');
      return;
    }

    this.loading = true; // Estetään useat klikkaukset

    try {
      // Lähetetään vain backendin tarvitsemat tiedot
      await this.budget.addTransaction({
        type: this.type,
        amount: this.amount,
        category: this.category,
        note: this.note,
        date: new Date(), // Backend voi myös asettaa tämän automaattisesti
      });

      // Tyhjennetään lomake VAIN jos tallennus onnistui
      this.amount = 0;
      this.category = '';
      this.note = '';

      console.log('Tapahtuma lisätty onnistuneesti!');
    } catch (err) {
      alert('Tallennus epäonnistui. Tarkista nettiyhteys tai kirjaudu uudelleen sisään.');
    } finally {
      this.loading = false;
    }
  }
}
