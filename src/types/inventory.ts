export interface Product {
  id: number;
  category: string;
  title: string;
  purchasePrice: number;
  sellingPrice: number;
  quantity: number;
  status: string;
  createdAt: Date;
}