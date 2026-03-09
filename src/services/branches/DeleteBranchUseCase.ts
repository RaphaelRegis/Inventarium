import { BranchRepository } from '../../repositories/branches/BranchRepository';

export class DeleteBranchUseCase {
  constructor(private branchRepository: BranchRepository) {}

  async execute(id: string): Promise<void> {
    const branch = await this.branchRepository.findById(id);

    if (!branch) {
      throw new Error('Branch not found');
    }

    await this.branchRepository.delete(id);
  }
}
