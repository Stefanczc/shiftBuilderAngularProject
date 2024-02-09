import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/shared/models/user.model'; 
import { Shift } from 'src/app/shared/models/shift.model';
import { AuthService } from 'src/app/shared/services/authentication.service';
import { ShareDataService } from 'src/app/shared/services/share-data.service';
import { ShiftService } from 'src/app/shared/services/shift.service';

@Component({
  selector: 'app-bestworker',
  templateUrl: './bestworker.component.html',
  styleUrls: ['./bestworker.component.scss']
})
export class BestworkerComponent implements OnInit {

  users: User[] = [];
  user: any;
  userWithMostShifts: User | null = null;
  shifts: Shift[] = [];
  pastShifts: Shift[] = [];

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
        return { ...shift, userName: user ? `${user.firstname} ${user.lastname}` : 'Unknown User' };
      });
      this.pastShifts = await Promise.all(userDetailsPromises);
      this.users = await this.shareDateService.getAllUsers();
      this.calculateUserWithMostShifts();
    }
    catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  filterPastShifts(shifts: Shift[]): Shift[] {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    
    return shifts.filter((shift) => new Date(shift.shiftDate) >= sevenDaysAgo && new Date(shift.shiftDate) <= today);
  }

  calculateUserWithMostShifts() {
    const shiftCountByUser: { [key: string]: number } = {};

    this.pastShifts.forEach((shift) => {
      const userId = shift.uid;
      shiftCountByUser[userId] = (shiftCountByUser[userId] || 0) + 1;
    });
  
    const mostShiftsUserId = Object.keys(shiftCountByUser).reduce((a, b) => (shiftCountByUser[a] > shiftCountByUser[b] ? a : b), '');
  
    this.userWithMostShifts = this.users.find((user) => user.uid === mostShiftsUserId) || null;
  }

}
