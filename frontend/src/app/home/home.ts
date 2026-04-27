import { Component } from '@angular/core';
import { AuthenticatorService } from '@aws-amplify/ui-angular';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  constructor(
    public authenticator: AuthenticatorService,
    private router: Router,
  ) {}

  // Voit halutessasi tehdä oman metodin uloskirjautumiselle
  handleSignOut() {
    this.authenticator.signOut();
    this.router.navigate(['/login']); // Ohjataan takaisin kirjautumissivulle
  }
}
