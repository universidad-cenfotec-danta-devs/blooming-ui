import {Routes} from '@angular/router';

//import { NoAuthGuard } from './guards/no-auth.guard';
import {PotEditorPageComponent} from './features/pot-editor-page/pot-editor-page.component';
import {HomeComponent} from './features/home/home.component';
import {LoginComponent} from './features/login/login.component';
import {DrPlantComponent} from './features/dr-plant/dr-plant.component';
import {FloraByZoneComponent} from './features/flora-by-zone/flora-by-zone.component';
// import { UserListComponent } from './features/user-list/user-list.component';
import { AdminRoleGuard } from './guards/admin-role.guard';
import { AuthGuard } from './guards/auth.guard';
import { IRoleType } from './interfaces/roleType.interfaces';
// import { AdminLayoutComponent } from './features/admin-layout-component/admin-layout-component';
import { UsersComponent } from './features/users/users.component';
import { RoleRequestsComponent } from './features/role-requests/role-requests.component';
import { AdminLogsComponent } from './features/admin-logs/admin-logs.component';
import { HomepageComponent } from './features/admin/homepage/homepage.component';
import { AdminLayoutComponent } from './layouts/adminLayout/admin-layout.component';
import { NurseriesComponent } from './features/admin/nurseries/nurseries.component';

/**
 * Application Routing Configuration
 *
 * This configuration defines which component will be rendered for each path:
 * - `/home` renders HomeComponent and is protected by NoAuthGuard.
 * - `/login` renders LoginComponent.
 * - `/dr-plant` renders DrPlantComponent.
 * - `/pot-editor` renders PotEditorPageComponent.
 *
 * The default route (`/`) redirects to `/home`, and any unknown routes are also redirected to `/home`
 * via the wildcard route. The wildcard route should always be placed at the end of the routes array.
 */
export const routes: Routes = [
  // Home Page Route
  // When the user navigates to `/home`, Angular renders the HomeComponent.
  { path: 'home', component: HomeComponent/*, canActivate: [NoAuthGuard]*/ },

  { path: 'flora-by-zone', component: FloraByZoneComponent},

  // Login Page Route
  // When the user navigates to `/login`, Angular renders the LoginComponent.
  { path: 'login', component: LoginComponent },

  // Dr-plant Page Route
  // When the user navigates to `/dr-plant`, Angular renders the DrPlantComponent.
  { path: 'dr-plant', component: DrPlantComponent },

  // Pot Editor Page Route
  // When the user navigates to `/pot-editor`, Angular renders the PotEditorPageComponent.
  { path: 'pot-editor', component: PotEditorPageComponent },

  // Default Route (Redirect to Home)
  // If the user navigates to the root URL (`/`), they are automatically redirected to `/home`.
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  // Wildcard Route (Redirect to Home)
  // Any unknown routes (for example, `/nonexistent`) will be redirected to `/home`.
  // { path: '**', redirectTo: '/home', pathMatch: 'full' },
  // { path: 'callback', component: CallbackComponent },

  { path: 'access-denied', redirectTo:'/login', pathMatch: 'full' },

  { path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: HomepageComponent,
        canActivate:[AdminRoleGuard],
        data: {
          authorities: [
            IRoleType.admin
          ],
          name: 'Inicio'
        }
      },
      {
        path: 'users',
        component: UsersComponent,
        canActivate: [AdminRoleGuard],
        data: {
          authorities: [
            IRoleType.admin
          ],
          name: 'Users'
        }
      },
      {
        path: 'requests',
        component: RoleRequestsComponent,
        canActivate: [AdminRoleGuard],
        data: {
          authorities: [
            IRoleType.admin
          ],
          name: 'Requests'
        }
      },
      {
        path: 'logs',
        component: AdminLogsComponent,
        canActivate: [AdminRoleGuard],
        data: {
          authorities: [
            IRoleType.admin
          ],
          name: 'Logs'
        }
      },
      {
        path: 'nurseries',
        component: NurseriesComponent,
        canActivate: [AdminRoleGuard],
        data:{
          authorities: [
            IRoleType.admin
          ],
          name: 'Nurseries'
        }
      }
    ]
  },
  { path: '**', redirectTo: '/home', pathMatch: 'full' },
];
