import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HomepageComponent } from './homepage/homepage.component';
import { ShiftsComponent } from './shifts/edit-shift/shifts-update.component';
import { ProfileComponent } from './profile/profile.component';
import { MyShiftsComponent } from './shifts/my-shifts.component';
import { AdminHomepageComponent } from './admin/homepage/admin-homepage.component';
import { AdminAllShiftsComponent } from './admin/shifts/admin-all-shifts.component';
import { AdminAllWorkersComponent } from './admin/workers/admin-all-workers.component';
import { AdminWorkersUpdateComponent } from './admin/edit-worker/admin-workers-update.component';
import { LandingPageComponent } from './landing-page/landing-page.component';

export const ROUTE_LOGIN = 'login';
export const ROUTE_REGISTER = 'register';
export const ROUTE_HOMEPAGE = 'homepage';
export const ROUTE_SHIFTS = 'details';
export const ROUTE_PROFILE = 'profile';
export const ROUTE_MYSHIFTS = 'my-shifts';
export const ROUTE_ADMIN_HOMEPAGE = '/admin/homepage';
export const ROUTE_ADMIN_ALLSHIFTS = 'admin/shifts';
export const ROUTE_ADMIN_ALLWORKERS = 'admin/workers';


const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: ROUTE_LOGIN, component: LoginComponent },
  { path: ROUTE_REGISTER, component: RegisterComponent },
  { path: ROUTE_HOMEPAGE, component: HomepageComponent },
  { path: ROUTE_PROFILE, component: ProfileComponent},
  { path: 'shift/:id', component: ShiftsComponent },
  { path: ROUTE_SHIFTS, component: ShiftsComponent },
  { path: ROUTE_MYSHIFTS, component: MyShiftsComponent },
  { path: 'my-shifts/:uid', component: MyShiftsComponent },
  { path: 'user/:uid', component: AdminWorkersUpdateComponent},
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then((m) => m.AdminModule),
  },
  { path: '**', redirectTo: `${ROUTE_LOGIN}`}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
