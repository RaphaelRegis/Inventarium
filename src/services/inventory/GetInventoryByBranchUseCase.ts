import { Inventory } from '../../entities/inventory/Inventory';
import { InventoryRepository } from '../../repositories/inventory/InventoryRepository';

export class GetInventoryByBranchUseCase {
  constructor(private inventoryRepository: InventoryRepository) {}

  async execute(branchId: string): Promise<Inventory[]> {
    return this.inventoryRepository.findByBranch(branchId);
  }
}
