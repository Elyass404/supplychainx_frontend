export interface Supplier {
  id: number;
  name: string;
  email: string;
  rating: number;
  leadTime: number;
}

export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number; // Current Page Number
}