import {AfterViewInit, Component, effect, inject, Output, ViewChild} from '@angular/core';
import {FooterComponent} from '../../shared/components/footer/footer.component';
import {HeaderComponent} from '../../shared/components/header/header.component';
import {ActivatedRoute, Router, RouterModule, RouterOutlet} from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSidenav } from '@angular/material/sidenav';
import { TranslateModule } from '@ngx-translate/core';
import { CartItemComponent } from "../../features/cart-item/cart-item.component";
import { ICartItem } from '../../interfaces/cartItem.interface';
import { CartItemService } from '../../services/cartItem.service';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'home-layout',
  standalone: true,
  imports: [
    FooterComponent,
    HeaderComponent,
    RouterOutlet,
    MatSidenavModule,
    TranslateModule,
    CartItemComponent,
    CommonModule,
    RouterModule
],
  templateUrl: 'home-layout.component.html',
  styleUrls: ['home-layout.component.css'],
})

export class HomeLayoutComponent {
  @ViewChild('cart') cart!: MatSidenav;
  private cartItemService = inject(CartItemService);
  private cartService = inject(CartService);

  cartItems!: ICartItem[];
  subtotal!: number;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.getCartItems();
    effect(() => {
      this.cartItems = this.cartItemService.cartItems$();
      this.calculateSubtotal();
    });
  }

  toggleCart() {
    if (this.cartItems && this.cartItems.length > 0) {
      this.getCartItems();
    }
    this.cart.toggle();
  }

  getCartItems() {
    this.cartItemService.getAllCartItemsByCartId(this.cartService.getUserCartId());
  }

  calculateSubtotal() {
    this.subtotal = 0;
    if (this.cartItems) {
      for (let i = 0; i < this.cartItems.length; i++) {
        this.subtotal += this.cartItems[i].price || 0;
      }
    }
  }

  goToCheckout() {
    this.router.navigate(['checkout'], { relativeTo: this.route });
  }
}
