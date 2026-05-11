import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  // CloudFront ohjaa /api/transactions -> Beanstalkiin
  private apiUrl = '/api/transactions';
  private budgetUrl = '/api/budgets';

  // Välimuistimuuttujat
  private cachedTransactions: any = null;
  private cachedBudgets: any = null;

  constructor(private http: HttpClient) {}
  // Nämä toimii täydellisesti, EI tarvitse muokata
  // Käytetään asynkronista metodia, jotta komponentti voi odottaa vastausta
  async addTransaction(data: any) {
    try {
      const result = await firstValueFrom(this.http.post(this.apiUrl, data));
      this.cachedTransactions = null; //Tyhjennetään välimuisti lisäyksen jälkeen!
      return result;
    } catch (error) {
      console.error('Virhe tallennuksessa:', error);
      throw error;
    }
  }

  async getTransactions() {
    // Palautetaan heti välimuistista, jos data on jo olemassa
    if (this.cachedTransactions) {
      console.log('Palautettiin transaktiot välimuistista!');
      return this.cachedTransactions;
    }
    try {
      const data = await firstValueFrom(this.http.get(this.apiUrl));
      this.cachedTransactions = data; // Tallennetaan välimuistiin
      return data;
    } catch (error) {
      console.error('Virhe haussa:', error);
      throw error;
    }
  }
  async addBudget(data: any) {
    try {
      const result = await firstValueFrom(this.http.post(this.budgetUrl, data));
      this.cachedBudgets = null; //Tyhjennetään välimuisti lisäyksen jälkeen
      return result;
    } catch (error) {
      console.error('Virhe tallennuksessa:', error);
      throw error;
    }
  }
  async getBudgets() {
    if (this.cachedBudgets) {
      console.log('Palautettiin budjetit välimuistista!');
      return this.cachedBudgets;
    }
    try {
      const data = await firstValueFrom(this.http.get(this.budgetUrl));
      this.cachedBudgets = data;
      return data;
    } catch (error) {
      console.error('Virhe haussa:', error);
      throw error;
    }
  }
  async updateBudget(id: string, budgetData: any) {
    try {
      const result = await firstValueFrom(this.http.put(`${this.budgetUrl}/${id}`, budgetData));
      this.cachedBudgets = null; //Tyhjennetään välimuisti päivityksen jälkeen!
      return result;
    } catch (error) {
      console.error('Virhe päivityksessä:', error);
      throw error;
    }
  }
  async deleteTransaction(id: string) {
    try {
      const result = await firstValueFrom(this.http.delete(`${this.apiUrl}/${id}`));
      this.cachedTransactions = null; //Tyhjennetään välimuisti poistamisen jälkeen!
      return result;
    } catch (error) {
      console.error('Virhe poistaessa:', error);
      throw error;
    }
  }
}
