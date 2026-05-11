import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationService } from './notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.html',
  styleUrls: ['./notification.css'],
})
export class NotificationComponent {
  private notificationService = inject(NotificationService);

  notifications$ = this.notificationService.notifications$;

  markAsRead(id: string) {
    this.notificationService.markAsRead(id);
  }

  dismiss(id: string) {
    this.notificationService.dismiss(id);
  }
}
