import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenStoreService } from '../services/token-store.service';


/**
 * Functional HTTP interceptor that attaches a Bearer token to outgoing HTTP requests.
 * It uses the Angular `inject()` function to access TokenStoreService, thus avoiding
 * referencing AuthService (which can cause circular DI).
 */
export const accessTokenInterceptor: HttpInterceptorFn = (req, next) => {
  // Use the token store to retrieve the token
  const tokenStore = inject(TokenStoreService);
  const token = tokenStore.getToken();

  // If no token, just forward the request
  if (!token) {
    return next(req);
  }

  // Example: skip adding token if the URL includes '/auth'
  if (req.url.includes('/auth')) {
    return next(req);
  }

  // Attach the Bearer token
  const clonedRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token.replace(/"/g, '')}`,
    },
  });

  return next(clonedRequest);
};
