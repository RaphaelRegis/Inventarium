'use server';

import { ProductEntryRepositoryImpl } from '@/repositories/product-entries/ProductEntryRepositoryImpl';
import { GetAllProductEntriesUseCase } from '@/services/product-entries/GetAllProductEntriesUseCase';
import { CreateProductEntryUseCase } from '@/services/product-entries/CreateProductEntryUseCase';
import { CreateProductEntryData } from '@/repositories/product-entries/ProductEntryRepository';
import { revalidatePath } from 'next/cache';

const repository = new ProductEntryRepositoryImpl();

export async function fetchAllProductEntries() {
    const useCase = new GetAllProductEntriesUseCase(repository);
    return await useCase.execute();
}

export async function createProductEntry(data: CreateProductEntryData) {
    const useCase = new CreateProductEntryUseCase(repository);
    const entry = await useCase.execute(data);
    revalidatePath('/product-entries');
    return entry;
}
