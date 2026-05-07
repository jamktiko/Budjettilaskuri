export interface AppNotification {
  id: string;
  message: string;
  type: 'warning' | 'info' | 'success';
  createdAt: Date;
  read: boolean;
}
