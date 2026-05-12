import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Subject } from 'rxjs';
import { AppNotification } from './notification.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private STORAGE_KEY = 'notifications';

  private notificationsSubject = new BehaviorSubject<AppNotification[]>([]);

  notifications$ = this.notificationsSubject.asObservable();
  unreadCount$ = this.notifications$.pipe(map((list) => list.length));

  private toastSubject = new Subject<AppNotification>();
  toast$ = this.toastSubject.asObservable();

  constructor() {
    this.loadFromLocalStorage();
  }

  add(message: string, type: AppNotification['type'] = 'warning'): void {
    const now = Date.now();

    // 🔥 DUPLICATE GUARD (ESTÄ REFRESH + LOOP SPAM)
    const exists = this.notificationsSubject.value.some((n) => {
      return (
        n.message === message && n.type === type && now - n.createdAt < 60_000 // 1 minuutin ikkuna
      );
    });

    if (exists) return;

    const notification: AppNotification = {
      id: crypto.randomUUID(),
      message,
      type,
      createdAt: now,
      read: false,
    };

    this.notificationsSubject.next([notification, ...this.notificationsSubject.value]);

    this.saveToLocalStorage();

    // 🔔 toast only for real new event
    this.toastSubject.next(notification);
  }

  dismiss(id: string): void {
    const filtered = this.notificationsSubject.value.filter((n) => n.id !== id);

    this.notificationsSubject.next(filtered);
    this.saveToLocalStorage();
  }

  clearAll(): void {
    this.notificationsSubject.next([]);
    this.saveToLocalStorage();
  }

  getUnreadCount(): number {
    return this.notificationsSubject.value.filter((n) => !n.read).length;
  }

  private saveToLocalStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.notificationsSubject.value));
  }

  private loadFromLocalStorage(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);

    if (!stored) return;

    try {
      const notifications: AppNotification[] = JSON.parse(stored);

      this.notificationsSubject.next(notifications);
    } catch (error) {
      console.error('Failed to load notifications from localStorage', error);
    }
  }
}
