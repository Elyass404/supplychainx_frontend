export interface Supplier {
  id?: number; // Optional because we don't have an ID when creating new one
  name: string;
  email: string;
  rating: number;
  leadTime: number;
}