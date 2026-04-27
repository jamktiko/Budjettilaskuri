import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { signUp, confirmSignUp } from 'aws-amplify/auth'; // Tuodaan uudet funktiot
import { CommonModule } from '@angular/common'; // Tarvitaan *ngIf:ää varten

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.css'], // Voit kopioida tyylit suoraan login.css:stä
})
export class Register {
  username = '';
  email = '';
  password = '';
  confirmationCode = '';

  // Tällä ohjataan, kumpaa lomaketta näytetään
  isConfirming = false;

  constructor(private router: Router) {}

  // VAIHE 1: Käyttäjän luonti
  async register() {
    try {
      const { isSignUpComplete, nextStep } = await signUp({
        username: this.username,
        password: this.password,
        options: {
          userAttributes: {
            email: this.email, // Lähetetään sähköposti Cognitoon attribuuttina
          },
        },
      });

      console.log('Rekisteröityminen aloitettu:', nextStep);
      // Vaihdetaan näkymä vahvistuskoodin kysymiseen
      this.isConfirming = true;
    } catch (error) {
      console.error('Virhe rekisteröitymisessä', error);
      alert('Rekisteröityminen epäonnistui. Tarkista tiedot ja yritä uudelleen.');
    }
  }

  // VAIHE 2: Sähköpostin vahvistus koodilla
  async confirm() {
    try {
      const { isSignUpComplete, nextStep } = await confirmSignUp({
        username: this.username,
        confirmationCode: this.confirmationCode,
      });

      if (isSignUpComplete) {
        console.log('Tili vahvistettu!');
        alert('Tili luotu onnistuneesti! Voit nyt kirjautua sisään.');
        // Ohjataan käyttäjä takaisin kirjautumissivulle
        this.router.navigate(['/login']);
      }
    } catch (error) {
      console.error('Virhe vahvistuksessa', error);
      alert('Väärä vahvistuskoodi!');
    }
  }
}
