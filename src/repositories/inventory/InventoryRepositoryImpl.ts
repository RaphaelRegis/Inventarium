import { prisma } from '../../config/prisma';
import { Inventory } from '../../entities/inventory/Inventory';
import { InventoryRepository } from './InventoryRepository';

export class InventoryRepositoryImpl implements InventoryRepository {
  async findByProductAndBranch(productId: string, branchId: string): Promise<Inventory | null> {
    const inventory = await prisma.inventory.findUnique({
      where: {
        productId_branchId: { productId, branchId },
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

  async findByBranch(branchId: string): Promise<Inventory[]> {
    const inventories = await prisma.inventory.findMany({
      where: { branchId },
      include: { product: true },
    });
    return inventories as unknown as Inventory[];
  }

  async findByProduct(productId: string): Promise<Inventory[]> {
    const inventories = await prisma.inventory.findMany({
      where: { productId },
      include: { branch: true },
    });
    return inventories as unknown as Inventory[];
  }

  async updateQuantity(productId: string, branchId: string, quantityChange: number): Promise<Inventory> {
    const inventory = await prisma.inventory.upsert({
      where: {
        productId_branchId: { productId, branchId },
      },
      update: {
        quantity: {
          increment: quantityChange,
        },
      },
      create: {
        productId,
        branchId,
        quantity: quantityChange,
      },
      include: { product: true, branch: true },
    });
    return inventory as unknown as Inventory;
  }

  async setQuantity(productId: string, branchId: string, quantity: number): Promise<Inventory> {
    const inventory = await prisma.inventory.upsert({
      where: {
        productId_branchId: { productId, branchId },
      },
      update: {
        quantity,
      },
      create: {
        productId,
        branchId,
        quantity,
      },
      include: { product: true, branch: true },
    });
    return inventory as unknown as Inventory;
  }
}
