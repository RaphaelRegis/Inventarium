import { prisma } from '../../config/prisma';
import { Customer } from '../../entities/customers/Customer';
import { CustomerRepository } from './CustomerRepository';

export class CustomerRepositoryImpl implements CustomerRepository {
  async findById(id: string): Promise<Customer | null> {
    const customer = await prisma.customer.findUnique({
      where: { id },
    });
    return customer as unknown as Customer | null;
  }

  async findByName(name: string): Promise<Customer | null> {
    const customer = await prisma.customer.findFirst({
      where: { name },
    });
    return customer as unknown as Customer | null;
  }

  async findByEmail(email: string): Promise<Customer | null> {
    const customer = await prisma.customer.findUnique({
      where: { email: email || undefined },
    });
    return customer as unknown as Customer | null;
  }

  async findAll(): Promise<Customer[]> {
    const customers = await prisma.customer.findMany();
    return customers as unknown as Customer[];
  }

  async create(customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Customer> {
    const created = await prisma.customer.create({
      data: customer as any,
    });
    return created as unknown as Customer;
  }

  async update(id: string, customer: Partial<Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Customer> {
    const updated = await prisma.customer.update({
      where: { id },
      data: customer as any,
    });
    return updated as unknown as Customer;
  }

  async delete(id: string): Promise<void> {
    await prisma.customer.delete({
      where: { id },
    });
  }
}
