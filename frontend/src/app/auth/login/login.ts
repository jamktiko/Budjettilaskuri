import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { signIn } from 'aws-amplify/auth'; // <-- Tuodaan Amplifyn signIn-funktio
import { AmplifyAuthenticatorModule, AuthenticatorService } from '@aws-amplify/ui-angular';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    AmplifyAuthenticatorModule,
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  identifier = ''; // Muutettu email -> identifier
  password = '';
  private authSubscription?: any;

  constructor(
    public authenticator: AuthenticatorService, // <-- Injektoi AmplifyAuthenticator
    private router: Router,
  ) {}
  ngOnInit() {
    // Luodaan tilaus, joka kuuntelee kirjautumista
    this.authSubscription = this.authenticator.subscribe((data) => {
      if (data.authStatus === 'authenticated') {
        // Kun käyttäjä on tunnistettu, hypätään /home -sivulle
        this.router.navigate(['/home']);
      }
    });
  }

  ngOnDestroy() {
    // Muista perua tilaus, kun komponentti poistuu, jotta ei tule muistivuotoja
    this.authSubscription?.unsubscribe();
  }
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

  formFields = {
    signUp: {
      name: {
        order: 1,
      },
      email: {
        order: 2,
      },
      password: {
        order: 3,
      },
      confirm_password: {
        order: 4,
      },
    },
  };
}
