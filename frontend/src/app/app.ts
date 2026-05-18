import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd, RouterLink, RouterLinkActive } from '@angular/router';

import { CommonModule } from '@angular/common';

import { filter, Subscription } from 'rxjs';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { MatTooltipModule } from '@angular/material/tooltip';

import { NotificationComponent } from './shared/notification/notification';
import { NotificationService } from './shared/notification/notification.service';

import { InfoDialogComponent } from './shared/info-dialog/info-dialog';

// 🔔 NOTIFICATION SETTINGS DIALOG
@Component({
  selector: 'notifications-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Ilmoitukset</h2>

    <mat-dialog-content>
      Haluatko saada ilmoituksen, kun 80 % budjetista on käytetty tai budjetti ylittyy?
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="false">Ei kiitos</button>

      <button mat-button [mat-dialog-close]="true" cdkFocusInitial>Kyllä</button>
    </mat-dialog-actions>
  `,
})
export class NotificationsDialogComponent {}

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
    MatSnackBarModule,
    MatTooltipModule,

    NotificationComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit, OnDestroy {
  showNav = false;

  isDark = false;

  notificationsEnabled = false;

  unreadCount = 0;

  private router = inject(Router);

  private dialog = inject(MatDialog);

  private snackBar = inject(MatSnackBar);

  private notificationService = inject(NotificationService);

  private subs = new Subscription();

  constructor() {
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe((e: any) => {
      const isLoginView = e.urlAfterRedirects.includes('/login');

      this.showNav = !isLoginView;

      if (isLoginView) {
        this.isDark = false;

        document.body.classList.remove('dark-theme');
      } else {
        const saved = localStorage.getItem('darkMode');

        this.isDark = saved === 'true';

        this.updateBodyTheme();
      }
    });
  }

  ngOnInit(): void {
    this.isDark = this.getBooleanStorage('darkMode');

    document.body.classList.toggle('dark-theme', this.isDark);

    this.notificationsEnabled = this.getBooleanStorage('notificationsEnabled');

    // 🔔 unread badge count
    this.subs.add(
      this.notificationService.unreadCount$.subscribe((count) => {
        this.unreadCount = count;
      }),
    );

    // 🍞 toast popup
    this.subs.add(
      this.notificationService.toast$.subscribe((notification) => {
        if (!notification) return;

        if (!this.notificationsEnabled) return;

        this.snackBar.open(notification.message, 'Sulje', {
          duration: 3000,
        });
      }),
    );

    // 🔄 sync localStorage between tabs
    window.addEventListener('storage', this.handleStorageChange);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();

    window.removeEventListener('storage', this.handleStorageChange);
  }

  // 🌙 DARK MODE
  toggleTheme(): void {
    this.isDark = !this.isDark;

    localStorage.setItem('darkMode', String(this.isDark));

    this.updateBodyTheme();
  }

  private updateBodyTheme(): void {
    document.body.classList.toggle('dark-theme', this.isDark);
  }

  // 🔔 notification settings dialog
  openNotificationsDialog(): void {
    const dialogRef = this.dialog.open(NotificationsDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (typeof result !== 'boolean') return;

      this.notificationsEnabled = result;

      localStorage.setItem('notificationsEnabled', String(result));
    });
  }

  // ℹ️ info/help dialog
  openInfoDialog(): void {
    this.dialog.open(InfoDialogComponent, {
      width: '500px',
      maxWidth: '95vw',
    });
  }

  // 💾 localStorage helper
  private getBooleanStorage(key: string): boolean {
    return localStorage.getItem(key) === 'true';
  }

  // 🔄 sync tabs
  private handleStorageChange = (): void => {
    this.isDark = this.getBooleanStorage('darkMode');

    this.notificationsEnabled = this.getBooleanStorage('notificationsEnabled');
  };
}
