import { Supplier } from '../../entities/suppliers/Supplier';
import { SupplierRepository } from '../../repositories/suppliers/SupplierRepository';
import { Prisma } from '@prisma/client';

interface CreateSupplierRequest {
  name: string;
  phoneNumber?: string | null;
  email?: string | null;
  website?: string | null;
  debt?: number | Prisma.Decimal;
}

export class CreateSupplierUseCase {
  constructor(private supplierRepository: SupplierRepository) {}

  async execute(request: CreateSupplierRequest): Promise<Supplier> {
    if (request.email) {
      const supplierAlreadyExists = await this.supplierRepository.findByEmail(request.email);
      if (supplierAlreadyExists) {
        throw new Error('Supplier with this email already exists');
      }
    }

    const nameAlreadyExists = await this.supplierRepository.findByName(request.name);
    if (nameAlreadyExists) {
      throw new Error('Supplier with this name already exists');
    }

    const supplierData = {
      ...request,
      debt: request.debt ?? 0,
    };

    return this.supplierRepository.create(supplierData as any);
  }
}
