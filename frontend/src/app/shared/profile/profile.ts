import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
})
export class Profile {

}
const logoutBtn = document.getElementById("logoutBtn");
const themeToggle = document.getElementById("themeToggle") as HTMLInputElement;

logoutBtn?.addEventListener("click", () => {
  // esim. tyhjennä tokenit
  localStorage.clear();
  window.location.href = "/login";
});

themeToggle?.addEventListener("change", () => {
  document.body.classList.toggle("dark-theme", themeToggle.checked);
});
