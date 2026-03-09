export type UserRole = 'ADMIN' | 'STOCKIST';

export interface User {
  id: string;
  name: string;
  email: string;
  taxIdentification: string;
  phoneNumber?: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}
