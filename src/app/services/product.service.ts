import { Injectable, signal } from "@angular/core";
import { IProducts } from "../interfaces/products.interface";
import { BaseService } from "../shared/service/base.service";

@Injectable({
  providedIn: 'root'
})

export class ProductServicer extends BaseService<IProducts>{
    protected override source = 'api/get-products';
    private productListSignal = signal<IProducts[]>([]);
    
    constructor() {
        super();
    }
    
    get products$(){
        return this.productListSignal;
    }

}