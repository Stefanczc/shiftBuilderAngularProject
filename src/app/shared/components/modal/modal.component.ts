import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { Alert } from '../../interfaces/alert.model';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  alerts: Alert[] = [];

  constructor(private modalService: ModalService) {}

  ngOnInit() {
    this.modalService.alerts$.subscribe(alerts => {
      this.alerts = alerts;
    });
  }

  closeAlert(alert: Alert): void {
    this.modalService.closeModal(alert);
  }
}
