import { ProductEntry } from '../../entities/entries/ProductEntry';
import { ProductEntryRepository, CreateProductEntryRequest } from '../../repositories/entries/ProductEntryRepository';
import { InventoryRepository } from '../../repositories/inventory/InventoryRepository';
import { prisma } from '../../config/prisma';

export class CreateProductEntryUseCase {
  constructor(
    private productEntryRepository: ProductEntryRepository,
    private inventoryRepository: InventoryRepository
  ) {}

  async execute(request: CreateProductEntryRequest): Promise<ProductEntry> {
    // We use a transaction to ensure both the entry and inventory updates occur
    return await prisma.$transaction(async (tx) => {
      const entry = await this.productEntryRepository.create(request);

      // Update inventory for each item
      for (const item of request.items) {
        await this.inventoryRepository.updateQuantity(item.productId, request.branchId, item.quantity);
      }

      return entry;
    });
  }
}
