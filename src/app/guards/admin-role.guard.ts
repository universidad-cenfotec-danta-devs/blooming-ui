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

    // if(this.platform.isBrowser) {
    //   const user = localStorage.getItem('auth_User');
    //   if (user) {
    //     this.userRole = String(JSON.parse(user)?.role.name);
    //   }

    //   if (this.userRole != 'ADMIN_USER') {
    //     this.router.navigate(['access-denied']);
    //     return false;
    //   }
    // } else {
    //   this.router.navigate(['access-denied']);
    //   return false;
    // }
    // return true;
  }
}