import { Routes } from '@angular/router';
import { HomeComponent } from './features/home-page/home.component';
import { LoginComponent } from './features/login-page/login.component';
import { NoAuthGuard } from './guards/no-auth.guard';
import { DrPlantComponent } from './features/dr-plant-page/dr-plant.component';
import { PotEditorPageComponent } from './features/pot-editor-page/pot-editor-page.component';


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

  { path: 'pot-editor', component: PotEditorPageComponent },
  // 📌 Default Route (Redirect to Home)
  // If the user visits `/`, they are automatically redirected to `/home`
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  // { path: 'callback', component: CallbackComponent },
];
