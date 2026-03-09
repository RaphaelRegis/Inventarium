import { Supplier } from '../../entities/suppliers/Supplier';
import { SupplierRepository } from '../../repositories/suppliers/SupplierRepository';

export class GetAllSuppliersUseCase {
  constructor(private supplierRepository: SupplierRepository) {}

  async execute(): Promise<Supplier[]> {
    return this.supplierRepository.findAll();
  }
}
