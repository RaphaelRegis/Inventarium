import { ProductRepository } from '../../repositories/products/ProductRepository';
import { Product } from '../../entities/products/Product';
import { Prisma } from '@prisma/client';

interface UpdateProductRequest {
  name?: string;
  description?: string | null;
  remarks?: string | null;
  purchasePrice?: number | Prisma.Decimal;
  retailPrice?: number | Prisma.Decimal;
  supplierIds?: string[];
}

export class UpdateProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(id: string, request: UpdateProductRequest): Promise<Product> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new Error('Product not found');
    }

    if (request.name && request.name !== product.name) {
      const nameAlreadyExists = await this.productRepository.findByName(request.name);
      if (nameAlreadyExists) {
        throw new Error('Product with this name already exists');
      }
    }

    const { supplierIds, ...productData } = request;

    return this.productRepository.update(id, productData, supplierIds);
  }
}
