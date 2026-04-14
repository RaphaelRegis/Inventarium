'use server';

import { ProductOutputRepositoryImpl } from '@/repositories/product-outputs/ProductOutputRepositoryImpl';
import { GetAllProductOutputsUseCase } from '@/services/product-outputs/GetAllProductOutputsUseCase';
import { CreateProductOutputUseCase } from '@/services/product-outputs/CreateProductOutputUseCase';
import { CreateProductOutputData } from '@/repositories/product-outputs/ProductOutputRepository';
import { revalidatePath } from 'next/cache';

const repository = new ProductOutputRepositoryImpl();

export async function fetchAllProductOutputs() {
    const useCase = new GetAllProductOutputsUseCase(repository);
    return await useCase.execute();
}

export async function createProductOutput(data: CreateProductOutputData) {
    const useCase = new CreateProductOutputUseCase(repository);
    const output = await useCase.execute(data);
    
    // We update both inventories and customers in db, so we should revalidate those paths as well if caching is tricky
    revalidatePath('/product-outputs');
    revalidatePath('/inventories');
    revalidatePath('/customers');
    
    return output;
}
