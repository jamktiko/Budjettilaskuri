import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { AppNotification } from './notification.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<AppNotification[]>([]);

  notifications$ = this.notificationsSubject.asObservable();

  add(message: string): void {
    const notification: AppNotification = {
      id: crypto.randomUUID(),
      message,
      type: 'warning',
      createdAt: new Date(),
      read: false,
    };

    this.notificationsSubject.next([notification, ...this.notificationsSubject.value]);
  }

  markAsRead(id: string): void {
    const updated = this.notificationsSubject.value.map((n) =>
      n.id === id ? { ...n, read: true } : n,
    );

    this.notificationsSubject.next(updated);
  }
}
