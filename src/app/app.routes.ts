import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/login/login.component';
import { NoAuthGuard } from './guards/no-auth.guard';
import { DrPlantComponent } from './features/dr-plant/dr-plant.component';
import { UserListComponent } from './features/user-list/user-list.component';
import { AdminRoleGuard } from './guards/admin-role.guard';
import { AuthGuard } from './guards/auth.guard';
import { IRoleType } from './interfaces/roleType.interfaces';

/**
 * Defines the routing configuration for the application.
 *
 * @remarks
 * This configuration specifies which component should be rendered for
 * each path in the application.
 *    Ex:
 * - `/home` renders the HomeComponent.
 * - `/login` renders the LoginComponent.
 * - The default path (`/`) redirects to `/home`.
 *
 *
 * @public
 */
export const routes: Routes = [
  // 📌 Home Page Route
  // When the user visits `/home`, Angular will render HomeComponent and trigger the NoAuthGuard feature
  { path: 'home', component: HomeComponent, canActivate: [NoAuthGuard]  },

  // 📌 Login Page Route
  // When the user visits `/login`, Angular will render LoginComponent
  { path: 'login', component: LoginComponent },

    // 📌 Dr-plant Page Route
  // When the user visits `/dr-plant`, Angular will render LoginComponent
  { path: 'dr-plant', component: DrPlantComponent },

  // 📌 Default Route (Redirect to Home)
  // If the user visits `/`, they are automatically redirected to `/home`
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  // { path: 'callback', component: CallbackComponent },

  { path: 'access-denied', redirectTo:'/login', pathMatch: 'full' },
  
  { path: 'admin',
    component: UserListComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'users',
        component: UserListComponent,
        canActivate: [AdminRoleGuard],
        data: {
          authorities: [
            IRoleType.admin
          ],
          name: 'Users'
        }
      }
    ]
  }
];
