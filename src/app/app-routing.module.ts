import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HomepageComponent } from './homepage/homepage.component';
import { ShiftsComponent } from './shifts/edit-shift/shifts-update.component';
import { ProfileComponent } from './profile/profile.component';
import { MyShiftsComponent } from './shifts/my-shifts.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { authGuard } from './shared/guards/auth.guard';

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
  { path: ROUTE_LOGIN, component: LoginComponent},
  { path: ROUTE_REGISTER, component: RegisterComponent},
  { path: ROUTE_HOMEPAGE, component: HomepageComponent, canActivate: [authGuard] },
  { path: ROUTE_PROFILE, component: ProfileComponent, canActivate: [authGuard]},
  { path: 'shift/:id', component: ShiftsComponent, canActivate: [authGuard] },
  { path: ROUTE_SHIFTS, component: ShiftsComponent, canActivate: [authGuard] },
  { path: ROUTE_MYSHIFTS, component: MyShiftsComponent, canActivate: [authGuard] },
  { path: 'my-shifts/:uid', component: MyShiftsComponent, canActivate: [authGuard] },
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
