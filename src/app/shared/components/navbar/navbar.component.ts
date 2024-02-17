import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { ROUTE_ADMIN_ALLSHIFTS, ROUTE_ADMIN_ALLWORKERS, ROUTE_ADMIN_HOMEPAGE, ROUTE_HOMEPAGE, ROUTE_LOGIN, ROUTE_MYSHIFTS, ROUTE_PROFILE, ROUTE_SHIFTS } from '../../../app-routing.module';
import { AuthService } from '../../services/authentication.service';
import { ShareDataService } from '../../services/user.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  user: any;
  user$: Observable<any> = new Observable();
  isLoggedIn$!: BehaviorSubject<boolean>;
  isLoginPage: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private shareDataService: ShareDataService,
    private loadingService: LoadingService
  ) { }
  
  ngOnInit(): void {
    this.user$ = this.shareDataService.userData$;
    this.isLoggedIn$ = this.authService.isLoggedInSubject;

    const user = this.shareDataService.getUserData();

    this.router.events.pipe(
      filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.isLoginPage = event.url.includes(ROUTE_LOGIN);
    });

    this.shareDataService.userData$.subscribe(userData => {
      this.user = userData;
    });
  }

  showMobileMenu: boolean = false;

  toggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
  }
  
  navigateToMyShifts() {
    this.router.navigate([`/${ROUTE_MYSHIFTS}`]);
  }
  navigateToAddShift() {
    this.router.navigate([`/${ROUTE_SHIFTS}`]);
  }
  navigateToProfilePage() {
    this.router.navigate([`/${ROUTE_PROFILE}`]);
  }
  navigateToHomepage() {
    this.loadingService.showForDuration(1000);
    this.router.navigate([`/${ROUTE_HOMEPAGE}`]);
  }
  navigateToAllShifts() {
    this.router.navigate([`/${ROUTE_ADMIN_ALLSHIFTS}`]);
  }
  navigateToAllWorkers() {
    this.router.navigate([`/${ROUTE_ADMIN_ALLWORKERS}`]);
  }
  navigateToAdminHomepage() {
    this.loadingService.showForDuration(1000);
    this.router.navigate([`/${ROUTE_ADMIN_HOMEPAGE}`]);
  }
  
  logout() {
    this.authService.logout();
    this.loadingService.showForDuration(1000);
    this.router.navigate([`${ROUTE_LOGIN}`]);
  }

}
