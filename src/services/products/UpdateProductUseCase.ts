import { ProductRepository } from '../../repositories/products/ProductRepository';
import { Product } from '../../entities/products/Product';
import { Prisma } from '@prisma/client';

interface UpdateProductRequest {
  id: string;
  name?: string;
  description?: string | null;
  remarks?: string | null;
  purchasePrice?: number | Prisma.Decimal;
  retailPrice?: number | Prisma.Decimal;
  supplierIds?: string[];
}

export class UpdateProductUseCase {
  constructor(private productRepository: ProductRepository) { }

  async execute(request: UpdateProductRequest): Promise<Product> {
    const { id, ...data } = request;
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new Error('Product not found');
    }

    if (data.name && data.name !== product.name) {
      const nameAlreadyExists = await this.productRepository.findByName(data.name);
      if (nameAlreadyExists) {
        throw new Error('Product with this name already exists');
      }
    }

    const { supplierIds, ...productData } = data;

    return this.productRepository.update(id, productData, supplierIds);
  }
}
