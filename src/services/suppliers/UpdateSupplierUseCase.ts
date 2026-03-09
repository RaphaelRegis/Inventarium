import { Supplier } from '../../entities/suppliers/Supplier';
import { SupplierRepository } from '../../repositories/suppliers/SupplierRepository';
import { Prisma } from '@prisma/client';

interface UpdateSupplierRequest {
  name?: string;
  phoneNumber?: string | null;
  email?: string | null;
  website?: string | null;
  debt?: number | Prisma.Decimal;
}

export class UpdateSupplierUseCase {
  constructor(private supplierRepository: SupplierRepository) {}

  async execute(id: string, request: UpdateSupplierRequest): Promise<Supplier> {
    const supplier = await this.supplierRepository.findById(id);

    if (!supplier) {
      throw new Error('Supplier not found');
    }

    if (request.email && request.email !== supplier.email) {
      const supplierAlreadyExists = await this.supplierRepository.findByEmail(request.email);
      if (supplierAlreadyExists) {
        throw new Error('Supplier with this email already exists');
      }
    }

    if (request.name && request.name !== supplier.name) {
      const nameAlreadyExists = await this.supplierRepository.findByName(request.name);
      if (nameAlreadyExists) {
        throw new Error('Supplier with this name already exists');
      }
    }

    return this.supplierRepository.update(id, request as any);
  }
}
