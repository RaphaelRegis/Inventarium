'use server';

import { prisma } from '@/config/prisma';
import { UserRepositoryImpl } from '@/repositories/users/UserRepositoryImpl';
import { GetAllUsersUseCase } from '@/services/users/GetAllUsersUseCase';
import { CreateUserUseCase } from '@/services/users/CreateUserUseCase';
import { UpdateUserUseCase } from '@/services/users/UpdateUserUseCase';
import { DeleteUserUseCase } from '@/services/users/DeleteUserUseCase';
import { User } from '@/entities/users/User';
import { revalidatePath } from 'next/cache';

const userRepository = new UserRepositoryImpl(prisma);

export async function fetchAllUsers() {
  const useCase = new GetAllUsersUseCase(userRepository);
  return await useCase.execute();
}

export async function createUser(data: Partial<User>) {
  const useCase = new CreateUserUseCase(userRepository);
  const user = await useCase.execute(data as any);
  revalidatePath('/users');
  return user;
}

export async function updateUser(id: string, data: Partial<User>) {
  const useCase = new UpdateUserUseCase(userRepository);
  const user = await useCase.execute(id, data as any);
  revalidatePath('/users');
  return user;
}

export async function deleteUser(id: string) {
  const useCase = new DeleteUserUseCase(userRepository);
  await useCase.execute(id);
  revalidatePath('/users');
}
