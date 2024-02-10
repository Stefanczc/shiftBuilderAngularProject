import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { ROUTE_LOGIN } from 'src/app/app-routing.module';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';

  if (!isLoggedIn) {
    router.navigate([`${ROUTE_LOGIN}`]);
  }
  
  return isLoggedIn;
};
