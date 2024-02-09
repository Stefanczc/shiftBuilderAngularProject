import { Component, OnInit } from '@angular/core';
import { Shift } from 'src/app/shared/models/shift.model';
import { ShiftService } from 'src/app/shared/services/shift.service';

@Component({
  selector: 'app-future-shifts',
  templateUrl: './future-shifts.component.html',
  styleUrls: ['./future-shifts.component.scss'],
})
export class FutureShiftsComponent implements OnInit {
  futureShifts: Shift[] = [];

  constructor(private shiftService: ShiftService) {}

  ngOnInit(): void {
    this.loadFutureShifts();
  }

  private loadFutureShifts(): void {
    const today = new Date();
    const nextMonday = new Date(today);
    const dayOfTheWeek = this.getDayName(nextMonday.getDay());
    nextMonday.setDate(today.getDate() + (7 - today.getDay())); 
    const nextSunday = new Date(nextMonday);
    nextSunday.setDate(nextMonday.getDate() + 7); 
    
    this.shiftService.shifts$.subscribe((shifts) => {
      this.futureShifts = shifts.filter((shift) => {
        const shiftDate = new Date(shift.shiftDate);
        return shiftDate >= nextMonday && shiftDate <= nextSunday;
      });
    });
  }
  
  private getDayName(dayIndex: number): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayIndex];
  }
  

}
