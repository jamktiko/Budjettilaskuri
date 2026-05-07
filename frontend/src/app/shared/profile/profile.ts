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

  isDark = false;

  ngOnInit() {
    const saved = localStorage.getItem('darkMode');
    this.isDark = saved === 'true';
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
}