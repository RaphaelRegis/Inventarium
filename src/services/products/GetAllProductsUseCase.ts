import { Product } from '../../entities/products/Product';
import { ProductRepository } from '../../repositories/products/ProductRepository';

export class GetAllProductsUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(): Promise<Product[]> {
    return this.productRepository.findAll();
  }
}
