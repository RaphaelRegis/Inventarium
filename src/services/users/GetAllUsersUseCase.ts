import { User } from '../../entities/users/User';
import { UserRepository } from '../../repositories/users/UserRepository';

export class GetAllUsersUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(): Promise<User[]> {
    return this.userRepository.findAll();
  }
}
