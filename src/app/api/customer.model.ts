export interface Customer {
  id: number;
  name: string;      // 3-100 chars
  address: string;   // 10-255 chars
  city: string;      // 2-50 chars
  activeOrderCount?: number;
  hasActiveOrders?: boolean; // Critical for blocking deletion
}

//the request format
export interface CustomerRequest {
  name: string;
  address: string;
  city: string;
}

// For pagination 
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // Current page index
}

// The State structure defined in the Brief 
export interface CustomerState {
  customers: Customer[];
  selectedCustomer: Customer | null;
  totalElements: number;
  totalPages: number;
  
  // Search & Pagination params
  query: {
    page: number;
    size: number;
    sort: string;
    search: string;
  };

  // Granular Loading States
  loadingList: boolean;
  loadingDetail: boolean;
  loadingCreate: boolean;
  loadingUpdate: boolean;
  loadingDelete: boolean;

  // Error State
  error: {
    operation: string;
    status: number;
    message: string;
  } | null;

  // To track the result of the last action (for Toasts/Navigation)
  lastOperation: {
    type: 'CREATE' | 'UPDATE' | 'DELETE' | null;
    status: 'SUCCESS' | 'FAILURE' | null;
  };
}