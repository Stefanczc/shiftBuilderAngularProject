import { Component } from '@angular/core';
import { AuthService } from './shared/services/authentication.service';
import { BehaviorSubject, take } from 'rxjs';
import { ShiftService } from './shared/services/shift.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'shiftBuilderApp';

  isLoggedIn = new BehaviorSubject<boolean>(false);

  constructor(
    private authService: AuthService,
    private shiftService: ShiftService
    ) { }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedInSubject;
    this.authService.uidReady$.pipe(take(1)).subscribe(() => {
      const uid = this.authService.uid;
      if (uid) {
        this.shiftService.loadShifts(uid);
      } else {
        console.error('User UID not available.');
      }
    });
  }


}
