import { Customer } from '../../entities/customers/Customer';
import { CustomerRepository } from '../../repositories/customers/CustomerRepository';

export class GetAllCustomersUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  async execute(): Promise<Customer[]> {
    return this.customerRepository.findAll();
  }
}
