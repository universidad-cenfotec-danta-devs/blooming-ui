import {Routes} from '@angular/router';
import {PotEditorPageComponent} from './features/pot-editor-page/pot-editor-page.component';
import {HomeComponent} from './features/home/home.component';
import {LoginComponent} from './features/login/login.component';
import {DrPlantComponent} from './features/dr-plant/dr-plant.component';
import {FloraByZoneComponent} from './features/flora-by-zone/flora-by-zone.component';
import { UserListComponent } from './features/user-list/user-list.component';
import { AdminRoleGuard } from './guards/admin-role.guard';
import { AuthGuard } from './guards/auth.guard';
import { IRoleType } from './interfaces/roleType.interfaces';
import { AdminLayoutComponent } from './features/admin-layout-component/admin-layout-component';
import { UsersComponent } from './features/users/users.component';
import { RoleRequestsComponent } from './features/role-requests/role-requests.component';
import { AdminLogsComponent } from './features/admin-logs/admin-logs.component';

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
  { path: 'home', component: HomeComponent},

  { path: 'flora-by-zone', component: FloraByZoneComponent},

  { path: 'login', component: LoginComponent },

  { path: 'dr-plant', component: DrPlantComponent ,canActivate: [AuthGuard] },

  { path: 'pot-editor', component: PotEditorPageComponent,canActivate: [AuthGuard] },

  { path: '', redirectTo: '/home', pathMatch: 'full' },

  { path: '**', redirectTo: '/home', pathMatch: 'full' },

  { path: 'access-denied', redirectTo:'/login', pathMatch: 'full' },

  { path: 'admin', redirectTo: 'admin/users', pathMatch: 'full' },
  
  { path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
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
      }
    ]
  }
];
