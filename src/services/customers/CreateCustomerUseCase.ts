import { Customer } from '../../entities/customers/Customer';
import { CustomerRepository } from '../../repositories/customers/CustomerRepository';
import { Prisma } from '@prisma/client';

interface CreateCustomerRequest {
  name: string;
  address: string;
  phoneNumber?: string | null;
  email?: string | null;
  debt?: number | Prisma.Decimal;
}

export class CreateCustomerUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  async execute(request: CreateCustomerRequest): Promise<Customer> {
    if (request.email) {
      const customerAlreadyExists = await this.customerRepository.findByEmail(request.email);
      if (customerAlreadyExists) {
        throw new Error('Customer with this email already exists');
      }
    }

    const nameAlreadyExists = await this.customerRepository.findByName(request.name);
    if (nameAlreadyExists) {
      throw new Error('Customer with this name already exists');
    }

    const customerData = {
      ...request,
      debt: request.debt ?? 0,
    };

    return this.customerRepository.create(customerData as any);
  }
}
