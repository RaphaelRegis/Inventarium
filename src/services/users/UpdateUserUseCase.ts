import { User } from '../../entities/users/User';
import { UserRepository } from '../../repositories/users/UserRepository';

interface UpdateUserRequest {
  id: string;
  name?: string;
  email?: string;
  taxIdentification?: string;
  phoneNumber?: string;
  role?: 'ADMIN' | 'STOCKIST';
}

export class UpdateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(request: UpdateUserRequest): Promise<User> {
    const { id, ...data } = request;

    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new Error('User not found');
    }

    if (data.email) {
      const userWithEmail = await this.userRepository.findByEmail(data.email);
      if (userWithEmail && userWithEmail.id !== id) {
        throw new Error('Email already in use by another user');
      }
    }

    if (data.taxIdentification) {
      const userWithTaxId = await this.userRepository.findByTaxIdentification(data.taxIdentification);
      if (userWithTaxId && userWithTaxId.id !== id) {
        throw new Error('Tax identification already in use by another user');
      }
    }

    return this.userRepository.update(id, data);
  }
}
