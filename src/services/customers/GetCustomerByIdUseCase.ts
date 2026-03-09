import { Customer } from '../../entities/customers/Customer';
import { CustomerRepository } from '../../repositories/customers/CustomerRepository';

export class GetCustomerByIdUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  async execute(id: string): Promise<Customer | null> {
    return this.customerRepository.findById(id);
  }
}
