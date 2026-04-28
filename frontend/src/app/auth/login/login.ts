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
import { I18n } from 'aws-amplify/utils';
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
    // Määritellään suomenkieliset vastineet
    I18n.putVocabularies({
      fi: {
        'Sign In': 'Kirjaudu sisään',
        'Sign Up': 'Luo tunnus',
        Email: 'Sähköpostiosoite',
        Password: 'Salasana',
        'Forgot your password?': 'Unohditko salasanasi?',
        'Create Account': 'Luo uusi tili',
        'Confirm Password': 'Vahvista salasana',
        'Full Name': 'Koko nimi',
        'Signing in': 'Kirjaudutaan sisään...',
        'Creating Account': 'Luodaan tiliä...',
      },
    });

    I18n.setLanguage('fi');
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

  public formFields = {
    signIn: {
      username: {
        label: 'Sähköpostiosoite',
        placeholder: 'Syötä sähköpostisi',
        isRequired: true,
      },
      password: {
        label: 'Salasana',
        placeholder: 'Syötä salasana',
        isRequired: true,
      },
    },
    signUp: {
      name: {
        label: 'Koko nimi',
        placeholder: 'Esim. Matti Meikäläinen',
        isRequired: true,
        order: 1, // Järjestysnumero määrittää missä kohtaa kenttä näkyy
      },
      email: {
        label: 'Sähköpostiosoite',
        placeholder: 'matti@esimerkki.fi',
        order: 2,
      },
      password: {
        label: 'Salasana',
        placeholder: 'Vähintään 8 merkkiä',
        order: 3,
      },
      confirm_password: {
        label: 'Vahvista salasana',
        placeholder: 'Kirjoita salasana uudelleen',
        order: 4,
      },
    },
  };
}
