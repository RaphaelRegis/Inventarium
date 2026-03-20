import { ProductEntryRepository, CreateProductEntryData } from '../../repositories/product-entries/ProductEntryRepository';
import { ProductEntry } from '../../entities/product-entries/ProductEntry';

export class CreateProductEntryUseCase {
  constructor(private productEntryRepository: ProductEntryRepository) {}

  async execute(request: CreateProductEntryData): Promise<ProductEntry> {
    if (!request.supplierId) {
      throw new Error('Fornecedor é obrigatório.');
    }
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

    return this.productEntryRepository.create(request);
  }
}
