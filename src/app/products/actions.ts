'use server';

import { ProductRepositoryImpl } from '@/repositories/branches/../../repositories/products/ProductRepositoryImpl';
import { GetAllProductsUseCase } from '@/services/products/GetAllProductsUseCase';
import { CreateProductUseCase } from '@/services/products/CreateProductUseCase';
import { UpdateProductUseCase } from '@/services/products/UpdateProductUseCase';
import { DeleteProductUseCase } from '@/services/products/DeleteProductUseCase';
import { Product } from '@/entities/products/Product';
import { revalidatePath } from 'next/cache';

const productRepository = new ProductRepositoryImpl();

export async function fetchAllProducts() {
    const useCase = new GetAllProductsUseCase(productRepository);
    return await useCase.execute();
}

export async function createProduct(data: any) {
    const useCase = new CreateProductUseCase(productRepository);
    const product = await useCase.execute(data);
    revalidatePath('/products');
    return product;
}

export async function updateProduct(id: string, data: any) {
    const useCase = new UpdateProductUseCase(productRepository);
    const product = await useCase.execute({ id, ...data });
    revalidatePath('/products');
    return product;
}

export async function deleteProduct(id: string) {
    const useCase = new DeleteProductUseCase(productRepository);
    await useCase.execute(id);
    revalidatePath('/products');
}
