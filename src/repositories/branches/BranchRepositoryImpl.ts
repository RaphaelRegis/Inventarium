import { prisma } from '../../config/prisma';
import { Branch } from '../../entities/branches/Branch';
import { BranchRepository } from './BranchRepository';

export class BranchRepositoryImpl implements BranchRepository {
  async findById(id: string): Promise<Branch | null> {
    const branch = await prisma.branch.findUnique({
      where: { id },
    });
    return branch as Branch | null;
  }

  async findByName(name: string): Promise<Branch | null> {
    const branch = await prisma.branch.findFirst({
      where: { name },
    });
    return branch as Branch | null;
  }

  async findByEmail(email: string): Promise<Branch | null> {
    const branch = await prisma.branch.findUnique({
      where: { email: email || undefined },
    });
    return branch as Branch | null;
  }

  async findAll(): Promise<Branch[]> {
    const branches = await prisma.branch.findMany();
    return branches as Branch[];
  }

  async create(branch: Omit<Branch, 'id' | 'createdAt' | 'updatedAt'>): Promise<Branch> {
    const created = await prisma.branch.create({
      data: branch,
    });
    return created as Branch;
  }

  async update(id: string, branch: Partial<Omit<Branch, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Branch> {
    const updated = await prisma.branch.update({
      where: { id },
      data: branch,
    });
    return updated as Branch;
  }

  async delete(id: string): Promise<void> {
    await prisma.branch.delete({
      where: { id },
    });
  }
}
