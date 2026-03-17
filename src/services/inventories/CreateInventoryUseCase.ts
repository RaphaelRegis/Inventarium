import { InventoryRepository } from '../../repositories/inventories/InventoryRepository';
import { Inventory } from '../../entities/inventories/Inventory';

export interface CreateInventoryRequest {
  productId: string;
  branchIds: string[];
}

export class CreateInventoryUseCase {
  constructor(private inventoryRepository: InventoryRepository) {}

  async execute(request: CreateInventoryRequest): Promise<Inventory[]> {
    const createdInventories: Inventory[] = [];

    for (const branchId of request.branchIds) {
      // Check if it already exists
      const existing = await this.inventoryRepository.findByProductAndBranch(request.productId, branchId);
      
      if (!existing) {
        const created = await this.inventoryRepository.create({
          productId: request.productId,
          branchId,
          quantity: 0
        });
        createdInventories.push(created);
      }
    }

    return createdInventories;
  }
}
