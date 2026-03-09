import { Product } from '../products/Product';
import { Branch } from '../branches/Branch';

export interface Inventory {
  id: string;
  productId: string;
  branchId: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  product?: Product;
  branch?: Branch;
}
