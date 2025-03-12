import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../service/language.service';
import { TranslateModule } from '@ngx-translate/core';

/**
 * @description
 * The `LanguageSelectorComponent` allows users to switch between languages dynamically.
 * The component interacts with the `LanguageService` to update the application's language.
 * It uses a 2-second delay on mouse leave to keep the dropdown visible.
 */
@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.css']
})
export class LanguageSelectorComponent {
  /** Controls the visibility of the language selection dropdown. */
  isDropdownVisible = false;
  private hideTimeout: any;

  /**
   * @description Injects the `LanguageService` to manage language switching.
   */
  constructor(private languageService: LanguageService) {}

  /**
   * @description Shows the dropdown immediately and cancels any pending hide timer.
   */
  showDropdown(): void {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
    this.isDropdownVisible = true;
  }

  /**
   * @description Starts a 1-second timer to hide the dropdown.
   */
  hideDropdownDelayed(): void {
    this.hideTimeout = setTimeout(() => {
      this.isDropdownVisible = false;
    }, 500);
  }

  /**
   * @description Cancels the hide timer, ensuring the dropdown stays visible.
   */
  cancelHideDropdown(): void {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
  }

  /**
   * @description Changes the application language using the `LanguageService`
   * and closes the dropdown.
   * @param lang - The language code to switch to (e.g., 'en' for English, 'es' for Spanish).
   */
  changeLanguage(lang: string): void {
    this.languageService.changeLanguage(lang);
    this.isDropdownVisible = false; // Close dropdown after selection
  }
}
