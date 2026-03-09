import { prisma } from '../../config/prisma';
import { Product } from '../../entities/products/Product';
import { ProductRepository } from './ProductRepository';

export class ProductRepositoryImpl implements ProductRepository {
  async findById(id: string): Promise<Product | null> {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { suppliers: true },
    });
    return product as unknown as Product | null;
  }

  async findByName(name: string): Promise<Product | null> {
    const product = await prisma.product.findFirst({
      where: { name },
      include: { suppliers: true },
    });
    return product as unknown as Product | null;
  }

  async findAll(): Promise<Product[]> {
    const products = await prisma.product.findMany({
      include: { suppliers: true },
    });
    return products as unknown as Product[];
  }

  async create(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'suppliers'>, supplierIds: string[]): Promise<Product> {
    const created = await prisma.product.create({
      data: {
        ...product,
        suppliers: {
          connect: supplierIds.map((id) => ({ id })),
        },
      } as any,
      include: { suppliers: true },
    });
    return created as unknown as Product;
  }

  async update(id: string, product: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'suppliers'>>, supplierIds?: string[]): Promise<Product> {
    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...product,
        suppliers: supplierIds ? {
          set: supplierIds.map((sid) => ({ id: sid })),
        } : undefined,
      } as any,
      include: { suppliers: true },
    });
    return updated as unknown as Product;
  }

  async delete(id: string): Promise<void> {
    await prisma.product.delete({
      where: { id },
    });
  }
}
