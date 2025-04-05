import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenStoreService } from '../services/token-store.service';


/**
 * Functional HTTP interceptor that attaches a Bearer token to outgoing HTTP requests.
 * It uses the Angular `inject()` function to access TokenStoreService, thus avoiding
 * referencing AuthService (which can cause circular DI).
 */
export const accessTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenStore = inject(TokenStoreService);
  const token = tokenStore.getToken();

  if (!token) {
    return next(req);
  }

  if (req.url.includes('/auth')) {
    return next(req);
  }

  const clonedRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token.replace(/"/g, '')}`,
    },
  });

  return next(clonedRequest);
};
