import { Branch } from '../../entities/branches/Branch';
import { BranchRepository } from '../../repositories/branches/BranchRepository';

interface UpdateBranchRequest {
  id: string;
  name?: string;
  address?: string;
  phoneNumber?: string | null;
  email?: string | null;
}

export class UpdateBranchUseCase {
  constructor(private branchRepository: BranchRepository) { }

  async execute(request: UpdateBranchRequest): Promise<Branch> {
    const { id, ...data } = request;
    const branch = await this.branchRepository.findById(id);

    if (!branch) {
      throw new Error('Branch not found');
    }

    if (data.email && data.email !== branch.email) {
      const branchAlreadyExists = await this.branchRepository.findByEmail(data.email);
      if (branchAlreadyExists) {
        throw new Error('Branch with this email already exists');
      }
    }

    if (data.name && data.name !== branch.name) {
      const nameAlreadyExists = await this.branchRepository.findByName(data.name);
      if (nameAlreadyExists) {
        throw new Error('Branch with this name already exists');
      }
    }

    return this.branchRepository.update(id, data);
  }
}
