import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Alert } from '../models/alert.model';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private isVisibleSubject = new BehaviorSubject<boolean>(false);
  isVisible$: Observable<boolean> = this.isVisibleSubject.asObservable();

  private alertsSubject = new BehaviorSubject<Alert[]>([]);
  alerts$: Observable<Alert[]> = this.alertsSubject.asObservable();

  openModal(title: string, content: string, messageType: string): void {
    this.isVisibleSubject.next(true);
    const newAlert: Alert = { title, content, messageType, isVisible: true };
    this.alertsSubject.next([...this.alertsSubject.getValue(), newAlert]);
    this.closeAlertAfterDelay(newAlert);
  }

  closeModal(alert: Alert): void {
    this.isVisibleSubject.next(false);
    const currentAlerts = this.alertsSubject.getValue();
    const updatedAlerts = currentAlerts.filter(a => a !== alert);
    this.alertsSubject.next(updatedAlerts);
  }

  closeAlertAfterDelay(alert: Alert): void {
    setTimeout(() => {
      alert.isVisible = false;
      this.alertsSubject.next(this.alertsSubject.getValue().filter(a => a !== alert));
    }, 5000); 
  }
  
}
