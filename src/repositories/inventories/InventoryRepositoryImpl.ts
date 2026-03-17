import { prisma } from '../../config/prisma';
import { Inventory } from '../../entities/inventories/Inventory';
import { InventoryRepository } from './InventoryRepository';

export class InventoryRepositoryImpl implements InventoryRepository {
  async findById(id: string): Promise<Inventory | null> {
    const inventory = await prisma.inventory.findUnique({
      where: { id },
      include: { product: true, branch: true },
    });
    return inventory as unknown as Inventory | null;
  }

  async findByProductAndBranch(productId: string, branchId: string): Promise<Inventory | null> {
    const inventory = await prisma.inventory.findUnique({
      where: {
        productId_branchId: {
          productId,
          branchId,
        },
      },
      include: { product: true, branch: true },
    });
    return inventory as unknown as Inventory | null;
  }

  async findAll(): Promise<Inventory[]> {
    const inventories = await prisma.inventory.findMany({
      include: { product: true, branch: true },
    });
    return inventories as unknown as Inventory[];
  }

  async create(data: { productId: string; branchId: string; quantity?: number }): Promise<Inventory> {
    const created = await prisma.inventory.create({
      data: {
        productId: data.productId,
        branchId: data.branchId,
        quantity: data.quantity ?? 0,
      },
      include: { product: true, branch: true },
    });
    return created as unknown as Inventory;
  }

  async delete(id: string): Promise<void> {
    await prisma.inventory.delete({
      where: { id },
    });
  }
}
