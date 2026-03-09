import { User } from '../../entities/users/User';
import { UserRepository } from '../../repositories/users/UserRepository';

interface CreateUserRequest {
  name: string;
  email: string;
  taxIdentification: string;
  phoneNumber?: string;
  role: 'ADMIN' | 'STOCKIST';
}

export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(request: CreateUserRequest): Promise<User> {
    const userAlreadyExists = await this.userRepository.findByEmail(request.email);

    if (userAlreadyExists) {
      throw new Error('User with this email already exists');
    }

    const taxIdAlreadyExists = await this.userRepository.findByTaxIdentification(request.taxIdentification);

    if (taxIdAlreadyExists) {
      throw new Error('User with this tax identification already exists');
    }

    return this.userRepository.create(request);
  }
}
