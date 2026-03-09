import { User } from '../../entities/users/User';
import { UserRepository } from '../../repositories/users/UserRepository';

export class GetUserByIdUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(id: string): Promise<User | null> {
    const user = await this.userRepository.findById(id);
    
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}
