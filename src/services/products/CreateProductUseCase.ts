import { Product } from '../../entities/products/Product';
import { ProductRepository } from '../../repositories/products/ProductRepository';
import { Prisma } from '@prisma/client';

interface CreateProductRequest {
  name: string;
  description?: string | null;
  remarks?: string | null;
  purchasePrice: number | Prisma.Decimal;
  retailPrice: number | Prisma.Decimal;
  supplierIds: string[];
  branchIds: string[];
}

export class CreateProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(request: CreateProductRequest): Promise<Product> {
    const nameAlreadyExists = await this.productRepository.findByName(request.name);
    if (nameAlreadyExists) {
      throw new Error('Product with this name already exists');
    }

    const { supplierIds, branchIds, ...productData } = request;

    return this.productRepository.create(productData, supplierIds, branchIds);
  }
}
