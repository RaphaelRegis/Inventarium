import { ProductEntryRepository } from '../../repositories/product-entries/ProductEntryRepository';
import { ProductEntry } from '../../entities/product-entries/ProductEntry';

export class GetAllProductEntriesUseCase {
  constructor(private productEntryRepository: ProductEntryRepository) {}

  async execute(): Promise<ProductEntry[]> {
    return this.productEntryRepository.findAll();
  }
}
