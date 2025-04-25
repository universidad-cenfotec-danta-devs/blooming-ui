import { Injectable, signal } from "@angular/core";
import { BaseService } from "../shared/service/base.service";
import { ICart } from "../interfaces/cart.interface";
import { ICartItem } from "../interfaces/cartItem.interface";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class CartService extends BaseService<ICart> {
    protected override source: string = 'cart';
    private cartListSignal = signal<ICart[]>([]);
    private user: any;
    private userCartId: any;

    constructor(private toastr: ToastrService, router: Router) {
        super();
    }

    get carts$() {
        return this.cartListSignal;
    }

    getUserCartId(): string {
        this.user = localStorage.getItem('auth_user');
        if(this.user) {
            this.userCartId = String(JSON.parse(this.user).cart.id);
        }
        return this.userCartId;
    }

    createAnonCart(cart: ICart) {
        localStorage.setItem('anon_cart', JSON.stringify(cart));
    }

    getAnonCart(): ICart {
        const cartData = localStorage.getItem('anon_cart');
        return cartData ? JSON.parse(cartData) : { items: [] };
    }

    addItemToAnonCart(newItem: ICartItem) {
        const cart = this.getAnonCart();
        const existingItem = cart.items.find(item => item.id === newItem.id);
        
        if (existingItem && existingItem.quantity !== undefined && newItem.quantity !== undefined) {
            existingItem.quantity += newItem.quantity;
        } else {
            cart.items.push(newItem);
        }

        this.createAnonCart(cart);
    }

    removeItemFromAnonCart(itemId: number) {
        const cart = this.getAnonCart();
        cart.items = cart.items.filter(item => item.id !== itemId);
        this.createAnonCart(cart);
    }

    deleteAnonCart() {
        localStorage.removeItem('anon_cart');
    }
}