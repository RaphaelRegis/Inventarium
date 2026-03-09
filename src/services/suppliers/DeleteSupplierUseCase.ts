import { SupplierRepository } from '../../repositories/suppliers/SupplierRepository';

export class DeleteSupplierUseCase {
  constructor(private supplierRepository: SupplierRepository) {}

  async execute(id: string): Promise<void> {
    const supplier = await this.supplierRepository.findById(id);

    if (!supplier) {
      throw new Error('Supplier not found');
    }

    await this.supplierRepository.delete(id);
  }
}
