export interface AppNotification {
  id: string;

  message: string;

  type: 'warning' | 'info' | 'success' | 'error';

  createdAt: number;

  read: boolean;
}
