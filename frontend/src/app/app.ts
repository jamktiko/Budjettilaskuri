import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd, RouterLink, RouterLinkActive } from '@angular/router';

import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

// 🔔 NOTIFICATIONS DIALOG
@Component({
  selector: 'notifications-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Ilmoitukset</h2>

    <mat-dialog-content> Haluatko ottaa ilmoitukset käyttöön? </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="false">Ei kiitos</button>

      <button mat-button [mat-dialog-close]="true" cdkFocusInitial>Kyllä</button>
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

  // 👉 uusi: notifications state
  notificationsEnabled = false;

  constructor(
    public router: Router,
    private dialog: MatDialog,
  ) {
   this.router.events.pipe(filter(e => e instanceof NavigationEnd))
  .subscribe((e: any) => {
    this.showNav = !e.urlAfterRedirects.startsWith('/login');

    if (e.urlAfterRedirects.startsWith('/login')) {
      this.isDark = false;
      document.body.classList.remove('dark-theme');
    }
  });

  }

  ngOnInit() {
    // dark mode
    const saved = localStorage.getItem('darkMode');
    this.isDark = saved === 'true';
    document.body.classList.toggle('dark-theme', this.isDark);

    this.updateBodyTheme();

    // notifications state
    this.notificationsEnabled = localStorage.getItem('notificationsEnabled') === 'true';

    // sync changes from other tabs
    window.addEventListener('storage', () => {
      const updatedDark = localStorage.getItem('darkMode');
      this.isDark = updatedDark === 'true';

      const updatedNotif = localStorage.getItem('notificationsEnabled');
      this.notificationsEnabled = updatedNotif === 'true';
    });
  }

  // 🌙 theme toggle
  toggleTheme() {
    this.isDark = !this.isDark;
    localStorage.setItem('darkMode', String(this.isDark));

    this.updateBodyTheme();
  }

  private updateBodyTheme() {
    if (this.isDark) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }

  // 🔔 open dialog (CORRECT VERSION)
  openNotificationsDialog() {
    const dialogRef = this.dialog.open(NotificationsDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      this.notificationsEnabled = result;

      localStorage.setItem('notificationsEnabled', String(result));

      console.log('Notifications enabled:', result);
    });
  }
}
