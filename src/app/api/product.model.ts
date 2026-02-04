export interface Product {
  id: number;
  name: string;
  productionTime: number; // In minutes or hours (context dependent)
  cost: number;
  stock: number;
}