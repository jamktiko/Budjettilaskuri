import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd, RouterLink, RouterLinkActive } from '@angular/router';

import { CommonModule } from '@angular/common';
import { filter, Subscription } from 'rxjs';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { NotificationComponent } from './shared/notification/notification';
import { NotificationService } from './shared/notification/notification.service';

// 🔔 DIALOG
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
  private initialCheckDone = false;

  constructor() {
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe((e: any) => {
      // Käytetään .includes() varmuuden vuoksi, jotta kaikki /login-variaatiot tarttuvat
      const isLoginView = e.urlAfterRedirects.includes('/login');
      this.showNav = !isLoginView;

      if (isLoginView) {
        this.isDark = false;
        document.body.classList.remove('dark-theme');
      } else {
        const saved = localStorage.getItem('darkMode');
        this.isDark = saved === 'true';
        this.updateBodyTheme();

        // 2. TARKISTETAAN, ETTEI OLLA JUUressa ('/') JA ETTÄ TARKISTUS TEHDÄÄN VAIN KERRAN
        if (!this.initialCheckDone && e.urlAfterRedirects !== '/') {
          this.initialCheckDone = true; // Merkitään tarkistetuksi

          const notifSetting = localStorage.getItem('notificationsEnabled');
          if (notifSetting === null) {
            // Pieni viive varmistaa, että reititys on varmasti asettunut
            setTimeout(() => {
              if (this.dialog.openDialogs.length === 0) {
                this.openNotificationsDialog();
              }
            }, 300);
          }
        }
      }
    });
  }

  ngOnInit() {
    this.isDark = this.getBooleanStorage('darkMode');
    document.body.classList.toggle('dark-theme', this.isDark);

    this.notificationsEnabled = this.getBooleanStorage('notificationsEnabled');

    this.subs.add(
      this.notificationService.unreadCount$.subscribe((count) => {
        this.unreadCount = count;
      }),
    );

    this.subs.add(
      this.notificationService.toast$.subscribe((n) => {
        if (!n) return;
        if (!this.notificationsEnabled) return;

        this.snackBar.open(n.message, 'Sulje', {
          duration: 3000,
        });
      }),
    );

    window.addEventListener('storage', () => {
      this.isDark = this.getBooleanStorage('darkMode');
      this.notificationsEnabled = this.getBooleanStorage('notificationsEnabled');
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  toggleTheme() {
    this.isDark = !this.isDark;
    localStorage.setItem('darkMode', String(this.isDark));
    this.updateBodyTheme();
  }

  private updateBodyTheme() {
    document.body.classList.toggle('dark-theme', this.isDark);
  }

  openNotificationsDialog() {
    const dialogRef = this.dialog.open(NotificationsDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (typeof result !== 'boolean') return;

      this.notificationsEnabled = result;
      localStorage.setItem('notificationsEnabled', String(result));
    });
  }

  private getBooleanStorage(key: string): boolean {
    return localStorage.getItem(key) === 'true';
  }
}
