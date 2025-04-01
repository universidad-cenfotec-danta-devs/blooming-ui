import { AfterViewInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageSelectorComponent } from '../language-selector/language-selector.component';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ModalComponent } from '../modal/modal.component';
import { AuthService } from '../../../services/auth.service';


/**
 * HeaderComponent displays the main header with navigation links, icons, and includes
 * a logout button that triggers a confirmation modal.
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, LanguageSelectorComponent, TranslateModule, ModalComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  encapsulation: ViewEncapsulation.Emulated  
})
export class HeaderComponent implements AfterViewInit {
  /** Controls the visibility of the dropdown menu. */
  isDropdownOpen = false;
  /** Timer reference for hiding the dropdown menu. */
  private hideTimeout: any;
  /** Retrieves the current user data from localStorage. */
  user = localStorage.getItem('auth_user');
  /** Stores the role of the current user. */
  userRole: string = '';

  /**
   * Reference to the logout confirmation modal.
   * The modal is declared with a template reference variable in the HTML.
   */
  @ViewChild('logoutModal') logoutModal!: ModalComponent;

  /**
   * Constructor with dependency injection.
   * @param router Angular Router for navigation.
   * @param authService AuthService used to log out the user.
   */
  constructor(private router: Router, private authService: AuthService) {}

  /**
   * Lifecycle hook after view initialization.
   * Retrieves and parses user data to set the user role.
   */
  ngAfterViewInit(): void {
    if (this.user) {
      this.userRole = String(JSON.parse(this.user).role.name);
    }
  }

  /**
   * Displays the dropdown menu immediately.
   */
  showDropdown(): void {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
    this.isDropdownOpen = true;
  }

  /**
   * Starts a timer to hide the dropdown menu after a short delay.
   */
  hideDropdownDelayed(): void {
    this.hideTimeout = setTimeout(() => {
      this.isDropdownOpen = false;
    }, 500);
  }

  /**
   * Cancels any pending timer to hide the dropdown menu.
   */
  cancelHideDropdown(): void {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
  }

  /**
   * Toggles the visibility of the dropdown menu.
   */
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  /**
   * Initiates the logout process by opening the confirmation modal.
   */
  initiateLogout(): void {
    if (this.logoutModal) {
      this.logoutModal.openModal();
    }
  }

  /**
   * Handler for when the modal confirm event is triggered.
   * Logs out the user and navigates to the login page.
   */
  onLogoutConfirm(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  /**
   * Handler for when the modal cancel event is triggered.
   * Currently, no additional logic is added for cancellation.
   */
  onLogoutCancel(): void {
    if (this.logoutModal) {
      this.logoutModal.closeModal();
    }
  }
}
