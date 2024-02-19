import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Shift } from '../../shared/interfaces/shift.model';
import { ShiftService } from '../../shared/services/shift.service';
import { AuthService } from '../../shared/services/authentication.service';  
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ROUTE_ADMIN_ALLSHIFTS, ROUTE_MYSHIFTS } from '../../app-routing.module';
import { ShareDataService } from '../../shared/services/user.service';
import { ModalService } from 'src/app/shared/services/modal.service';
import { LoadingService } from 'src/app/shared/services/loading.service';

@Component({
  selector: 'app-shifts-update',
  templateUrl: './shifts-update.component.html',
  styleUrls: ['./shifts-update.component.scss']
})
export class ShiftsComponent implements OnInit {

  shiftForm: FormGroup;
  shifts: Shift[] = [];
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private shiftService: ShiftService,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private shareDataService: ShareDataService,
    private modalService: ModalService,
    private loadingService: LoadingService
  ) {
    this.shiftForm = this.fb.group({
      shiftDate: ['', Validators.required],
      shiftStartTime: ['', Validators.required],
      shiftEndTime: ['', Validators.required],
      shiftPrice: ['', Validators.required],
      shiftPlace: ['', Validators.required],
      shiftComment: [''],
      shiftId: [undefined],
      isVisible: true,
    });
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      const shiftId = params['id'];

      if (shiftId) {
        this.fetchShiftDetails(shiftId);
        this.isEditMode = true;
      }
    });
  }

  private async fetchShiftDetails(shiftId: string) {
    try {
      const shift = await this.shiftService.getShiftDetails(shiftId);
      if (shift) {
        this.shiftForm.patchValue(shift);
      }
    } catch (error) {
      console.error('Error fetching shift details:', error);
    }
  }

  onSubmit() {
    const newShift = this.shiftForm.value;
    const uid = this.authService.uid;
    newShift.shiftId = newShift.shiftId === undefined ? null : newShift.shiftId;
  
    if (uid) {
      const startDate = new Date(`${newShift.shiftDate}T${newShift.shiftStartTime}`);
      const endDate = new Date(`${newShift.shiftDate}T${newShift.shiftEndTime}`);
  
      if (endDate < startDate) {
        endDate.setDate(endDate.getDate() + 1);
      }
  
      const timeDifference = endDate.getTime() - startDate.getTime();
      const hoursWorked = timeDifference / (1000 * 60 * 60);
      const shiftProfit = parseFloat((hoursWorked * newShift.shiftPrice).toFixed(2));
  
      if (newShift.shiftId) {
        this.shiftService.editShift(newShift.shiftId, newShift, shiftProfit);
        this.shiftService.loadShifts(uid);
        this.loadingService.showForDuration(2000);
        this.modalService.openModal('Success', 'The Shift was successfully updated!', 'success');
      } else {
        this.shiftService.addShift(uid, newShift, shiftProfit);
        this.shiftService.loadShifts(uid);
        this.loadingService.showForDuration(2000);
        this.modalService.openModal('Success', 'The Shift was successfully added!', 'success');
      }
    } else {
      console.error("UID is not available");
    }
    this.navigateBack();
  }
  
  navigateBack() {
    const uid = this.authService.uid;
    if (uid) {
      this.shareDataService.getUserByUid(uid).then((user) => {
        if (user && user.email === 'admin@admin.ro') {
          this.router.navigate([`/${ROUTE_ADMIN_ALLSHIFTS}`]);
          this.shiftForm.reset();
        } else {
          this.router.navigate([`/${ROUTE_MYSHIFTS}`]);
          this.shiftForm.reset();
        }
      }).catch((error) => {
        console.error('Error fetching user by UID:', error);
      });
    } else {
      console.error('User UID not available.');
    }
  }
}
