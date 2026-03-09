import { ProductEntry } from '../../entities/entries/ProductEntry';
import { ProductEntryRepository } from '../../repositories/entries/ProductEntryRepository';

export class GetAllProductEntriesUseCase {
  constructor(private productEntryRepository: ProductEntryRepository) {}

  async execute(): Promise<ProductEntry[]> {
    return this.productEntryRepository.findAll();
  }
}
