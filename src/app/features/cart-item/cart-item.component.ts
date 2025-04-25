import { Component, inject, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CartItemService } from '../../services/cartItem.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cart-item',
  imports: [TranslateModule],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.scss'
})
export class CartItemComponent {
  @Input() id: number = 0;
  @Input() name: string = '';
  @Input() price: number = 0;
  @Input() amount: number = 0;

  private cartItemService = inject(CartItemService);

  deleteCartItem(cartItemId: number) {
    this.cartItemService.softDeleteCartItem(cartItemId);
  }
}
