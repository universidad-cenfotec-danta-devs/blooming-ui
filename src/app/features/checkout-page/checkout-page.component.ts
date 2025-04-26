import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CartItemService } from '../../services/cartItem.service';
import { CartService } from '../../services/cart.service';
import { ICartItem } from '../../interfaces/cartItem.interface';
import { CartItemComponent } from "../cart-item/cart-item.component";
import { TranslateModule } from '@ngx-translate/core';
import { ICartItemType } from '../../interfaces/cartItemType.interface';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [CommonModule, RouterModule, CartItemComponent, TranslateModule],
  templateUrl: './checkout-page.component.html',
  styleUrl: './checkout-page.component.scss'
})
export class CheckoutPageComponent {
  private cartItemService = inject(CartItemService);
  private cartService = inject(CartService);

  cartItems!: ICartItem[];
  subtotal!: number;
  total!: number;
  totalItems!: number;
  
  constructor(private router: Router, private route: ActivatedRoute) {
    this.getCartItems();
    effect(() => {
      this.cartItems = this.cartItemService.cartItems$();
      this.calculateSubtotal();
      this.calculateTotal();
      this.calculateTotalItems();
    });
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

  calculateTotal() {
    this.total = 0;
    if (this.cartItems) {
      for (let i = 0; i < this.cartItems.length; i++) {
        if (this.cartItems[i].itemType === ICartItemType.pot) {
          this.total += (this.cartItems[i].price! + 2) || 0;
        } else {
          this.total += (this.cartItems[i].price! + 5) || 0;
        }
      }
    }
  }

  calculateTotalItems() {
    this.totalItems = 0;
    if (this.cartItems) {
      this.totalItems = this.cartItems.length;
    }
  }
}
