import { Product } from '../products/Product';
import { Supplier } from '../suppliers/Supplier';
import { Branch } from '../branches/Branch';

export interface ProductEntryItem {
  id: string;
  productEntryId: string;
  productId: string;
  quantity: number;

  product?: Product;
}

export interface ProductEntry {
  id: string;
  date: Date;
  supplierId: string;
  branchId: string;
  createdAt: Date;
  updatedAt: Date;

  supplier?: Supplier;
  branch?: Branch;
  items?: ProductEntryItem[];
}
