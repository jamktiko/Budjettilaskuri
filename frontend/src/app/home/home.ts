import { Component } from '@angular/core';
import { AuthenticatorService } from '@aws-amplify/ui-angular';
import { Router } from '@angular/router';
import { BudgetService } from '../shared/budget.service';
import { CommonModule } from '@angular/common';
import { DataService } from '../data';

// 🔥 (valinnainen mutta hyvä tyyppien takia)
import { Observable } from 'rxjs';
import { Transaction } from '../models/transaction.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home {
  // ===== Backend test UI =====
  connectionStatus: string = 'Ei testattu';
  isLoading: boolean = false;
  isError: boolean = false;

  // ===== 🔥 REAKTIIVINEN BUDJETTIDATA =====
  transactions$: Observable<Transaction[]> = this.budget.transactions$;
  income$: Observable<number> = this.budget.income$;
  expenses$: Observable<number> = this.budget.expenses$;
  balance$: Observable<number> = this.budget.balance$;

  constructor(
    private dataService: DataService,
    public authenticator: AuthenticatorService,
    private router: Router,
    private budget: BudgetService, // 🔥 ei enää public (ei käytetä templaatissa suoraan)
  ) {}

  // ===== DB CONNECTION TEST =====
  testConnection() {
    this.isLoading = true;
    this.isError = false;
    this.connectionStatus = 'Yhdistetään...';

    this.dataService.testDbConnection().subscribe({
      next: (response) => {
        this.connectionStatus = response.message;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Yhteysvirhe:', err);
        this.connectionStatus = 'Virhe: ' + (err.error?.error || 'Palvelimeen ei saada yhteyttä');
        this.isError = true;
        this.isLoading = false;
      },
    });
  }

  // ===== AUTH =====
  handleSignOut() {
    this.authenticator.signOut();
    this.router.navigate(['/login']);
  }
}
