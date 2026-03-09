import { Branch } from '../../entities/branches/Branch';

export interface BranchRepository {
  findById(id: string): Promise<Branch | null>;
  findByName(name: string): Promise<Branch | null>;
  findByEmail(email: string): Promise<Branch | null>;
  findAll(): Promise<Branch[]>;
  create(branch: Omit<Branch, 'id' | 'createdAt' | 'updatedAt'>): Promise<Branch>;
  update(id: string, branch: Partial<Omit<Branch, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Branch>;
  delete(id: string): Promise<void>;
}
