import type { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).token();
  
  // Clone the request to add the new header.
  const newReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${ token ?? '' }`)
  });
  return next(newReq);
};
