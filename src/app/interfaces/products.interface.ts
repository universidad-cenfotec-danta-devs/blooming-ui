import { INurseries } from "./nurseries.interface";

export interface IProducts{
    id?: number;
    name: string;
    description: string;
    price: number;
    nursery?: INurseries;
    userEmail?: string;
}
