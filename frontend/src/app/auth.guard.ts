import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticatorService } from '@aws-amplify/ui-angular';

export const authGuard = () => {
  const authService = inject(AuthenticatorService);
  const router = inject(Router);

  // Jos käyttäjä on kirjautunut, päästetään hänet läpi
  if (authService.authStatus === 'authenticated') {
    return true;
  }

  // Jos ei, heitetään hänet takaisin kirjautumissivulle
  console.log('Pääsy evätty, ohjataan kirjautumiseen...');
  return router.parseUrl('/login');
};
