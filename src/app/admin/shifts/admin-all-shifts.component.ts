import { Component, OnInit } from '@angular/core';
import { ShiftService } from '../../shared/services/shift.service';
import { Shift } from '../../shared/models/shift.model';
import { Router } from '@angular/router';
import { ROUTE_ADMIN_HOMEPAGE } from '../../app-routing.module';
import { ShareDataService } from '../../shared/services/share-data.service';
import { ModalService } from 'src/app/shared/services/modal.service';

@Component({
  selector: 'app-admin-all-shifts',
  templateUrl: './admin-all-shifts.component.html',
  styleUrls: ['./admin-all-shifts.component.scss']
})
export class AdminAllShiftsComponent implements OnInit {

  shifts: Shift[] = [];
  searchShiftInput: string = '';
  searchWorkerInput: string = '';
  startDate: string = '';
  endDate: string = '';
  constructor (
    private shiftService: ShiftService,
    private router: Router,
    private shareDataService: ShareDataService,
    private modalService: ModalService
  ) { }
  
  ngOnInit(): void {
    this.displayAllShifts();
  }

  async displayAllShifts() {
    try {
      this.shifts = await this.shiftService.getAllShifts();
      const userDetailsPromises = this.shifts.map(async (shift) => {
        const user = await this.shareDataService.getUserByUid(shift.uid);
        return { ...shift, userName: user ? `${user.firstname} ${user.lastname}` : 'Unknown User' };
      });
      const shiftsWithUserDetails = await Promise.all(userDetailsPromises);
      this.shifts = shiftsWithUserDetails;
    }
    catch (error) {
      console.error('Error fetching all shifts:', error);
    }
  }

  searchShifts() {
    this.shifts.forEach((shift) => {
      const shiftPlace = shift.shiftPlace.toLowerCase();
      const shiftWorker = shift.userName.toLowerCase();  
      const date = shift.shiftDate.toLowerCase();
      
      const matchesWorker = this.searchWorkerInput.length === 0 || shiftWorker.includes(this.searchWorkerInput);
      const matchesShift = this.searchShiftInput.length === 0 || shiftPlace.includes(this.searchShiftInput);
      const matchesStartDate = this.startDate.length === 0 || date >= this.startDate;
      const isWithinRange = this.endDate.length === 0 || (date >= this.startDate && date <= this.endDate);
  
      shift.isVisible = matchesWorker && matchesShift && matchesStartDate && isWithinRange;
    });
  }
  
  async removeShift(shift: Shift) {
    try {
      await this.shiftService.deleteShift(shift.shiftId);
      this.modalService.openModal('Success', 'The Shift was successfully deleted!', 'success');
    } catch (error) {
      console.error('Error deleting shift:', error);
    }
    this.displayAllShifts();
  }

  navigateToAdminHomepage() {
    this.router.navigate([`/${ROUTE_ADMIN_HOMEPAGE}`]);
  }
  navigateToEditShift(shiftId: string) {
    this.router.navigate(['/shift', shiftId]);
  }

}
