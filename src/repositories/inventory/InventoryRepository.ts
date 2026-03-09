import { Inventory } from '../../entities/inventory/Inventory';

export interface InventoryRepository {
  findByProductAndBranch(productId: string, branchId: string): Promise<Inventory | null>;
  findAll(): Promise<Inventory[]>;
  findByBranch(branchId: string): Promise<Inventory[]>;
  findByProduct(productId: string): Promise<Inventory[]>;
  updateQuantity(productId: string, branchId: string, quantityChange: number): Promise<Inventory>;
  setQuantity(productId: string, branchId: string, quantity: number): Promise<Inventory>;
}
