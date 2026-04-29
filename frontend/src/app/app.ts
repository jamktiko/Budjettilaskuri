import { Component } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';

@Component({
  selector: 'notifications-dialog',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Ilmoitukset</h2>
    <mat-dialog-content>
      Haluatko ottaa ilmoitukset päälle?
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button mat-dialog-close>Ei kiitos</button>
      <button mat-button mat-dialog-close cdkFocusInitial>Kyllä</button>
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
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  showNav = false;

  constructor(public router: Router, private dialog: MatDialog) {
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe((e: any) => {
      this.showNav = !e.urlAfterRedirects.startsWith('/login');
    });
  }

  openNotificationsDialog() {
    const dialogRef = this.dialog.open(NotificationsDialogComponent);
  }
}
