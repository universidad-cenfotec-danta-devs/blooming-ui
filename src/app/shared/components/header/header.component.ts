import {
  AfterViewInit,
  Component,
  ViewChild,
  ViewEncapsulation,
  inject
} from '@angular/core';
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
  encapsulation: ViewEncapsulation.Emulated,
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

  /** Reference to the logout confirmation modal. */
  @ViewChild('logoutModal') logoutModal!: ModalComponent;

  /** Router instance (injected via constructor). */
  constructor(private router: Router) {}

  /** Access AuthService via inject() to avoid circular dependency. */
  private authService = inject(AuthService);

  /**
   * Lifecycle hook after view initialization.
   * Retrieves and parses user data to set the user role.
   */
  ngAfterViewInit(): void {
    if (this.user) {
      this.userRole = String(JSON.parse(this.user).role.name);
    }
  }

  /** Displays the dropdown menu immediately. */
  showDropdown(): void {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
    this.isDropdownOpen = true;
  }

  /** Starts a timer to hide the dropdown menu after a short delay. */
  hideDropdownDelayed(): void {
    this.hideTimeout = setTimeout(() => {
      this.isDropdownOpen = false;
    }, 500);
  }

  /** Cancels any pending timer to hide the dropdown menu. */
  cancelHideDropdown(): void {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
  }

  /** Toggles the visibility of the dropdown menu. */
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  /** Initiates the logout process by opening the confirmation modal. */
  initiateLogout(): void {
    if (this.logoutModal) {
      this.logoutModal.openModal();
    }
  }

  /** Confirms logout, clears session, and redirects to login. */
  onLogoutConfirm(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  /** Cancels logout modal. */
  onLogoutCancel(): void {
    if (this.logoutModal) {
      this.logoutModal.closeModal();
    }
  }
}
