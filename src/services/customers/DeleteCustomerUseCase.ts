import { CustomerRepository } from '../../repositories/customers/CustomerRepository';

export class DeleteCustomerUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  async execute(id: string): Promise<void> {
    const customer = await this.customerRepository.findById(id);

    if (!customer) {
      throw new Error('Customer not found');
    }

    await this.customerRepository.delete(id);
  }
}
