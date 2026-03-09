import { Customer } from '../../entities/customers/Customer';
import { CustomerRepository } from '../../repositories/customers/CustomerRepository';
import { Prisma } from '@prisma/client';

interface UpdateCustomerRequest {
  name?: string;
  address?: string;
  phoneNumber?: string | null;
  email?: string | null;
  debt?: number | Prisma.Decimal;
}

export class UpdateCustomerUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  async execute(id: string, request: UpdateCustomerRequest): Promise<Customer> {
    const customer = await this.customerRepository.findById(id);

    if (!customer) {
      throw new Error('Customer not found');
    }

    if (request.email && request.email !== customer.email) {
      const customerAlreadyExists = await this.customerRepository.findByEmail(request.email);
      if (customerAlreadyExists) {
        throw new Error('Customer with this email already exists');
      }
    }

    if (request.name && request.name !== customer.name) {
      const nameAlreadyExists = await this.customerRepository.findByName(request.name);
      if (nameAlreadyExists) {
        throw new Error('Customer with this name already exists');
      }
    }

    return this.customerRepository.update(id, request as any);
  }
}
