import { CommonModule } from '@angular/common';

// Import TranslateModule from @ngx-translate/core to enable internationalization and translation features.
import { TranslateModule } from '@ngx-translate/core';

// Import shared UI components for the application.
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { LanguageSelectorComponent } from './components/language-selector/language-selector.component';
import { RouterOutlet } from '@angular/router';

/**
 * SHARED_IMPORTS
 *
 * @description
 * This constant array aggregates common modules and components that are used throughout
 * the application. It simplifies the process of importing these dependencies into other
 * modules or components.
 *
 * @example
 * // In another module, you can import these shared items as follows:
 * import { SHARED_IMPORTS } from './shared/shared-imports';
 *
 * @remarks
 * The array includes:
 * - CommonModule: For common Angular directives.
 * - TranslateModule: For translation and internationalization support.
 * - HeaderComponent, FooterComponent, LanguageSelectorComponent: Shared UI components.
 */
export const SHARED_IMPORTS = [
  CommonModule,
  TranslateModule,
  HeaderComponent,
  FooterComponent,
  LanguageSelectorComponent,
  RouterOutlet
];
