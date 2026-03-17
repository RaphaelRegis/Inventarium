import { InventoryRepository } from '../../repositories/inventories/InventoryRepository';

export class DeleteInventoryUseCase {
  constructor(private inventoryRepository: InventoryRepository) {}

  async execute(id: string): Promise<void> {
    const inventory = await this.inventoryRepository.findById(id);

    if (!inventory) {
      throw new Error('Inventory not found');
    }

    if (inventory.quantity !== 0) {
      throw new Error('Não é possível excluir estoques com quantidade diferente de zero.');
    }

    await this.inventoryRepository.delete(id);
  }
}
