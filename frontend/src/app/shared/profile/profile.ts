import { Component, inject } from '@angular/core';
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
export class Profile {
  private authService = inject(AuthService);
  logout() {
    this.authService.signOut();
  }
}
const themeToggle = document.getElementById('themeToggle') as HTMLInputElement;

themeToggle?.addEventListener('change', () => {
  document.body.classList.toggle('dark-theme', themeToggle.checked);
});
