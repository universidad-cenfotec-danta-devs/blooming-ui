import {
  AfterViewInit,
  Component,
  Output,
  ViewChild,
  ViewEncapsulation,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageSelectorComponent } from '../language-selector/language-selector.component';
import { TranslateModule } from '@ngx-translate/core';
import { Router, RouterModule } from '@angular/router'; 
import { ModalComponent } from '../modal/modal.component';
import { AuthService } from '../../../services/auth.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { EventEmitter } from '@angular/core';
import { ICart } from '../../../interfaces/cart.interface';
import { CartService } from '../../../services/cart.service';

/**
 * HeaderComponent displays the main header with navigation links,
 * includes a dropdown under “Dr. Plant” for Identify, Diagnose, Chat,
 * and a user/cart dropdown on the right with logout confirmation.
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    LanguageSelectorComponent,
    TranslateModule,
    ModalComponent,
    RouterModule,
    MatSidenavModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class HeaderComponent implements AfterViewInit {
  /** State for the right‑hand icon dropdown (cart/user menu) */
  isDropdownOpen = false;
  private hideTimeout: any;

  /** State for the “Dr. Plant” center nav dropdown */
  isPlantDropdownOpen = false;
  private plantHideTimeout: any;

  /** Raw JSON string of the logged‑in user */
  user: any;

  anonCart: any;
  /** Parsed role name of the logged‑in user */
  userRole: string = '';

  /** Reference to the logout confirmation modal component */
  @ViewChild('logoutModal') logoutModal!: ModalComponent;

  @Output() toggleCart = new EventEmitter<void>();

  constructor(private router: Router) {}

  /** Injected AuthService for logout (avoids circular DI) */
  private authService = inject(AuthService);

  private cartService = inject(CartService);

  /**
   * After view init, read stored user info and extract role.
   */
  ngAfterViewInit(): void {
    this.user = localStorage.getItem('auth_user');
    this.anonCart = localStorage.getItem('anon_cart');
    if (this.user) {
      this.userRole = String(JSON.parse(this.user).role.name);
    } else if (!this.anonCart){
      const cart: ICart = {
        items: []
      };
      this.cartService.createAnonCart(cart);
    }
  }

  // ==== Right‑hand dropdown controls ====

  /** Immediately show the right‑hand dropdown */
  showDropdown(): void {
    clearTimeout(this.hideTimeout);
    this.isDropdownOpen = true;
  }

  /** Hide the right‑hand dropdown after a short delay */
  hideDropdownDelayed(): void {
    this.hideTimeout = setTimeout(() => this.isDropdownOpen = false, 500);
  }

  /** Cancel any pending hide for right‑hand dropdown */
  cancelHideDropdown(): void {
    clearTimeout(this.hideTimeout);
  }

  /** Toggle the right‑hand dropdown open/closed */
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  // ==== “Dr. Plant” center nav dropdown controls ====

  /** Immediately show the “Dr. Plant” dropdown */
  showPlantDropdown(): void {
    clearTimeout(this.plantHideTimeout);
    this.isPlantDropdownOpen = true;
  }

  /** Hide the “Dr. Plant” dropdown after a short delay */
  hidePlantDropdownDelayed(): void {
    this.plantHideTimeout = setTimeout(() => this.isPlantDropdownOpen = false, 500);
  }

  /** Cancel any pending hide for the “Dr. Plant” dropdown */
  cancelHidePlantDropdown(): void {
    clearTimeout(this.plantHideTimeout);
  }

  /** Toggle the “Dr. Plant” dropdown open/closed */
  togglePlantDropdown(): void {
    this.isPlantDropdownOpen = !this.isPlantDropdownOpen;
  }

  // ==== Logout flow ====

  /** Open the logout confirmation modal */
  initiateLogout(): void {
    this.logoutModal?.openModal();
  }

  /** On confirm: perform logout and navigate to login */
  onLogoutConfirm(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  /** On cancel: close the logout modal */
  onLogoutCancel(): void {
    this.logoutModal?.closeModal();
  }
}
