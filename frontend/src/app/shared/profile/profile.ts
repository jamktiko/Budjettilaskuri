import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
})
export class Profile implements OnInit {
  private authService = inject(AuthService);

  name: string = '';
  email: string = '';
  userAttributes: any = null; // Voit käyttää myös tyyppiä Record<string, string> jos haluat olla tarkempi
  error: string = '';
  isDark = false;

  ngOnInit() {
    const saved = localStorage.getItem('darkMode');
    this.isDark = saved === 'true';
    this.getUserData();
  }

  logout() {
    this.authService.signOut();
  }

  // 🌙 toggle theme
  toggleTheme(event: any) {
    this.isDark = event.target.checked;

    localStorage.setItem('darkMode', String(this.isDark));

    // kertoo App-komponentille muutoksesta
    window.dispatchEvent(new Event('storage'));
  }
  async getUserData() {
    try {
      const attributes = await this.authService.getUserAttributes();
      this.userAttributes = attributes;

      //this.name = attributes['name'] || attributes['preferred_username'] || '';
      this.name = attributes['name'] || '';
      this.email = attributes['email'] || '';
    } catch (err) {
      console.error('Virhe haettaessa käyttäjätietoja:', err);
      this.error = 'Käyttäjätietojen haku epäonnistui. Oletko kirjautunut sisään?';
    } finally {
      console.log('Käyttäjätiedot haettu:');
      {
      }
    }
  }
}
