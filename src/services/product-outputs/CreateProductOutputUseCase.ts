import { ProductOutputRepository, CreateProductOutputData } from '../../repositories/product-outputs/ProductOutputRepository';
import { ProductOutput } from '../../entities/product-outputs/ProductOutput';

export class CreateProductOutputUseCase {
  constructor(private productOutputRepository: ProductOutputRepository) {}

  async execute(request: CreateProductOutputData): Promise<ProductOutput> {
    if (!request.branchId) {
      throw new Error('Filial é obrigatória.');
    }
    if (!request.items || request.items.length === 0) {
      throw new Error('Ao menos um produto deve ser informado.');
    }

    // Ensure all items have a valid quantity > 0
    if (request.items.some(item => item.quantity <= 0)) {
       throw new Error('A quantidade dos produtos deve ser maior que zero.');
    }

    // Usually, in a real scenario, we would also double-check prices, etc.
    // For this demonstration, we trust the request's totalValue and unitPrices

    return this.productOutputRepository.create(request);
  }
}
