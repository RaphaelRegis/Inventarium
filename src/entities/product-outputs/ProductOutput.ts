import { Product } from '../products/Product';
import { Customer } from '../customers/Customer';
import { Branch } from '../branches/Branch';

export interface ProductOutputItem {
  id: string;
  productOutputId: string;
  productId: string;
  quantity: number;
  unitPrice: number;

  product?: Product;
}

export interface ProductOutput {
  id: string;
  date: Date;
  customerId?: string | null;
  branchId: string;
  totalValue: number;
  createdAt: Date;
  updatedAt: Date;

  customer?: Customer;
  branch?: Branch;
  items?: ProductOutputItem[];
}
