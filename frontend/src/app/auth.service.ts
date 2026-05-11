import { Injectable } from '@angular/core';
import {
  AuthUser,
  getCurrentUser,
  signOut,
  fetchAuthSession,
  AuthTokens,
  fetchUserAttributes,
} from 'aws-amplify/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private cachedUserAttributes: any = null;
  constructor(private router: Router) {}

  async getUserAttributes() {
    if (this.cachedUserAttributes) {
      console.log('Palautettiin profiilitiedot välimuistista!');
      return this.cachedUserAttributes;
    }

    try {
      const attributes = await fetchUserAttributes();
      this.cachedUserAttributes = attributes; // Tallennetaan välimuistiin onnistuneen haun jälkeen
      return attributes;
    } catch (error) {
      console.error('Virhe haettaessa profiilitietoja:', error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<AuthUser> {
    return await getCurrentUser();
  }

  async getCurrentSession(): Promise<AuthTokens | undefined> {
    return (await fetchAuthSession()).tokens;
  }

  async getCurrentUserFullName(): Promise<string | undefined> {
    let cognitoToken = await (await fetchAuthSession()).tokens;
    return cognitoToken?.idToken?.payload['name']?.toString();
  }

  async getAccessToken(): Promise<string | undefined> {
    const session = await fetchAuthSession();
    return session.tokens?.accessToken.toString();
  }
  async getIdToken(): Promise<string | undefined> {
    const session = await fetchAuthSession();
    // idToken sisältää emailin ja nimen, accessToken ei
    return session.tokens?.idToken?.toString();
  }

  async signOut() {
    try {
      this.cachedUserAttributes = null;
      await signOut();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Uloskirjautuminen epäonnistui', error);
    }
  }
}
