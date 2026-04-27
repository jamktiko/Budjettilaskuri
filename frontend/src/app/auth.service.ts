import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment'; // Varmista polku

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // 1. Määritetään apiUrl (tämä puuttui koodistasi)

  // 2. Injektoidaan HttpClient constructorissa tai inject-funktiolla
  constructor(private http: HttpClient) {}

  testDatabase() {
    // Nyt 'this.http' on olemassa
    return this.http.get(`${this.apiUrl}/test-db`);
  }
}
