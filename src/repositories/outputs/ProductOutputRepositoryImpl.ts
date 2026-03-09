import { prisma } from '../../config/prisma';
import { ProductOutput } from '../../entities/outputs/ProductOutput';
import { ProductOutputRepository, CreateProductOutputRequest } from './ProductOutputRepository';

export class ProductOutputRepositoryImpl implements ProductOutputRepository {
  async findById(id: string): Promise<ProductOutput | null> {
    const output = await prisma.productOutput.findUnique({
      where: { id },
      include: {
        customer: true,
        branch: true,
        items: {
          include: { product: true },
        },
      },
    });
    return output as unknown as ProductOutput | null;
  }

  async findAll(): Promise<ProductOutput[]> {
    const outputs = await prisma.productOutput.findMany({
      include: {
        customer: true,
        branch: true,
        items: {
          include: { product: true },
        },
      },
      orderBy: { date: 'desc' },
    });
    return outputs as unknown as ProductOutput[];
  }

  async create(request: CreateProductOutputRequest): Promise<ProductOutput> {
    const created = await prisma.productOutput.create({
      data: {
        date: request.date || new Date(),
        customerId: request.customerId,
        branchId: request.branchId,
        totalValue: request.totalValue as any,
        items: {
          create: request.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice as any,
          })),
        },
      },
      include: {
        customer: true,
        branch: true,
        items: {
          include: { product: true },
        },
      },
    });
    return created as unknown as ProductOutput;
  }

  async delete(id: string): Promise<void> {
    await prisma.productOutput.delete({
      where: { id },
    });
  }
}
