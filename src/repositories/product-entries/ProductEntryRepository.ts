import { ProductEntry } from '../../entities/product-entries/ProductEntry';

export interface CreateProductEntryData {
  supplierId: string;
  branchId: string;
  date: Date;
  items: {
    productId: string;
    quantity: number;
  }[];
}

export interface ProductEntryRepository {
  findById(id: string): Promise<ProductEntry | null>;
  findAll(): Promise<ProductEntry[]>;
  create(data: CreateProductEntryData): Promise<ProductEntry>;
}
