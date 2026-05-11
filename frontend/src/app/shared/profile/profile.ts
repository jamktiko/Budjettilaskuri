import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../auth.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatSlideToggleModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
})
export class Profile implements OnInit {
  private authService = inject(AuthService);

  name: string = '';
  email: string = '';
  userAttributes: any = null;
  error: string = '';
  isDark = false;

  ngOnInit() {
    const saved = localStorage.getItem('darkMode');
    this.isDark = saved === 'true';
    this.getUserData();
  }

logout() {
  // 🧹 UI reset
  document.body.classList.remove('dark-theme');
  localStorage.removeItem('darkMode');
  localStorage.removeItem('notificationsEnabled');

  // 🔐 sign out
  this.authService.signOut();
}

  toggleTheme() {
    this.isDark = !this.isDark;
    localStorage.setItem('darkMode', String(this.isDark));
    if (this.isDark) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }

    window.dispatchEvent(new Event('storage'));
  }

  async getUserData() {
    try {
      const attributes = await this.authService.getUserAttributes();
      this.userAttributes = attributes;
      this.name = attributes['name'] || '';
      this.email = attributes['email'] || '';
    } catch (err) {
      console.error('Virhe haettaessa käyttäjätietoja:', err);
      this.error = 'Käyttäjätietojen haku epäonnistui. Oletko kirjautunut sisään?';
    } finally {
      console.log('Käyttäjätiedot haettu');
    }
  }
}
