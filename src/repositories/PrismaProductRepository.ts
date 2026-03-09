import { prisma } from '../config/prisma';
import { Product } from '../entities/Product';
import { IProductRepository } from './IProductRepository';

export class PrismaProductRepository implements IProductRepository {
  async findById(id: string): Promise<Product | null> {
    return prisma.product.findUnique({
      where: { id },
    });
  }

  async findAll(): Promise<Product[]> {
    return prisma.product.findMany();
  }

  async create(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    return prisma.product.create({
      data: product,
    });
  }

  async update(id: string, product: Partial<Product>): Promise<Product> {
    return prisma.product.update({
      where: { id },
      data: product,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.product.delete({
      where: { id },
    });
  }
}
