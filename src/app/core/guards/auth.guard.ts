import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../auth/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if logged in (using our Signal)
  if (authService.isAuthenticated()) {
    return true; //to allow the access
  }

  //If not logged in, force redirect to login page
  router.navigate(['/login']);
  return false; //i block the access
};