import { ProductOutputRepository } from '../../repositories/product-outputs/ProductOutputRepository';
import { ProductOutput } from '../../entities/product-outputs/ProductOutput';

export class GetAllProductOutputsUseCase {
  constructor(private productOutputRepository: ProductOutputRepository) {}

  async execute(): Promise<ProductOutput[]> {
    return this.productOutputRepository.findAll();
  }
}
