import { prisma } from '../../config/prisma';
import { ProductEntry } from '../../entities/entries/ProductEntry';
import { ProductEntryRepository, CreateProductEntryRequest } from './ProductEntryRepository';

export class ProductEntryRepositoryImpl implements ProductEntryRepository {
  async findById(id: string): Promise<ProductEntry | null> {
    const entry = await prisma.productEntry.findUnique({
      where: { id },
      include: {
        supplier: true,
        branch: true,
        items: {
          include: { product: true },
        },
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
          include: { product: true },
        },
      },
      orderBy: { date: 'desc' },
    });
    return entries as unknown as ProductEntry[];
  }

  async create(request: CreateProductEntryRequest): Promise<ProductEntry> {
    const created = await prisma.productEntry.create({
      data: {
        date: request.date || new Date(),
        supplierId: request.supplierId,
        branchId: request.branchId,
        items: {
          create: request.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        supplier: true,
        branch: true,
        items: {
          include: { product: true },
        },
      },
    });
    return created as unknown as ProductEntry;
  }

  async delete(id: string): Promise<void> {
    await prisma.productEntry.delete({
      where: { id },
    });
  }
}
