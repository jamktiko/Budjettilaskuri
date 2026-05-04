import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  // CloudFront ohjaa /api/transactions -> Beanstalkiin
  private apiUrl = '/api/transactions';

  constructor(private http: HttpClient) {}

  // Käytetään asynkronista metodia, jotta komponentti voi odottaa vastausta
  async addTransaction(data: any) {
    try {
      return await firstValueFrom(this.http.post(this.apiUrl, data));
    } catch (error) {
      console.error('Virhe tallennuksessa:', error);
      throw error;
    }
  }

  async getTransactions() {
    try {
      return await firstValueFrom(this.http.get(this.apiUrl));
    } catch (error) {
      console.error('Virhe haussa:', error);
      throw error;
    }
  }
}
