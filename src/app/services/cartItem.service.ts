import {inject, Injectable, signal} from "@angular/core";
import {BaseService} from "../shared/service/base.service";
import {ICartItemDTO} from "../interfaces/cartItemDTO.interface";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {CartService} from "./cart.service";
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class CartItemService extends BaseService<ICartItemDTO> {
  protected override source: string = 'cartItem';
  private cartItemListSignal = signal<ICartItemDTO[]>([]);
  private cartService = inject(CartService);
  protected translate: TranslateService = inject(TranslateService);
  constructor(private toastr: ToastrService, router: Router) {
    super();
  }

  get cartItems$() {
    return this.cartItemListSignal;
  }

  getAllCartItemsByCartId(cartId: string) {
    this.findAllWithCustomSource('cart/' + cartId).subscribe({
      next: (response: any) => {
        this.cartItemListSignal.set(response);
      },
      error: (err: any) => {
        console.error('error', err);
      }
    })
  }

  addItemToCart(data: any) {
    this.add(data).subscribe({
      next: (response: any) => {
        this.toastr.success(this.translate.instant('CART.ADDED_MSG'));
      },
      error: (err: any) => {
        this.toastr.error(err, 'Error');
        console.error('error', err);
      }
    })
  }

  softDeleteCartItem(cartItemId: number) {
    this.delCustomSource('cartItem/soft/' + cartItemId).subscribe(
      () => {
        this.toastr.success(this.translate.instant('CART.DELETED_MSG'));
        this.getAllCartItemsByCartId(this.cartService.getUserCartId());
      },
      (err: any) => {
        this.toastr.error(err, 'Error');
        console.error('error', err);
      }
    )
  }
}
