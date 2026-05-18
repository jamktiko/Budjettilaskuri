import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { signIn } from 'aws-amplify/auth'; // <-- Tuodaan Amplifyn signIn-funktio
import { AmplifyAuthenticatorModule, AuthenticatorService } from '@aws-amplify/ui-angular';
import { OnInit } from '@angular/core';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Subscription } from 'rxjs';
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
  private authSubscription?: any;
  constructor(
    public authenticator: AuthenticatorService,
    private router: Router,
  ) {}
  ngOnInit() {
    // Määritellään suomenkieliset vastineet
    I18n.putVocabularies({
      fi: {
        'Sign in': 'Kirjaudu sisään',
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

        'Password must have at least 8 characters': 'Salasanassa täytyy olla vähintään 8 merkkiä',

        'Your passwords must match': 'Salasanojen täytyy täsmätä',

        'Incorrect username or password.': 'Virheellinen sähköposti tai salasana',

        'Incorrect username or password': 'Virheellinen sähköposti tai salasana',

        'Password did not conform with policy: Password must have lowercase characters': 'Salasanassa täytyy olla vähintään yksi pieni kirjain',

        'Password did not conform with policy: Password must have uppercase characters': 'Salasanassa täytyy olla vähintään yksi iso kirjain',

        'Password did not conform with policy: Password must have numeric characters': 'Salasanassa täytyy olla vähintään yksi numero',

        'Password did not conform with policy: Password must have symbol characters': 'Salasanassa täytyy olla vähintään yksi erikoismerkki',

        'User already exists': 'Tällä sähköpostiosoitteella on jo tili. Kirjaudu sisään tai palauta salasana',

        // --- SALASANAN PALAUTUS (Forgot Password) ---
        'Reset your password': 'Palauta salasanasi',
        'Send code': 'Lähetä vahvistuskoodi',
        'Send Code': 'Lähetä vahvistuskoodi',
        'Back to Sign In': 'Takaisin kirjautumiseen',
        'Reset Password': 'Palauta salasana',
        'Confirmation Code': 'Vahvistuskoodi',
        'New password': 'Uusi salasana',
        Submit: 'Vahvista',
        'Enter your email': 'Syötä sähköpostiosoitteesi',
        // Yleisimmät virheilmoitukset salasanan palautuksessa
        'Code mismatch and limit exceeded':
          'Koodi on virheellinen ja yritysten enimmäismäärä on ylitetty',
        'Invalid verification code provided, please try again.':
          'Vahvistuskoodi on virheellinen, yritä uudelleen.',
        LimitExceededException: 'Liian monta yritystä, yritä myöhemmin uudelleen.',
        UserNotFoundException: 'Käyttäjää ei löytynyt tällä sähköpostiosoitteella.',
    
        'Cannot reset password for the user as there is no registered/verified email or phone_number': 'Salasanaa ei voi palauttaa, koska sähköposti tai puhelinnumero ei ole vahvistettu',


  'We Emailed You': 'Tarkista sähköpostisi',
  'Your code is on the way. To log in, enter the code we emailed to':
    'Lähetimme sinulle vahvistuskoodin sähköpostiin.',
  'It may take a minute to arrive.': 'Viestin saapumisessa voi kestää hetki.',
'It may take a minute to arrive': 'Viestin saapuminen voi kestää hetken',

  'Enter your code': 'Syötä vahvistuskoodi',

  'Confirm': 'Vahvista',

       'Code': 'Vahvistuskoodi',
       'Code *': 'Vahvistuskoodi',
       'New Password': 'Uusi salasana',
       'Resend Code': 'Lähetä koodi uudelleen',
       'Attempt limit exceeded, please try after some time.': 'Yritysten enimmäismäärä ylitetty. Yritä myöhemmin uudelleen',
      },
    });

    I18n.setLanguage('fi');
    this.authSubscription = this.authenticator.subscribe((data) => {
      if (data.authStatus === 'authenticated') {
        console.log('Käyttäjä on jo sisällä, ohjataan kotiin...');
        this.router.navigate(['/home']);
      }
    });
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
        label: 'Käyttäjänimi',
        placeholder: 'Kirjoita käyttäjänimesi',
        isRequired: true,
        order: 1, // Järjestysnumero määrittää missä kohtaa kenttä näkyy
      },
      email: {
        label: 'Sähköpostiosoite',
        placeholder: 'matti@esimerkki.fi',
        order: 2,
      },
      password: {
        label: 'Salasana (min. 8 merkkiä, iso ja pieni kirjain, numero ja erikoismerkki)',
        placeholder: 'Kirjoita salasana',
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
