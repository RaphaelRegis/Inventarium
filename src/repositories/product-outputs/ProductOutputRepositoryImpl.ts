import { prisma } from '../../config/prisma';
import { ProductOutput } from '../../entities/product-outputs/ProductOutput';
import { CreateProductOutputData, ProductOutputRepository } from './ProductOutputRepository';

export class ProductOutputRepositoryImpl implements ProductOutputRepository {
  async findById(id: string): Promise<ProductOutput | null> {
    const output = await prisma.productOutput.findUnique({
      where: { id },
      include: {
        customer: true,
        branch: true,
        items: {
          include: {
            product: true
          }
        }
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
          include: {
            product: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    });

    return outputs as unknown as ProductOutput[];
  }

  async create(data: CreateProductOutputData): Promise<ProductOutput> {
    const created = await prisma.$transaction(async (tx) => {
      // 1. Verify and Update Inventories safely
      for (const item of data.items) {
        const inventory = await tx.inventory.findUnique({
          where: {
            productId_branchId: {
              productId: item.productId,
              branchId: data.branchId
            }
          }
        });

        if (!inventory) {
          throw new Error(`Estoque não encontrado para o produto.`);
        }

        if (inventory.quantity < item.quantity) {
          throw new Error(`Sem estoque suficiente. Restante: ${inventory.quantity}`);
        }

        // Subtract existing
        await tx.inventory.update({
          where: { id: inventory.id },
          data: {
            quantity: {
              decrement: item.quantity
            }
          }
        });
      }

      // 2. Create the ProductOutput and its Items
      const output = await tx.productOutput.create({
        data: {
          customerId: data.customerId,
          branchId: data.branchId,
          date: data.date,
          totalValue: data.totalValue,
          items: {
            create: data.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice
            }))
          }
        },
        include: {
          customer: true,
          branch: true,
          items: {
            include: {
              product: true
            }
          }
        }
      });

      // 3. Update Customer Debt
      if (data.customerId) {
        await tx.customer.update({
          where: { id: data.customerId },
          data: {
            debt: {
              increment: data.totalValue
            }
          }
        });
      }

      return output;
    });

    return created as unknown as ProductOutput;
  }
}
