import { ProductEntry } from '../../entities/entries/ProductEntry';

export interface CreateProductEntryRequest {
  date?: Date;
  supplierId: string;
  branchId: string;
  items: {
    productId: string;
    quantity: number;
  }[];
}

export interface ProductEntryRepository {
  findById(id: string): Promise<ProductEntry | null>;
  findAll(): Promise<ProductEntry[]>;
  create(request: CreateProductEntryRequest): Promise<ProductEntry>;
  delete(id: string): Promise<void>;
}
