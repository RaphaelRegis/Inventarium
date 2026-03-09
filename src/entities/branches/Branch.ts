export interface Branch {
  id: string;
  name: string;
  address: string;
  phoneNumber?: string | null;
  email?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
