import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);

  const condition =
    sessionStorage.getItem('access-token') !== undefined &&
    sessionStorage.getItem('access-token') !== null;

  if (condition) {
    return true;
  } else {
    router.navigate(['/login']); // Redirect if condition fails
    return false;
  }
};
