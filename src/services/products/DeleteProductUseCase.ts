import { ProductRepository } from '../../repositories/products/ProductRepository';

export class DeleteProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(id: string): Promise<void> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new Error('Product not found');
    }

    await this.productRepository.delete(id);
  }
}
