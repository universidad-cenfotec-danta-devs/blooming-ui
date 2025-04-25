import { ICartItemType } from "./cartItemType.interface";

export interface ICartItem {
    id?: number,
    itemName?: string,
    itemType?: ICartItemType,
    price?: number,
    quantity?: number
}