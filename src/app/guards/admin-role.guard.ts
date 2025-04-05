import { Injectable, inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { Platform } from '@angular/cdk/platform'
import { IRoleType } from "../interfaces/roleType.interfaces";

@Injectable({
  providedIn: 'root',
})
export class AdminRoleGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);
  protected userRole: String = '';

  constructor(private platform: Platform){}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const hasRole = this.authService.hasRole(IRoleType.admin);

    if(!hasRole) {
      this.router.navigate(['access-denied']);
      return false;
    }
    return true;
  }
}