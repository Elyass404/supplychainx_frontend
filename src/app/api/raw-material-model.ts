export interface RawMaterial {
  id: number;
  name: string;
  stock: number;
  stockMin: number;
  unit: string;
  supplierIds: number[];
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}