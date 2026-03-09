import { Prisma } from '@prisma/client';

export interface Supplier {
  id: string;
  name: string;
  phoneNumber?: string | null;
  email?: string | null;
  website?: string | null;
  debt: number | Prisma.Decimal;
  createdAt: Date;
  updatedAt: Date;
}
