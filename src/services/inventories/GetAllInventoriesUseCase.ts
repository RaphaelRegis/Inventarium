import { InventoryRepository } from '../../repositories/inventories/InventoryRepository';
import { Inventory } from '../../entities/inventories/Inventory';

export class GetAllInventoriesUseCase {
  constructor(private inventoryRepository: InventoryRepository) {}

  async execute(): Promise<Inventory[]> {
    return this.inventoryRepository.findAll();
  }
}
