import { ProductOutput } from '../../entities/outputs/ProductOutput';
import { CreateProductOutputRequest, ProductOutputRepository } from '../../repositories/outputs/ProductOutputRepository';
import { InventoryRepository } from '../../repositories/inventory/InventoryRepository';
import { prisma } from '../../config/prisma';

export class CreateProductOutputUseCase {
  constructor(
    private productOutputRepository: ProductOutputRepository,
    private inventoryRepository: InventoryRepository
  ) {}

  async execute(request: CreateProductOutputRequest): Promise<ProductOutput> {
    return await prisma.$transaction(async (tx) => {
      // First, check inventory for each item to ensure enough stock is available
      for (const item of request.items) {
        const inventory = await this.inventoryRepository.findByProductAndBranch(item.productId, request.branchId);

        if (!inventory || inventory.quantity < item.quantity) {
          throw new Error(`Insufficient stock for product ID: ${item.productId} at the specified branch`);
        }
      }

      const output = await this.productOutputRepository.create(request);

      // Decrement inventory for each item
      for (const item of request.items) {
        await this.inventoryRepository.updateQuantity(item.productId, request.branchId, -item.quantity);
      }

      return output;
    });
  }
}
