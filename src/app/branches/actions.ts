'use server';

import { BranchRepositoryImpl } from '@/repositories/branches/BranchRepositoryImpl';
import { GetAllBranchesUseCase } from '@/services/branches/GetAllBranchesUseCase';
import { CreateBranchUseCase } from '@/services/branches/CreateBranchUseCase';
import { UpdateBranchUseCase } from '@/services/branches/UpdateBranchUseCase';
import { DeleteBranchUseCase } from '@/services/branches/DeleteBranchUseCase';
import { Branch } from '@/entities/branches/Branch';
import { revalidatePath } from 'next/cache';

const branchRepository = new BranchRepositoryImpl();

export async function fetchAllBranches() {
    const useCase = new GetAllBranchesUseCase(branchRepository);
    return await useCase.execute();
}

export async function createBranch(data: Partial<Branch>) {
    const useCase = new CreateBranchUseCase(branchRepository);
    const branch = await useCase.execute(data as any);
    revalidatePath('/branches');
    return branch;
}

export async function updateBranch(id: string, data: Partial<Branch>) {
    const useCase = new UpdateBranchUseCase(branchRepository);
    const branch = await useCase.execute({ id, ...data } as any);
    revalidatePath('/branches');
    return branch;
}

export async function deleteBranch(id: string) {
    const useCase = new DeleteBranchUseCase(branchRepository);
    await useCase.execute(id);
    revalidatePath('/branches');
}
