import { Component, OnInit } from '@angular/core';
import { User } from '../../shared/interfaces/user.model';
import { ShareDataService } from '../../shared/services/user.service';
import { Router } from '@angular/router';
import { ROUTE_ADMIN_HOMEPAGE } from '../../app-routing.module';

@Component({
  selector: 'app-admin-all-workers',
  templateUrl: './admin-all-workers.component.html',
  styleUrls: ['./admin-all-workers.component.scss']
})
export class AdminAllWorkersComponent implements OnInit {

  users: User[] = [];

  constructor(
    private shareDataService: ShareDataService,
    private router: Router
  ) { 
    this.shareDataService.users$.subscribe(users => {
      this.users = users;
    })
  }
  
  ngOnInit(): void {
    this.displayAllUsers();
  }

  async displayAllUsers() {
    try {
      this.users = await this.shareDataService.getAllUsers();
    } catch (error) {
      console.error('Error fetching all users:', error);
    }
  }

  navigateToAdminHomepage() {
    this.router.navigate([`/${ROUTE_ADMIN_HOMEPAGE}`]);
  }
  navigateToEditUser(uid: string) {
    this.router.navigate(['/admin', uid]);
  }

}
