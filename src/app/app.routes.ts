import { Routes } from '@angular/router';

import { NoAuthGuard } from './guards/no-auth.guard';

import { PotEditorPageComponent } from './features/pot-editor-page/pot-editor-page.component';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/login/login.component';
import { DrPlantComponent } from './features/dr-plant/dr-plant.component';

/**
 * Defines the routing configuration for the application.
 *
 * @remarks
 * This configuration specifies which component should be rendered for
 * each path in the application.
 * For example:
 * - `/home` renders the HomeComponent.
 * - `/login` renders the LoginComponent.
 * - The default path (`/`) redirects to `/home`.
 *
 * Additionally, the wildcard route catches all unknown routes and
 * redirects them to `/home`.
 *
 * @public
 */
export const routes: Routes = [
  // 📌 Home Page Route
  // When the user visits `/home`, Angular will render HomeComponent.
  { path: 'home', component: HomeComponent, canActivate: [NoAuthGuard] },

  // 📌 Login Page Route
  // When the user visits `/login`, Angular will render LoginComponent.
  { path: 'login', component: LoginComponent },

  // 📌 Dr-plant Page Route
  // When the user visits `/dr-plant`, Angular will render DrPlantComponent.
  { path: 'dr-plant', component: DrPlantComponent },

  // 📌 Pot Editor Page Route
  // When the user visits `/pot-editor`, Angular will render PotEditorPageComponent.
  { path: 'pot-editor', component: PotEditorPageComponent },

  // 📌 Default Route (Redirect to Home)
  // If the user visits `/`, they are automatically redirected to `/home`.
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  // 📌 Wildcard Route (Redirect to Home)
  // This route catches any unknown paths (including hash-only URLs) and redirects to `/home`.
  { path: '**', redirectTo: '/home', pathMatch: 'full' },
];
