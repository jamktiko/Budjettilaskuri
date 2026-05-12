import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Subject } from 'rxjs'; // Lisää Subject
import { AppNotification } from './notification.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private STORAGE_KEY = 'notifications';
  private notificationsSubject = new BehaviorSubject<AppNotification[]>([]);

  notifications$ = this.notificationsSubject.asObservable();
  unreadCount$ = this.notifications$.pipe(map((list) => list.filter((n) => !n.read).length));

  // Poista latest$ ja luo tilalle uusi Subject pop-upeille
  private toastSubject = new Subject<AppNotification>();
  toast$ = this.toastSubject.asObservable();

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

    // Lähetetään tieto Snackbarille vain kun uusi ilmoitus OIKEASTI lisätään
    this.toastSubject.next(notification);
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
