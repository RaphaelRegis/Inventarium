import { Product } from '../../entities/products/Product';

export interface ProductRepository {
  findById(id: string): Promise<Product | null>;
  findByName(name: string): Promise<Product | null>;
  findAll(): Promise<Product[]>;
  create(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'suppliers'>, supplierIds: string[]): Promise<Product>;
  update(id: string, product: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'suppliers'>>, supplierIds?: string[]): Promise<Product>;
  delete(id: string): Promise<void>;
}
