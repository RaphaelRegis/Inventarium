import { ProductOutput } from '../../entities/outputs/ProductOutput';
import { Prisma } from '@prisma/client';

export interface CreateProductOutputRequest {
  date?: Date;
  customerId?: string | null;
  branchId: string;
  totalValue: number | Prisma.Decimal;
  items: {
    productId: string;
    quantity: number;
    unitPrice: number | Prisma.Decimal;
  }[];
}

export interface ProductOutputRepository {
  findById(id: string): Promise<ProductOutput | null>;
  findAll(): Promise<ProductOutput[]>;
  create(request: CreateProductOutputRequest): Promise<ProductOutput>;
  delete(id: string): Promise<void>;
}
