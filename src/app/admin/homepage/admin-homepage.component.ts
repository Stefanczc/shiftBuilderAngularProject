import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/authentication.service';
import { Router } from '@angular/router';
import { ROUTE_ADMIN_ALLSHIFTS, ROUTE_ADMIN_ALLWORKERS, ROUTE_LOGIN } from '../../app-routing.module';
import { LoadingService } from 'src/app/shared/services/loading.service';

@Component({
  selector: 'app-admin-homepage',
  templateUrl: './admin-homepage.component.html',
  styleUrls: ['./admin-homepage.component.scss']
})
export class AdminHomepageComponent implements OnInit {


  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingService: LoadingService
  ) { }

  ngOnInit() { }

  navigateToAllShifts() {
    this.router.navigate([`/${ROUTE_ADMIN_ALLSHIFTS}`]);
  }
  
  navigateToAllWorkers() {
    this.router.navigate([`/${ROUTE_ADMIN_ALLWORKERS}`]);
  }

  logout() {
    this.authService.logout();
    this.loadingService.showForDuration(1000);
    this.router.navigate([`${ROUTE_LOGIN}`]);
  }
}
