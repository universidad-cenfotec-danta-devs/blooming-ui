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
  imports: [...SHARED_IMPORTS, TranslateModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
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
    this.configureLanguage();
  }

  /**
   * Angular lifecycle hook that runs after the component has been initialized.
   * It subscribes to router events and conditionally initializes Three.js if in a browser environment.
   */
  ngOnInit(): void {
    this.router.events.subscribe((event: Event) => {
      // Optional: add logic to handle route changes.
    });

    if (isPlatformBrowser(this.platformId)) {
      this.initThreeJs();
    }
  }

  /**
   * Detects the browser's language and initializes the translation system.
   * Defaults to Spanish if the browser's language is not supported or if an error occurs.
   */
  private configureLanguage(): void {
    // Define supported languages
    this.translate.addLangs(['en', 'es']);
    this.translate.setDefaultLang('es');

    try {
      const browserLang = this.translate.getBrowserLang() ?? 'es';
      const selectedLang = browserLang.match(/en|es/) ? browserLang : 'es';

      this.translate.use(selectedLang).subscribe({
        next: () => console.log(`Translation for '${selectedLang}' loaded successfully.`),
        error: (err) => console.error('Error loading translation:', err)
      });
    } catch (e) {
      console.error('Language initialization failed:', e);
    }
  }

  /**
   * Initializes Three.js safely in browser environments.
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
