import { Component } from '@angular/core';
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
    MatAutocompleteTrigger,
  ],
  templateUrl: './add-expense.html',
  styleUrls: ['./add-expense.css'],
})
export class AddExpense {
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
  amount: number = 0;
  note: string = '';

  constructor(
    private budget: BudgetService,
    private router: Router,
  ) {}

  setType(type: 'income' | 'expense') {
    this.type = type;
  }

  onCategorySelected(
    event: MatAutocompleteSelectedEvent,
    inputElement: HTMLInputElement,
    trigger: MatAutocompleteTrigger,
  ) {
    if (event.option.value === 'Muu') {
      setTimeout(() => {
        this.category = ''; // Tyhjentää Angularin datan
        inputElement.value = ''; // Tyhjentää kentän visuaalisesti ruudulta

        trigger.closePanel(); // Pakottaa valikon kiinni
        inputElement.focus(); // Varmistaa, että kursori jää kenttään vilkkumaan
      });
    } else {
    }
  }

  save() {
    this.budget.addTransaction({
      id: crypto.randomUUID(),
      type: this.type,
      amount: this.amount,
      category: this.category,
      date: new Date(),
      note: this.note,
    });

    // reset
    this.amount = 0;
    this.category = '';
    this.note = '';

    // redirektataan homeen
    this.router.navigate(['/home']);
  }
}
