// src/app/guards/designer-role.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService }  from '../services/auth.service';
import { IRoleType }    from '../interfaces/roleType.interfaces';

/**
 * Allows navigation only when the current user has
 *  • ROLE_ADMIN_USER   or
 *  • DESIGNER_USER     or
 *  • ROLE_DESIGNER_USER
 *
 * Otherwise redirects to /access-denied.
 */
export const DesignerRoleGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  const allowed =
       auth.hasRole(IRoleType.admin)             // ROLE_ADMIN_USER
    || auth.hasRole(IRoleType.designer)          // DESIGNER_USER
    || auth.hasRole(IRoleType.role_designer_user);

  if (!allowed) {
    router.navigate(['/access-denied']);
    return false;
  }
  return true;
};
