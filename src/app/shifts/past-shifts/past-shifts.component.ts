import { Component, OnInit } from '@angular/core';
import { ShiftService } from 'src/app/shared/services/shift.service';
import { Shift } from 'src/app/shared/models/shift.model';

@Component({
  selector: 'app-past-shifts',
  templateUrl: './past-shifts.component.html',
  styleUrls: ['./past-shifts.component.scss']
})
export class PastShiftsComponent implements OnInit {
  pastShifts: Shift[] = [];

  constructor(private shiftService: ShiftService) { }
  
  ngOnInit(): void {
    this.loadPastShifts();
  }

  private loadPastShifts(): void {
    const today = new Date();
    const lastSunday = new Date(today);
    lastSunday.setDate(today.getDate() - (today.getDay() + 7) % 7); 

    const lastMonday = new Date(lastSunday);
    lastMonday.setDate(lastSunday.getDate() - 7); 
  
    this.shiftService.shifts$.subscribe((shifts) => {
      this.pastShifts = shifts.filter((shift) => new Date(shift.shiftDate) >= lastMonday && new Date(shift.shiftDate) <= lastSunday);
    });
  }
  
}
