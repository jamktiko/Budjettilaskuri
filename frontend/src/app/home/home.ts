import { Component } from '@angular/core';
import { AuthenticatorService } from '@aws-amplify/ui-angular';
import { Router } from '@angular/router';
import { BudgetService } from '../shared/budget.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home {
  constructor(
    public authenticator: AuthenticatorService,
    private router: Router,
    public budget: BudgetService,
  ) {}

  // Voit halutessasi tehdä oman metodin uloskirjautumiselle
  handleSignOut() {
    this.authenticator.signOut();
    this.router.navigate(['/login']); // Ohjataan takaisin kirjautumissivulle
  }
}
