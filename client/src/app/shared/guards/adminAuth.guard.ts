import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {catchError, map, of} from 'rxjs';
import {logE} from '../../../main';

export const adminAuthGuard: CanActivateFn = (route, state) => {
  const r = inject(Router);
  return inject(AuthService).checkAdmin().pipe(map(isAuthenticated => {
    if (!isAuthenticated) {
      r.navigateByUrl('/home');
      return false;
    } else {
      return true;
    }
  }), catchError(error => {
    logE('', error);
    r.navigateByUrl('/home');
    return of(false);
  }));
};
