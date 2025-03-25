import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const accessTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  let headers = {};

  if (!authService.check()) {
    return next(req);
  }
  
  if (!req.url.includes('auth')) {
    headers = {
      setHeaders: {
        Authorization: `Bearer ${authService.getAccessToken()?.replace(/"/g, '')}`,
      },
    };
  }

  const clonedRequest = req.clone(headers);

  // Log the headers to verify the token is being attached
  console.log('Request Headers:', clonedRequest.headers);

  return next(clonedRequest);
};
