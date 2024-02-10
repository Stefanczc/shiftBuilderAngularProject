import { Component } from '@angular/core';
import { AuthService } from './shared/services/authentication.service';
import { BehaviorSubject, take } from 'rxjs';
import { ShiftService } from './shared/services/shift.service';
import { ShareDataService } from './shared/services/share-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'shiftBuilderApp';
  user: any;

  isLoggedIn = new BehaviorSubject<boolean>(false);

  constructor(
    private authService: AuthService,
    private shiftService: ShiftService,
    private shareDataService: ShareDataService
    ) { }

  ngOnInit(): void {
    this.shareDataService.userData$.subscribe(userData => {
      this.user = userData;
    });
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
