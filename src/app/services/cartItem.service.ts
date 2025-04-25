import { Injectable, signal } from "@angular/core";
import { BaseService } from "../shared/service/base.service";
import { ICartItemDTO } from "../interfaces/cartItemDTO.interface";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class CartItemService extends BaseService<ICartItemDTO> {
    protected override source: string = 'cartItem';
    private cartItemListSignal = signal<ICartItemDTO[]>([]);

    constructor(private toastr: ToastrService, router: Router) {
        super();
    }

    get cartItems$() {
        return this.cartItemListSignal;
    }

    getAllCartItemsByCartId(cartId: string) {
        this.findAllWithCustomSource('cart/'+ cartId).subscribe({
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
                this.toastr.success('Item added to cart', 'Success');
            },
            error: (err: any) => {
                this.toastr.error(err, 'Error');
                console.error('error', err);
            }
        })
    }
}