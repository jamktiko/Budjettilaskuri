import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { signIn } from 'aws-amplify/auth'; // <-- Tuodaan Amplifyn signIn-funktio

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  identifier = ''; // Muutettu email -> identifier
  password = '';

  constructor(private router: Router) {}

  // Muutettu async-funktioksi, koska verkkopyyntö vie aikaa
  async login() {
    try {
      // Lähetetään tiedot Cognitolle
      const { isSignedIn, nextStep } = await signIn({
        username: this.identifier, // Amplify käyttää termiä 'username', vaikka antaisit sähköpostin
        password: this.password,
      });

      if (isSignedIn) {
        console.log('Kirjautuminen onnistui Cognitosta!');
        // Siirtyy home-sivulle vasta kun Cognito on näyttänyt vihreää valoa
        this.router.navigate(['/home']);
      } else {
        // Tämä tapahtuu, jos Cognito vaatii esim. uuden salasanan asettamista
        console.log('Kirjautuminen vaatii lisäaskeleita:', nextStep);
      }
    } catch (error) {
      console.error('Virhe kirjautumisessa', error);
      // Yksinkertainen virheilmoitus käyttäjälle (voit myöhemmin vaihtaa esim. MatSnackBar-komponenttiin)
      alert('Väärä tunnus, sähköposti tai salasana!');
    }
  }
}
