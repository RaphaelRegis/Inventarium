import { ProductOutput } from '../../entities/outputs/ProductOutput';
import { ProductOutputRepository } from '../../repositories/outputs/ProductOutputRepository';

export class GetAllProductOutputsUseCase {
  constructor(private productOutputRepository: ProductOutputRepository) {}

  async execute(): Promise<ProductOutput[]> {
    return this.productOutputRepository.findAll();
  }
}
