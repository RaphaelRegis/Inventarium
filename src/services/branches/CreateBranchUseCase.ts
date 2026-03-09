import { Branch } from '../../entities/branches/Branch';
import { BranchRepository } from '../../repositories/branches/BranchRepository';

interface CreateBranchRequest {
  name: string;
  address: string;
  phoneNumber?: string | null;
  email?: string | null;
}

export class CreateBranchUseCase {
  constructor(private branchRepository: BranchRepository) {}

  async execute(request: CreateBranchRequest): Promise<Branch> {
    if (request.email) {
      const branchAlreadyExists = await this.branchRepository.findByEmail(request.email);
      if (branchAlreadyExists) {
        throw new Error('Branch with this email already exists');
      }
    }

    const nameAlreadyExists = await this.branchRepository.findByName(request.name);
    if (nameAlreadyExists) {
      throw new Error('Branch with this name already exists');
    }

    return this.branchRepository.create(request);
  }
}
