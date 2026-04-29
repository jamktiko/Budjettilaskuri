import { Injectable } from '@angular/core';
import { AuthUser, getCurrentUser, signOut, fetchAuthSession, AuthTokens } from 'aws-amplify/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

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

  signOut() {
    signOut();
  }
}
