import { ProductOutput } from '../../entities/product-outputs/ProductOutput';

export interface CreateProductOutputData {
  customerId?: string | null;
  branchId: string;
  date: Date;
  totalValue: number;
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
  }[];
}

export interface ProductOutputRepository {
  findById(id: string): Promise<ProductOutput | null>;
  findAll(): Promise<ProductOutput[]>;
  create(data: CreateProductOutputData): Promise<ProductOutput>;
}
