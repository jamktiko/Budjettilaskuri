import { Component } from '@angular/core';
import { AuthenticatorService } from '@aws-amplify/ui-angular';
import { Router } from '@angular/router';
import { BudgetService } from '../shared/budget.service';
import { CommonModule } from '@angular/common';
import { DataService } from '../data';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home {
  connectionStatus: string = 'Ei testattu';
  isLoading: boolean = false;
  isError: boolean = false;

  constructor(
    private dataService: DataService,
    public authenticator: AuthenticatorService,
    private router: Router,
    public budget: BudgetService,
  ) {}
  testConnection() {
    this.isLoading = true;
    this.isError = false;
    this.connectionStatus = 'Yhdistetään...';

    this.dataService.testDbConnection().subscribe({
      next: (response) => {
        this.connectionStatus = response.message; // "Yhteys MongoDB Atlakseen on kunnossa!"
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
  // Voit halutessasi tehdä oman metodin uloskirjautumiselle
  handleSignOut() {
    this.authenticator.signOut();
    this.router.navigate(['/login']); // Ohjataan takaisin kirjautumissivulle
  }
}
