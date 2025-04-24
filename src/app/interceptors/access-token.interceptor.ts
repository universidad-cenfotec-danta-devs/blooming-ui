import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenStoreService } from '../services/token-store.service';


export const accessTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenStore = inject(TokenStoreService);
  const token = tokenStore.getToken();

  /* ---------------------------------------------------------
   * 1. Requests that should remain untouched
   * --------------------------------------------------------- */
  const isAuthRequest = req.url.includes('/auth');
  const isPublicS3Asset =
    req.method === 'GET' && req.url.includes('blooming-project.s3');

  if (isAuthRequest || isPublicS3Asset || !token) {
    // Forward the request exactly as it came in
    return next(req);
  }

  /* ---------------------------------------------------------
   * 2. Attach Bearer token to every other request
   * --------------------------------------------------------- */
  const clonedRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token.replace(/"/g, '')}`,
    },
  });

  return next(clonedRequest);
};
