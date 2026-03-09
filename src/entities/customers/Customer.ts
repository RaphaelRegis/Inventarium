import { Prisma } from '@prisma/client';

export interface Customer {
  id: string;
  name: string;
  address: string;
  phoneNumber?: string | null;
  email?: string | null;
  debt: number | Prisma.Decimal;
  createdAt: Date;
  updatedAt: Date;
}
