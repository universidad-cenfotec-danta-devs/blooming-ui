import { AfterViewInit, Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageSelectorComponent } from '../language-selector/language-selector.component';
import { TranslateModule } from '@ngx-translate/core';

/**
 * @description
 * The HeaderComponent displays the main header along with a dropdown menu icon.
 * The dropdown menu appears when the user hovers over the icon and remains visible
 * for 2 seconds after the mouse leaves, or stays open if the user hovers over the dropdown.
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, LanguageSelectorComponent, TranslateModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  encapsulation: ViewEncapsulation.Emulated  
})
export class HeaderComponent implements AfterViewInit{
  /** Controls the visibility of the dropdown menu. */
  isDropdownOpen = false;
  private hideTimeout: any;
  user = localStorage.getItem('auth_user');
  userRole: string = '';

  ngAfterViewInit(): void {
    if(this.user) {
      this.userRole = String(JSON.parse(this.user).role.name);
    }
  }

  /**
   * @description Shows the dropdown immediately and cancels any pending hide timer.
   */
  showDropdown(): void {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
    this.isDropdownOpen = true;
  }

  /**
   * @description Starts a 2-second timer to hide the dropdown.
   */
  hideDropdownDelayed(): void {
    this.hideTimeout = setTimeout(() => {
      this.isDropdownOpen = false;
    }, 500);
  }

  /**
   * @description Cancels the hide timer so that the dropdown remains visible.
   */
  cancelHideDropdown(): void {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
  }

  /**
   * @description Optionally toggles the dropdown menu manually.
   */
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}
