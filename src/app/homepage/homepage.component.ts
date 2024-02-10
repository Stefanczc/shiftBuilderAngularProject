import { Component, OnInit } from '@angular/core';
import { Shift } from '../shared/interfaces/shift.model';
import { ShiftService } from '../shared/services/shift.service';
import { AuthService } from '../shared/services/authentication.service';
import { Router } from '@angular/router';
import { ShareDataService } from '../shared/services/share-data.service';
import { ROUTE_LOGIN, ROUTE_MYSHIFTS, ROUTE_PROFILE, ROUTE_SHIFTS } from '../app-routing.module';
import { filter } from 'rxjs';
import { LoadingService } from '../shared/services/loading.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements OnInit {
  
  user: any;
  shifts: Shift[] = [];
  searchInput: string = '';
  startDate: string = '';
  endDate: string = '';
  biggestAmountEarned?: number;
  biggestAmountEarnedMonth?: string;

  constructor(
    private shiftService: ShiftService,
    private router: Router,
    private authService: AuthService,
    private shareDataService: ShareDataService,
    private loadingService: LoadingService
  ) {
    this.shiftService.shifts$.subscribe((shifts) => {
      this.shifts = shifts;
    });
  }

  ngOnInit(): void {
    this.shareDataService.userData$
      .pipe(
        filter(user => !!user && !!user.uid)  
      )
      .subscribe((userValue) => {
        this.user = userValue;
        this.loadAllShifts(this.user.uid);
      });
  }
  
  async loadAllShifts(uid: string) {
    await this.shiftService.loadShifts(uid);
    this.bestShift();
  }

  bestShift(): void {
    const biggestAmount = this.shifts.reduce((max, shift) => Math.max(max, shift.shiftProfit), 0);
    this.biggestAmountEarned = biggestAmount;
    this.biggestAmountEarnedMonth = this.getMonthFromShifts();
    this.shiftService.updateBiggestAmountEarned(biggestAmount);
  }

  private getMonthFromShifts(): string {
    if (this.shifts.length === 0) {
      return 'No shifts available';
    }

    const monthsAndYears: string[] = [];
    const profits: number[] = [];

    this.shifts.forEach((shift) => {
      const myDate = new Date(shift.shiftDate);
      const monthAndYear = `${myDate.getFullYear()}-${myDate.getMonth()}`;
      const index = monthsAndYears.indexOf(monthAndYear);

      if (index === -1) {
        monthsAndYears.push(monthAndYear);
        profits.push(shift.shiftProfit);
      } else {
        profits[index] += shift.shiftProfit;
      }
    });

    const bestIndex = profits.indexOf(Math.max(...profits));
    const bestMonthAndYear = monthsAndYears[bestIndex];
    const [bestYear, bestMonth] = bestMonthAndYear.split('-');
    const monthName = this.getMonthName(parseInt(bestMonth));
    const bestProfit = profits[bestIndex];

    return `${monthName} ${bestYear}: ${bestProfit}$`;
  }

  private getMonthName(monthIndex: number): string {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthIndex];
  }

  removeShift(shift: Shift) {
    this.shiftService.deleteShift(shift.shiftId);
  }

  navigateToAddShift() {
    this.router.navigate([`/${ROUTE_SHIFTS}`]);
  }
  navigateToEditShift(shiftId: string) {
    this.router.navigate(['/shift', shiftId]);
  }
  navigateToProfilePage() {
    this.router.navigate([`/${ROUTE_PROFILE}`]);
  }
  navigateToMyShifts() {
    this.router.navigate([`/${ROUTE_MYSHIFTS}`]);
  }
  logout() {
    this.authService.logout();
    this.loadingService.showForDuration(1000);
    this.router.navigate([`${ROUTE_LOGIN}`]);
  }
}
