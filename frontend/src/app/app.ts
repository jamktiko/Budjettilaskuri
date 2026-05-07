import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd, RouterLink, RouterLinkActive } from '@angular/router';

import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

// 🔔 Dialog component (OK pitää tässä tiedostossa)
@Component({
  selector: 'notifications-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Ilmoitukset</h2>

    <mat-dialog-content> Haluatko ottaa ilmoitukset päälle? </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Ei kiitos</button>
      <button mat-button mat-dialog-close cdkFocusInitial>Kyllä</button>
    </mat-dialog-actions>
  `,
})
export class NotificationsDialogComponent {}

// 🌙 APP COMPONENT
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  showNav = false;
  isDark = false;

  constructor(
    public router: Router,
    private dialog: MatDialog,
  ) {
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe((e: any) => {
      this.showNav = !e.urlAfterRedirects.startsWith('/login');
    });
  }

  ngOnInit() {
    const saved = localStorage.getItem('darkMode');
    this.isDark = saved === 'true';

    window.addEventListener('storage', () => {
      const updated = localStorage.getItem('darkMode');
      this.isDark = updated === 'true';
    });
  }

  // 🌙 theme toggle
  toggleTheme() {
    this.isDark = !this.isDark;
    localStorage.setItem('darkMode', String(this.isDark));
  }

  // 🔔 open dialog
  openNotificationsDialog() {
    this.dialog.open(NotificationsDialogComponent);
  }
}
