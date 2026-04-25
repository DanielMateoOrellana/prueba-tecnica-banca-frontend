import { Injectable, signal } from '@angular/core';

export interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly _notifications = signal<Notification[]>([]);
  readonly notifications = this._notifications.asReadonly();
  private nextId = 1;

  success(message: string) {
    this.push(message, 'success');
  }

  error(message: string) {
    this.push(message, 'error');
  }

  info(message: string) {
    this.push(message, 'info');
  }

  dismiss(id: number) {
    this._notifications.update(list => list.filter(n => n.id !== id));
  }

  private push(message: string, type: Notification['type']) {
    const id = this.nextId++;
    this._notifications.update(list => [...list, { id, message, type }]);
    setTimeout(() => this.dismiss(id), 5000);
  }
}
