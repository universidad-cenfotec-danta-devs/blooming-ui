import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { LanguageSelectorComponent } from './components/language-selector/language-selector.component';
import {  RouterOutlet } from '@angular/router';
import { InfoCardComponent } from './components/info-card/info-card.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import {  ModalComponent } from './components/modal/modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


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
  RouterOutlet,
  InfoCardComponent,
  CarouselComponent,
  ModalComponent,
  FormsModule,
  ReactiveFormsModule
];
