import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.getUserIdFromToken()
  const requiredRole = route.data['role'];
  const existRole = user?.roles.some((role: string) => role === requiredRole);

  if(user && existRole) {
    return true;
  }
  router.navigate(['/not-found']);
  return false;
};
