import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router, Event } from '@angular/router';
import { SHARED_IMPORTS } from './shared/shared.module';
import { TranslateService, TranslateStore, TranslateModule } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';  
import * as THREE from 'three';

/**
 * AppComponent
 *
 * The root component of the Angular application.
 * It integrates routing, shared modules, and internationalization using ngx-translate.
 * 
 * Features:
 * - Automatic language detection and selection based on the browser's language.
 * - Subscription to router events for debugging and navigation handling.
 * - Safe initialization of Three.js only when running in the browser to avoid SSR issues.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  // Including TranslateModule ensures that the TranslateService injection token is available.
  imports: [...SHARED_IMPORTS, TranslateModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  // Providing TranslateStore to maintain translation state.
  providers: [TranslateStore]
})
export class AppComponent implements OnInit {

  /**
   * Constructs an instance of AppComponent.
   *
   * @param translate - The TranslateService for handling language translations.
   * @param router - The Router service for handling navigation and tracking events.
   * @param platformId - The platform identifier (browser or server) used for environment detection.
   */
  constructor(
    private translate: TranslateService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Add supported languages to the translation service.
    translate.addLangs(['en', 'es']);

    // Set the default language to Spanish ('es').
    translate.setDefaultLang('es');

    // Automatically detect the browser's language, defaulting to Spanish if unsupported.
    const browserLang = translate.getBrowserLang() ?? 'es';
    translate.use(browserLang.match(/en|es/) ? browserLang : 'es')
      .subscribe(
        () => console.log('Translation loaded successfully'),
        err => console.error('Error loading translation:', err)
      );
  }

  /**
   * Angular lifecycle hook that runs after the component has been initialized.
   * It subscribes to router events and conditionally initializes Three.js if in a browser environment.
   */
  ngOnInit(): void {
    // Subscribe to router events (useful for debugging navigation).
    this.router.events.subscribe((event: Event) => {
      // Additional navigation handling can be implemented here.
    });

    // Initialize Three.js only when running in the browser to avoid server-side errors.
    if (isPlatformBrowser(this.platformId)) {
      this.initThreeJs();
    }
  }

  /**
   * Initializes Three.js.
   *
   * This method is called only in a browser environment to ensure that SSR does not try to execute
   * browser-specific code (like accessing the window object).
   */
  private initThreeJs(): void {
    try {
      const scene = new THREE.Scene();
      console.log('Three.js initialized successfully');
    } catch (error) {
      console.error('Error initializing Three.js:', error);
    }
  }
}
