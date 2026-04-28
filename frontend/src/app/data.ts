import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DataService {
  constructor(private http: HttpClient) {}

  testDbConnection(): Observable<any> {
    // Koska CloudFront ohjaa /api/* -> Beanstalkiin,
    // voimme kutsua suoraan tätä polkua.
    return this.http.get('/api/test-db');
  }
}
