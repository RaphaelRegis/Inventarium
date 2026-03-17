'use server';

import { InventoryRepositoryImpl } from '@/repositories/inventories/InventoryRepositoryImpl';
import { GetAllInventoriesUseCase } from '@/services/inventories/GetAllInventoriesUseCase';
import { CreateInventoryUseCase } from '@/services/inventories/CreateInventoryUseCase';
import { DeleteInventoryUseCase } from '@/services/inventories/DeleteInventoryUseCase';
import { revalidatePath } from 'next/cache';

const inventoryRepository = new InventoryRepositoryImpl();

export async function fetchAllInventories() {
    const useCase = new GetAllInventoriesUseCase(inventoryRepository);
    return await useCase.execute();
}

export async function createInventories(productId: string, branchIds: string[]) {
    const useCase = new CreateInventoryUseCase(inventoryRepository);
    const inventories = await useCase.execute({ productId, branchIds });
    revalidatePath('/inventories');
    return inventories;
}

export async function deleteInventory(id: string) {
    const useCase = new DeleteInventoryUseCase(inventoryRepository);
    await useCase.execute(id);
    revalidatePath('/inventories');
}
