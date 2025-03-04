import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../enviroments/enviroment.development';

/**
 * Intercepts HTTP requests to prepend the API base URL dynamically.
 * Ensures all API requests are sent to the correct backend.
 */
export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const clonedRequest = req.clone({
    url: `${environment.apiUrl}/${req.url}`,
    setHeaders: {
      Accept: 'application/json',
    },
  });

  return next(clonedRequest);
};
