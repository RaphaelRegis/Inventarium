import { prisma } from '../../config/prisma';
import { User } from '../../entities/users/User';
import { UserRepository } from './UserRepository';

export class UserRepositoryImpl implements UserRepository {
  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    return user as User | null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user as User | null;
  }

  async findByTaxIdentification(taxIdentification: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { taxIdentification },
    });
    return user as User | null;
  }

  async findAll(): Promise<User[]> {
    const users = await prisma.user.findMany();
    return users as User[];
  }

  async create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const created = await prisma.user.create({
      data: user,
    });
    return created as User;
  }

  async update(id: string, user: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>): Promise<User> {
    const updated = await prisma.user.update({
      where: { id },
      data: user,
    });
    return updated as User;
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id },
    });
  }
}
