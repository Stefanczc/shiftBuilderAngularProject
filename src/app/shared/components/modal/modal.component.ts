import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { Observable } from 'rxjs';
import { Alert } from '../../interfaces/alert.model'; 

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  isVisible$: Observable<boolean> = this.modalService.isVisible$;
  alerts$!: Observable<Alert[]>; 

  constructor(private modalService: ModalService) {}

  ngOnInit() {
    this.alerts$ = this.modalService.alerts$;
  }

  closeAlert(alert: Alert): void {
    this.modalService.closeModal(alert);
  }
  
}
