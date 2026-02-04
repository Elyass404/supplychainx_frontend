export type OrderStatus = 'PENDING' | 'IN_PRODUCTION' | 'COMPLETED' | 'CANCELLED' | 'BLOCKED';

export interface ProductionOrder {
  id: number;
  product: {
    id: number;
    name: string;
  }
  quantity: number;
  startDate: string;
  status: OrderStatus;
}