import { IProducts } from './products.interface';
import {IUser} from './user.interface';

export interface INurseries{
  id?: number;
  name?: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  nurseryAdmin?: IUser;
  // evaluations?:
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  products?: IProducts[];
  // productNurseryList?:
}
