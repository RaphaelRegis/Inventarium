import { Customer } from '../../entities/customers/Customer';

export interface CustomerRepository {
  findById(id: string): Promise<Customer | null>;
  findByName(name: string): Promise<Customer | null>;
  findByEmail(email: string): Promise<Customer | null>;
  findAll(): Promise<Customer[]>;
  create(customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Customer>;
  update(id: string, customer: Partial<Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Customer>;
  delete(id: string): Promise<void>;
}
