import { Supplier } from '../../entities/suppliers/Supplier';

export interface SupplierRepository {
  findById(id: string): Promise<Supplier | null>;
  findByName(name: string): Promise<Supplier | null>;
  findByEmail(email: string): Promise<Supplier | null>;
  findAll(): Promise<Supplier[]>;
  create(supplier: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>): Promise<Supplier>;
  update(id: string, supplier: Partial<Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Supplier>;
  delete(id: string): Promise<void>;
}
