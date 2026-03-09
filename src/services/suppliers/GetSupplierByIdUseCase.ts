import { Supplier } from '../../entities/suppliers/Supplier';
import { SupplierRepository } from '../../repositories/suppliers/SupplierRepository';

export class GetSupplierByIdUseCase {
  constructor(private supplierRepository: SupplierRepository) {}

  async execute(id: string): Promise<Supplier | null> {
    return this.supplierRepository.findById(id);
  }
}
