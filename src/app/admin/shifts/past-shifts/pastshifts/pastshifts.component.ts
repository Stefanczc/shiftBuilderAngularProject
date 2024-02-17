import { Component, OnInit } from '@angular/core';
import { Shift } from 'src/app/shared/interfaces/shift.model';
import { User } from 'src/app/shared/interfaces/user.model';
import { AuthService } from 'src/app/shared/services/authentication.service';
import { ShareDataService } from 'src/app/shared/services/user.service';
import { ShiftService } from 'src/app/shared/services/shift.service';

@Component({
  selector: 'app-pastshifts',
  templateUrl: './pastshifts.component.html',
  styleUrls: ['./pastshifts.component.scss']
})
export class PastshiftsComponent implements OnInit {

  shifts: Shift[] = [];
  users: User[] = [];
  userWithMostShifts: User | null = null;
  pastShifts: Shift[] = [];
  user: any;
  
  constructor(
    private authService: AuthService,
    private shiftService: ShiftService,
    private shareDateService: ShareDataService,
  ) { }

  ngOnInit(): void {
    this.authService.initAuth();
    this.shareDateService.userData$.subscribe(userData => {
      this.user = userData;
      this.loadData();
    });
  }

  async loadData() {
    try {
      this.shifts = await this.shiftService.getAllShifts();
      this.pastShifts = this.filterPastShifts(this.shifts);
      const userDetailsPromises = this.pastShifts.map(async (shift) => {
        const user = await this.shareDateService.getUserByUid(shift.uid);
        return { ...shift, userName: user ? `${user.firstname} ${user.lastname}` : 'Inactive User' };
      });
      this.pastShifts = await Promise.all(userDetailsPromises);
      this.users = await this.shareDateService.getAllUsers();
    }
    catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  
  filterPastShifts(shifts: Shift[]): Shift[] {
    const today = new Date();
    const lastSunday = new Date(today);
    lastSunday.setDate(today.getDate() - (today.getDay() + 7) % 7);

    const lastMonday = new Date(lastSunday);
    lastMonday.setDate(lastSunday.getDate() - 7); 
    
    return shifts.filter((shift) => new Date(shift.shiftDate) >= lastMonday && new Date(shift.shiftDate) <= lastSunday);
  }

}
