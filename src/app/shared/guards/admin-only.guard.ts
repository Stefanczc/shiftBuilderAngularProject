import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { ShareDataService } from '../services/user.service';
import { ROUTE_MYSHIFTS } from 'src/app/app-routing.module';
import { AuthService } from '../services/authentication.service';

export const adminOnlyGuard: CanActivateFn = async (route, state) => {

  const shareDataService = inject(ShareDataService);
  const router = inject(Router);
  const authService = inject(AuthService);

  authService.uid$.subscribe(async userId => {
    if (userId !== null) {
      try {
        const user = await shareDataService.getUserByUid(userId);
        if (user!.role === 'user') {
          router.navigate([`${ROUTE_MYSHIFTS}`]);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
  });

  return true;
}


