import {
  AfterViewInit,
  Component,
  Output,
  ViewChild,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { LanguageSelectorComponent } from '../language-selector/language-selector.component';
import { ModalComponent } from '../modal/modal.component';
import { AuthService } from '../../../services/auth.service';
import { IRoleType } from '../../../interfaces/roleType.interfaces';
import { MatSidenavModule } from '@angular/material/sidenav';
import { EventEmitter } from '@angular/core';
import { ICart } from '../../../interfaces/cart.interface';
import { CartService } from '../../../services/cart.service';

/**
 * Top-level navigation bar:
 * – left logo
 * – centre links (including two dropdowns)
 * – right icons, language selector, user menu, logout
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
  /* right-hand icon dropdown */
  isDropdownOpen = false;
  private hideTimeout: any;

  /* “Dr Plant” dropdown */
  isPlantDropdownOpen = false;
  private plantHideTimeout: any;

  /* “Pots” dropdown */
  isPotDropdownOpen = false;
  private potHideTimeout: any;

  user: any;
  userRole = '';

  anonCart: any;

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

  /* right-hand dropdown controls --------------------------------- */
  showDropdown(): void {
    clearTimeout(this.hideTimeout);
    this.isDropdownOpen = true;
  }
  hideDropdownDelayed(): void {
    this.hideTimeout = setTimeout(() => (this.isDropdownOpen = false), 500);
  }
  cancelHideDropdown(): void {
    clearTimeout(this.hideTimeout);
  }
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  /* Dr Plant dropdown controls ----------------------------------- */
  showPlantDropdown(): void {
    clearTimeout(this.plantHideTimeout);
    this.isPlantDropdownOpen = true;
  }
  hidePlantDropdownDelayed(): void {
    this.plantHideTimeout = setTimeout(
      () => (this.isPlantDropdownOpen = false),
      500,
    );
  }
  cancelHidePlantDropdown(): void {
    clearTimeout(this.plantHideTimeout);
  }
  togglePlantDropdown(): void {
    this.isPlantDropdownOpen = !this.isPlantDropdownOpen;
  }

  /* Pots dropdown controls --------------------------------------- */
  showPotDropdown(): void {
    clearTimeout(this.potHideTimeout);
    this.isPotDropdownOpen = true;
  }
  hidePotDropdownDelayed(): void {
    this.potHideTimeout = setTimeout(
      () => (this.isPotDropdownOpen = false),
      500,
    );
  }
  cancelHidePotDropdown(): void {
    clearTimeout(this.potHideTimeout);
  }
  togglePotDropdown(): void {
    this.isPotDropdownOpen = !this.isPotDropdownOpen;
  }

  /* logout flow -------------------------------------------------- */
  initiateLogout(): void {
    this.logoutModal.openModal();
  }
  onLogoutConfirm(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  onLogoutCancel(): void {
    this.logoutModal.closeModal();
  }

    get isAdmin(): boolean {
      return this.authService.hasRole(IRoleType.admin);
    }
  
    get isDesigner(): boolean {
      return (
        this.authService.hasRole(IRoleType.designer) ||
        this.authService.hasRole(IRoleType.role_designer_user)
      );
    }
  
    /* True when user is either ADMIN or DESIGNER */
    get canSeePotFeatures(): boolean {
      return this.isAdmin || this.isDesigner;
    } 
}
