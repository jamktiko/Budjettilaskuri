import { Injectable } from '@angular/core';
import { AuthUser, getCurrentUser, signOut, fetchAuthSession, AuthTokens } from 'aws-amplify/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private router: Router) {}

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
      await signOut();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Uloskirjautuminen epäonnistui', error);
    }
  }
}
