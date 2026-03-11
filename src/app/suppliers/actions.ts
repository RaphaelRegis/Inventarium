'use server';

import { SupplierRepositoryImpl } from '@/repositories/suppliers/SupplierRepositoryImpl';
import { GetAllSuppliersUseCase } from '@/services/suppliers/GetAllSuppliersUseCase';
import { CreateSupplierUseCase } from '@/services/suppliers/CreateSupplierUseCase';
import { UpdateSupplierUseCase } from '@/services/suppliers/UpdateSupplierUseCase';
import { DeleteSupplierUseCase } from '@/services/suppliers/DeleteSupplierUseCase';
import { Supplier } from '@/entities/suppliers/Supplier';
import { revalidatePath } from 'next/cache';

const supplierRepository = new SupplierRepositoryImpl();

export async function fetchAllSuppliers() {
    const useCase = new GetAllSuppliersUseCase(supplierRepository);
    return await useCase.execute();
}

export async function createSupplier(data: Partial<Supplier>) {
    const useCase = new CreateSupplierUseCase(supplierRepository);
    const supplier = await useCase.execute(data as any);
    revalidatePath('/suppliers');
    return supplier;
}

export async function updateSupplier(id: string, data: Partial<Supplier>) {
    const useCase = new UpdateSupplierUseCase(supplierRepository);
    const supplier = await useCase.execute({ id, ...data } as any);
    revalidatePath('/suppliers');
    return supplier;
}

export async function deleteSupplier(id: string) {
    const useCase = new DeleteSupplierUseCase(supplierRepository);
    await useCase.execute(id);
    revalidatePath('/suppliers');
}
