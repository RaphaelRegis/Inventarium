import { Customer } from '../../entities/customers/Customer';
import { CustomerRepository } from '../../repositories/customers/CustomerRepository';
import { Prisma } from '@prisma/client';

interface UpdateCustomerRequest {
  id: string;
  name?: string;
  address?: string;
  phoneNumber?: string | null;
  email?: string | null;
  debt?: number | Prisma.Decimal;
}

export class UpdateCustomerUseCase {
  constructor(private customerRepository: CustomerRepository) { }

  async execute(request: UpdateCustomerRequest): Promise<Customer> {
    const { id, ...data } = request;
    const customer = await this.customerRepository.findById(id);

    if (!customer) {
      throw new Error('Customer not found');
    }

    if (data.email && data.email !== customer.email) {
      const customerAlreadyExists = await this.customerRepository.findByEmail(data.email);
      if (customerAlreadyExists) {
        throw new Error('Customer with this email already exists');
      }
    }

    if (data.name && data.name !== customer.name) {
      const nameAlreadyExists = await this.customerRepository.findByName(data.name);
      if (nameAlreadyExists) {
        throw new Error('Customer with this name already exists');
      }
    }

    return this.customerRepository.update(id, data as any);
  }
}
