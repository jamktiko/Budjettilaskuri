import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { AuthenticatorService } from '@aws-amplify/ui-angular';
//import { BudgetService1 } from '../shared/budget.service';
import { DataService } from '../data';

import { Summary } from './summary/summary';
import { IncomeExpense } from './income-expense/income-expense';
import { PieChart } from './pie-chart/pie-chart';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { BudgetService } from '../budget.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, Summary, IncomeExpense, PieChart],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home {
  // UI
  connectionStatus = 'Ei testattu';
  isLoading = false;
  isError = false;

  // DATA
  // income$;
  // expenses$;
  // balance$;
  //transactions$;

  // Tietokantaan liittyvää
  // Luodaan muuttuja transaktioille

  stats = {
    balance: 0,
    income: 0,
    expenses: 0,
  };

  transactions: any[] = [];
  loading: boolean = false;

  constructor(
    private dataService: DataService,
    public authenticator: AuthenticatorService,
    private router: Router,
    // private budget1: BudgetService1,
    private authservice: AuthService,
    private http: HttpClient,
    private budget: BudgetService,
  ) {
    // this.income$ = this.budget1.incomeTotal$;
    // this.expenses$ = this.budget1.expensesTotal$;
    // this.balance$ = this.budget1.balance$;
    // this.transactions$ = this.budget1.transactions$.pipe(
    //   map((list) =>
    //     list.map((t) => ({
    //       ...t,
    //       amount: Number(String(t.amount).replace('€', '').trim()),
    //     })),
    //   ),
    // );
  }

  async ngOnInit() {
    // 1. Haetaan token AuthServicestä
    const session = await this.authservice.getCurrentSession();
    const token = await this.authservice.getIdToken(); // Haetaan IdToken

    if (token) {
      // 2. Kutsutaan backendia, jotta se luo käyttäjän kantaan jos sitä ei ole
      // Tämä on se "sync"-vaihe!
      this.http
        .get('/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .subscribe({
          next: (user) => console.log('Käyttäjä synkronoitu tietokantaan:', user),
          error: (err) => console.error('Synkronointi epäonnistui:', err),
        });
    }
    this.getTransactions();
  }
  testaaYhteys() {
    this.http.get('/api/users/me').subscribe({
      next: (data) => console.log('Yhteys toimii ja token meni läpi!', data),
      error: (err) => console.error('Interceptor ei ehkä lisännytkään tokenia:', err),
    });
  }
  async getTransactions() {
    this.loading = true;
    try {
      // Kutsutaan palvelun metodia (Interceptor hoitaa tokenin automaattisesti)
      const data = (await this.budget.getTransactions()) as any[];
      this.transactions = data;

      // Lasketaan summat käyttäen 'type' -kenttää
      const totals = data.reduce(
        (acc, curr) => {
          if (curr.type === 'income') {
            acc.income += curr.amount;
          } else if (curr.type === 'expense') {
            acc.expenses += curr.amount;
          }
          return acc;
        },
        { income: 0, expenses: 0 },
      );

      // Päivitetään näkymään menevät tiedot
      this.stats = {
        income: totals.income,
        expenses: totals.expenses,
        balance: totals.income - totals.expenses,
      };
      console.log('Tapahtumat haettu:', this.transactions);
    } catch (err) {
      console.error('Tapahtumien haku epäonnistui:', err);
    } finally {
      this.loading = false;
    }
  }
}
