import { Customer } from '../customers/Customer';
import { Branch } from '../branches/Branch';
import { Product } from '../products/Product';
import { Prisma } from '@prisma/client';

export interface ProductOutputItem {
  id: string;
  productOutputId: string;
  productId: string;
  quantity: number;
  unitPrice: number | Prisma.Decimal;
  product?: Product;
}

export interface ProductOutput {
  id: string;
  date: Date;
  customerId?: string | null;
  branchId: string;
  totalValue: number | Prisma.Decimal;
  createdAt: Date;
  updatedAt: Date;
  customer?: Customer | null;
  branch?: Branch;
  items?: ProductOutputItem[];
}
