import { Branch } from '../../entities/branches/Branch';
import { BranchRepository } from '../../repositories/branches/BranchRepository';

export class GetBranchByIdUseCase {
  constructor(private branchRepository: BranchRepository) {}

  async execute(id: string): Promise<Branch | null> {
    return this.branchRepository.findById(id);
  }
}
