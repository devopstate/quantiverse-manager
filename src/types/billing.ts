export interface BillItem {
  productId: number;
  productTitle: string;
  purchasePrice: number;
  sellingPrice: number;
  quantity: number;
  total: number;
}

export interface BillingTransaction {
  id: string;
  items: BillItem[];
  total: number;
  date: Date;
  status: 'completed' | 'cancelled';
}