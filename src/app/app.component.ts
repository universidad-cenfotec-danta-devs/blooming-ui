import { Component, OnInit } from '@angular/core';
import { Router, Event } from '@angular/router';
import { SHARED_IMPORTS } from './shared/shared.module';
import { TranslateService, TranslateStore } from '@ngx-translate/core';


/**
 * AppComponent
 *
 * @description
 * This is the root component of the Angular application. It uses standalone components,
 * integrating router functionality, shared modules and components, and internationalization
 * features through ngx-translate.
 *
 * The component configures the available languages, sets a default language, and automatically
 * selects a language based on the browser settings. It also subscribes to router events for
 * debugging purposes.
 *
 * @example
 * When the application loads, it detects the browser's language, applies it if available, or
 * falls back to Spanish. Additionally, every routing event is logged to the console.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  // Combine the RouterOutlet with shared modules and CommonModule for enhanced functionalities
  imports: [...SHARED_IMPORTS],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [TranslateStore]  // Provide TranslateStore to manage translation state
})
export class AppComponent implements OnInit {

  /**
   * Creates an instance of AppComponent.
   *
   * @param translate - The TranslateService for handling internationalization.
   * @param router - The Router for navigation and event tracking.
   */
  constructor(private translate: TranslateService, private router: Router) {
    // Add available languages for the application
    translate.addLangs(['en', 'es']);

    // Set the default language to Spanish ('es')
    translate.setDefaultLang('es');

    // Retrieve the browser's default language; default to 'es' if not available
    const browserLang = translate.getBrowserLang() ?? 'es';

    // Check if the detected language is either 'en' or 'es'; otherwise, fallback to 'es'
    translate.use(browserLang.match(/en|es/) ? browserLang : 'es')
      .subscribe(
        () => console.log('Translation loaded successfully'), // Log success message upon successful translation load
        err => console.error('Error loading translation:', err) // Log error message if translation fails        
      );
  }

  /**
   * Lifecycle hook called on component initialization.
   *
   * Here, we subscribe to router events to log them for debugging and monitoring navigation.
   */
  ngOnInit(): void {
    this.router.events.subscribe((event: Event) => {
      
    });
  }
}
