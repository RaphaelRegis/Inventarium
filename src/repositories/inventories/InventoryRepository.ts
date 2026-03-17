import { Inventory } from '../../entities/inventories/Inventory';

export interface InventoryRepository {
  findById(id: string): Promise<Inventory | null>;
  findByProductAndBranch(productId: string, branchId: string): Promise<Inventory | null>;
  findAll(): Promise<Inventory[]>;
  create(inventory: { productId: string; branchId: string; quantity?: number }): Promise<Inventory>;
  delete(id: string): Promise<void>;
}
