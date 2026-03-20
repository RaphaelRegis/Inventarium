import { prisma } from '../../config/prisma';
import { ProductEntry } from '../../entities/product-entries/ProductEntry';
import { CreateProductEntryData, ProductEntryRepository } from './ProductEntryRepository';

export class ProductEntryRepositoryImpl implements ProductEntryRepository {
  async findById(id: string): Promise<ProductEntry | null> {
    const entry = await prisma.productEntry.findUnique({
      where: { id },
      include: {
        supplier: true,
        branch: true,
        items: {
          include: {
            product: true
          }
        }
      },
    });
    return entry as unknown as ProductEntry | null;
  }

  async findAll(): Promise<ProductEntry[]> {
    const entries = await prisma.productEntry.findMany({
      include: {
        supplier: true,
        branch: true,
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    });

    return entries as unknown as ProductEntry[];
  }

  async create(data: CreateProductEntryData): Promise<ProductEntry> {
    const created = await prisma.$transaction(async (tx) => {
      // 1. Create the ProductEntry and its Items
      const entry = await tx.productEntry.create({
        data: {
          supplierId: data.supplierId,
          branchId: data.branchId,
          date: data.date,
          items: {
            create: data.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
            }))
          }
        },
        include: {
          supplier: true,
          branch: true,
          items: {
            include: {
              product: true
            }
          }
        }
      });

      // 2. Update Inventories safely
      for (const item of data.items) {
        // Find if inventory exists for this product in this branch
        const existingInventory = await tx.inventory.findUnique({
          where: {
            productId_branchId: {
              productId: item.productId,
              branchId: data.branchId
            }
          }
        });

        if (existingInventory) {
          // Update existing
          await tx.inventory.update({
            where: { id: existingInventory.id },
            data: {
              quantity: {
                increment: item.quantity
              }
            }
          });
        } else {
          // Create new record
          await tx.inventory.create({
            data: {
              productId: item.productId,
              branchId: data.branchId,
              quantity: item.quantity
            }
          });
        }
      }

      return entry;
    });

    return created as unknown as ProductEntry;
  }
}
