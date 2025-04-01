import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * Functional HTTP interceptor that attaches a Bearer token to outgoing HTTP requests.
 * It uses the Angular `inject()` function to safely access `AuthService` without causing
 * circular dependency issues, especially during app initialization.
 *
 * The token is added only if:
 * - The user is authenticated.
 * - The request URL does not include the substring 'auth' (e.g., for login/register).
 */
export const accessTokenInterceptor: HttpInterceptorFn = (req, next) => {
  // Dynamically inject AuthService to avoid circular dependency
  const authService = inject(AuthService);

  // If the user is not authenticated, proceed with the original request
  if (!authService.check()) {
    return next(req);
  }

  // Initialize options for cloning the request
  let requestOptions = {};

  // Only attach the token if the URL does not target authentication endpoints
  if (!req.url.includes('auth')) {
    const token = authService.getAccessToken()?.replace(/"/g, ''); // Remove quotes if present

    if (token) {
      requestOptions = {
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      };
    }
  }

  // Clone the original request with the modified headers
  const clonedRequest = req.clone(requestOptions);

  // Optional: Log the headers for debugging purposes
  console.log('Request Headers:', clonedRequest.headers);

  // Forward the modified or original request to the next handler
  return next(clonedRequest);
};
