import { ICartItemType } from "./cartItemType.interface";

export interface ICartItemDTO {
    cartId?: string,
    itemName?: string,
    itemType?: ICartItemType,
    price?: number,
    quantity?: number
}