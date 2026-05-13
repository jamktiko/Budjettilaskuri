import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
} from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { BudgetService } from '../../budget.service';
import { MatSelectModule } from '@angular/material/select';

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
    MatAutocompleteModule,
    MatOptionModule,
    MatSelectModule,
  ],
  templateUrl: './add-expense.html',
  styleUrls: ['./add-expense.css'],
})
export class AddExpense implements OnInit {
  type: 'income' | 'expense' = 'expense';
  defaultCategories: string[] = [
    'Ruoka',
    'Asuminen',
    'Auto',
    'Viihde',
    'Terveys',
    'Vaatteet',
    'Harrastukset',
    'Muu',
  ];
  category: string = '';
  amount: number | null = null;
  note: string = '';

  // budjetti variable
  isBudgetEmpty: boolean = true;

  constructor(
    private budget: BudgetService,
    private router: Router,
  ) {}

  checkIfBudgetExists() {
    this.budget.getBudgets().then((budgets) => {
      // Haetaan nykyinen kuukausi ja vuosi
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      //Tarkistetaan löytyykö listasta yhtään budjettia tälle kuukaudelle ja vuodelle
      const hasBudgetForThisMonth = budgets.some((b: any) => {
        const budgetDate = new Date(b.date);

        return budgetDate.getMonth() === currentMonth && budgetDate.getFullYear() === currentYear;
      });

      // Jos tälle kuulle löytyi budjetti, isBudgetEmpty on false. Muuten se on true.
      this.isBudgetEmpty = !hasBudgetForThisMonth;
    });
  }

  setType(type: 'income' | 'expense') {
    this.type = type;
  }

  async save() {
    // Estetään negatiivisen summan tallennus
    if (this.amount === null || this.amount <= 0) {
      console.warn('Summa ei voi olla negatiivinen');
      return;
    }

    // Varmistetaan, että kategoria on valittu
    if (!this.category) {
      console.warn('Valitse kategoria');
      return;
    }
    try {
      await this.budget.addTransaction({
        id: crypto.randomUUID(),
        type: this.type,
        amount: this.amount,
        category: this.category,
        date: new Date(),
        note: this.note,
      });
      // redirektataan homeen
      this.router.navigate(['/home']);

      // reset
      this.amount = null;
      this.category = '';
      this.note = '';
    } catch (error) {
      console.error('Virhe kulun lisäämisessä:', error);
    }
  }
  ngOnInit() {
    this.checkIfBudgetExists();
  }
}
