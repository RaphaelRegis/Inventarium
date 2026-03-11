import { Supplier } from '../../entities/suppliers/Supplier';
import { SupplierRepository } from '../../repositories/suppliers/SupplierRepository';
import { Prisma } from '@prisma/client';

interface UpdateSupplierRequest {
  id: string;
  name?: string;
  phoneNumber?: string | null;
  email?: string | null;
  website?: string | null;
  debt?: number | Prisma.Decimal;
}

export class UpdateSupplierUseCase {
  constructor(private supplierRepository: SupplierRepository) { }

  async execute(request: UpdateSupplierRequest): Promise<Supplier> {
    const { id, ...data } = request;
    const supplier = await this.supplierRepository.findById(id);

    if (!supplier) {
      throw new Error('Supplier not found');
    }

    if (data.email && data.email !== supplier.email) {
      const supplierAlreadyExists = await this.supplierRepository.findByEmail(data.email);
      if (supplierAlreadyExists) {
        throw new Error('Supplier with this email already exists');
      }
    }

    if (data.name && data.name !== supplier.name) {
      const nameAlreadyExists = await this.supplierRepository.findByName(data.name);
      if (nameAlreadyExists) {
        throw new Error('Supplier with this name already exists');
      }
    }

    return this.supplierRepository.update(id, data as any);
  }
}
