import { Branch } from '../../entities/branches/Branch';
import { BranchRepository } from '../../repositories/branches/BranchRepository';

export class GetAllBranchesUseCase {
  constructor(private branchRepository: BranchRepository) {}

  async execute(): Promise<Branch[]> {
    return this.branchRepository.findAll();
  }
}
