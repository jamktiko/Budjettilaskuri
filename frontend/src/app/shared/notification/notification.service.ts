import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { AppNotification } from './notification.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private STORAGE_KEY = 'notifications';

  private notificationsSubject = new BehaviorSubject<AppNotification[]>([]);

  notifications$ = this.notificationsSubject.asObservable();

  // 🔥 NEW: unread badge stream
  unreadCount$ = this.notifications$.pipe(map((list) => list.filter((n) => !n.read).length));

  // 🔥 NEW: latest notification (toast/snackbar)
  latest$ = this.notifications$.pipe(map((list) => list[0] ?? null));

  constructor() {
    this.loadFromLocalStorage();
  }

  add(message: string, type: AppNotification['type'] = 'warning'): void {
    const notification: AppNotification = {
      id: crypto.randomUUID(),
      message,
      type,
      createdAt: Date.now(),
      read: false,
    };

    this.notificationsSubject.next([notification, ...this.notificationsSubject.value]);

    this.saveToLocalStorage();
  }

  markAsRead(id: string): void {
    const updated = this.notificationsSubject.value.map((n) =>
      n.id === id ? { ...n, read: true } : n,
    );

    this.notificationsSubject.next(updated);

    this.saveToLocalStorage();
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

  // (voit pitää jos haluat imperatiivisen version)
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
