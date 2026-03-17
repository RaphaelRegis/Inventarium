import { Prisma } from '@prisma/client';
import { Supplier } from '../suppliers/Supplier';
import { Inventory } from '../inventories/Inventory';

export interface Product {
  id: string;
  name: string;
  description?: string | null;
  remarks?: string | null;
  purchasePrice: number | Prisma.Decimal;
  retailPrice: number | Prisma.Decimal;
  createdAt: Date;
  updatedAt: Date;
  suppliers?: Supplier[];
  inventories?: Inventory[];
}
