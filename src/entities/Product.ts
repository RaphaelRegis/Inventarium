export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  sku: string;
  createdAt: Date;
  updatedAt: Date;
}
