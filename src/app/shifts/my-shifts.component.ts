import { Component, OnInit } from '@angular/core';
import { Shift } from '../shared/interfaces/shift.model';
import { ShiftService } from '../shared/services/shift.service';
import { AuthService } from '../shared/services/authentication.service'; 
import { take } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router'; 
import { ROUTE_ADMIN_HOMEPAGE, ROUTE_HOMEPAGE } from '../app-routing.module';
import { ShareDataService } from '../shared/services/share-data.service';
import { Location } from '@angular/common';
import { ModalService } from '../shared/services/modal.service';
import { LoadingService } from '../shared/services/loading.service';

@Component({
  selector: 'app-my-shifts',
  templateUrl: './my-shifts.component.html',
  styleUrls: ['./my-shifts.component.scss']
})
export class MyShiftsComponent implements OnInit {

  user: any;
  shifts: Shift[] = [];
  searchInput: string = '';
  startDate: string = '';
  endDate: string = '';
  uid: string = '';

  constructor(
    private shiftService: ShiftService,
    private router: Router,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private shareDataService: ShareDataService,
    private modalService: ModalService,
    private location: Location,
    private loadingService: LoadingService
  ) {
    this.shiftService.shifts$.subscribe(shifts => {
      this.shifts = shifts;
    });
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.uid = params['uid'];
      if (this.uid) {
        this.shareDataService.getUserByUid(this.uid)
          .then(user => {
            if (user) {
              this.user = user;
              this.shiftService.loadShifts(this.uid);
            } else {
              console.error('User not found for ID:', this.uid);
            }
          })
          .catch(error => {
            console.error('Error fetching user details:', error);
          });
      }
      else {
        this.authService.uidReady$.pipe(take(1)).subscribe(() => {
          const uid = this.authService.uid;
          if (uid) {
            this.shiftService.loadShifts(uid);
          } else {
            console.error('User UID not available.');
          }
        });
      }
    });
  }

  searchShifts() {
    this.shifts.forEach((shift) => {
      const shiftPlace = shift.shiftPlace.slice(0, 10).toLowerCase();
      const date = shift.shiftDate.toLowerCase();

      const matchesSearch = this.searchInput.length === 0 || shiftPlace.includes(this.searchInput);
      const matchesStartDate = this.startDate.length === 0 || date >= this.startDate;
      const isWithinRange = this.endDate.length === 0 || (date >= this.startDate && date <= this.endDate);

      if (matchesSearch && matchesStartDate && isWithinRange) {
        shift.isVisible = true;
      } else {
        shift.isVisible = false;
      }
    });
  }

  clearSearchInputs() {
    this.searchInput = '';
    this.startDate = '';
    this.endDate = '';
    this.searchShifts();
  }

  removeShift(shift: Shift ) {
    this.shiftService.deleteShift(shift.shiftId);
    this.loadingService.showForDuration(1000);
    this.modalService.openModal('Success', 'The Shift was successfully deleted!', 'success');
  }
  navigateToEditShift(shiftId: string) {
    this.router.navigate(['/shift', shiftId]);
  }
  navigateToHomepage() {
    const currentUrl = this.location.path();
    const isAdminPage = currentUrl.includes('my-shifts') && currentUrl.split('/').length > 2;
    const targetRoute = isAdminPage ? ROUTE_ADMIN_HOMEPAGE : ROUTE_HOMEPAGE;
    this.router.navigate([`/${targetRoute}`]);
  }

}
