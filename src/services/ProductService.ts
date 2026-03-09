import { Product } from '../entities/Product';
import { IProductRepository } from '../repositories/IProductRepository';

export class ProductService {
  constructor(private productRepository: IProductRepository) {}

  async getAllProducts(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  async getProductById(id: string): Promise<Product | null> {
    return this.productRepository.findById(id);
  }

  async createProduct(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    // Business logic like validations can go here
    if (data.price < 0) {
      throw new Error('Price cannot be negative');
    }
    return this.productRepository.create(data);
  }

  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    return this.productRepository.update(id, data);
  }

  async deleteProduct(id: string): Promise<void> {
    return this.productRepository.delete(id);
  }
}
