import { Branch } from '../../entities/branches/Branch';
import { BranchRepository } from '../../repositories/branches/BranchRepository';

interface UpdateBranchRequest {
  name?: string;
  address?: string;
  phoneNumber?: string | null;
  email?: string | null;
}

export class UpdateBranchUseCase {
  constructor(private branchRepository: BranchRepository) {}

  async execute(id: string, request: UpdateBranchRequest): Promise<Branch> {
    const branch = await this.branchRepository.findById(id);

    if (!branch) {
      throw new Error('Branch not found');
    }

    if (request.email && request.email !== branch.email) {
      const branchAlreadyExists = await this.branchRepository.findByEmail(request.email);
      if (branchAlreadyExists) {
        throw new Error('Branch with this email already exists');
      }
    }

    if (request.name && request.name !== branch.name) {
      const nameAlreadyExists = await this.branchRepository.findByName(request.name);
      if (nameAlreadyExists) {
        throw new Error('Branch with this name already exists');
      }
    }

    return this.branchRepository.update(id, request);
  }
}
