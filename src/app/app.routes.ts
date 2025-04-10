import {Routes} from '@angular/router';
import {PotEditorPageComponent} from './features/pot-editor-page/pot-editor-page.component';
import {HomeComponent} from './features/home/home.component';
import {LoginComponent} from './features/login/login.component';
import {DrPlantComponent} from './features/dr-plant/dr-plant.component';
import {FloraByZoneComponent} from './features/flora-by-zone/flora-by-zone.component';
import { AdminRoleGuard } from './guards/admin-role.guard';
import { AuthGuard } from './guards/auth.guard';
import { IRoleType } from './interfaces/roleType.interfaces';
import { UsersComponent } from './features/users/users.component';
import { RoleRequestsComponent } from './features/role-requests/role-requests.component';
import { AdminLogsComponent } from './features/admin-logs/admin-logs.component';
import { HomepageComponent } from './features/admin/homepage/homepage.component';
import { AdminLayoutComponent } from './layouts/adminLayout/admin-layout.component';
import { NurseriesComponent } from './features/admin/nurseries/nurseries.component';
import {HomeLayoutComponent} from './layouts/homeLayout/home-layout.component';
import {NurseryComponent} from './features/nursery/nursery.component';
import {NurseryInfoComponent} from './features/nursery-info/nursery-info.component';
import { CreateNurseryComponent } from './features/create-nursery/create-nursery.component';

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

  { path: 'login', component: HomeLayoutComponent,
    children:[
      {
        path: '',
        component: LoginComponent
      }
    ]
   },

  { path: 'access-denied', redirectTo:'/login', pathMatch: 'full' },

  {
    path: 'home',
    component: HomeLayoutComponent,
    children:[
      {path: '',
       component: HomeComponent
      },
      {
        path: 'flora-by-zone',
        component: FloraByZoneComponent
      },
      {
        path: 'dr-plant',
        component: DrPlantComponent
      },
      {
        path: 'pot-editor',
        component: PotEditorPageComponent
      },
      {
        path: 'nurseries',
        component: NurseryComponent
      },
      {
        path: 'nursery-info/:id',
        component: NurseryInfoComponent
      },
      {
        path: 'create-nursery',
        component: CreateNurseryComponent
      }
    ]
  },

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
