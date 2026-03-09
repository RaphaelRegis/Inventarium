import { prisma } from '../../config/prisma';
import { Supplier } from '../../entities/suppliers/Supplier';
import { SupplierRepository } from './SupplierRepository';

export class SupplierRepositoryImpl implements SupplierRepository {
  async findById(id: string): Promise<Supplier | null> {
    const supplier = await prisma.supplier.findUnique({
      where: { id },
    });
    return supplier as unknown as Supplier | null;
  }

  async findByName(name: string): Promise<Supplier | null> {
    const supplier = await prisma.supplier.findFirst({
      where: { name },
    });
    return supplier as unknown as Supplier | null;
  }

  async findByEmail(email: string): Promise<Supplier | null> {
    const supplier = await prisma.supplier.findUnique({
      where: { email: email || undefined },
    });
    return supplier as unknown as Supplier | null;
  }

  async findAll(): Promise<Supplier[]> {
    const suppliers = await prisma.supplier.findMany();
    return suppliers as unknown as Supplier[];
  }

  async create(supplier: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>): Promise<Supplier> {
    const created = await prisma.supplier.create({
      data: supplier as any,
    });
    return created as unknown as Supplier;
  }

  async update(id: string, supplier: Partial<Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Supplier> {
    const updated = await prisma.supplier.update({
      where: { id },
      data: supplier as any,
    });
    return updated as unknown as Supplier;
  }

  async delete(id: string): Promise<void> {
    await prisma.supplier.delete({
      where: { id },
    });
  }
}
