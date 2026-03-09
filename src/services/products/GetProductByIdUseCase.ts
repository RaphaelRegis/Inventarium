import { Product } from '../../entities/products/Product';
import { ProductRepository } from '../../repositories/products/ProductRepository';

export class GetProductByIdUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(id: string): Promise<Product | null> {
    return this.productRepository.findById(id);
  }
}
