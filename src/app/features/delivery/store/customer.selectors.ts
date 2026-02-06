import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CustomerState } from '../../../api/customer.model';

// Select the entire feature state
export const selectCustomerState = createFeatureSelector<CustomerState>('customer');

// 1. List of Customers
export const selectAllCustomers = createSelector(
  selectCustomerState,
  (state) => state.customers
);

// 2. Loading Flags
export const selectIsLoadingList = createSelector(
  selectCustomerState,
  (state) => state.loadingList
);

// 3. Error Information (For displaying error messages)
export const selectError = createSelector(
  selectCustomerState,
  (state) => state.error
);

// 4. Pagination Info
export const selectPagination = createSelector(
  selectCustomerState,
  (state) => ({
    page: state.query.page,
    size: state.query.size,
    total: state.totalElements,
    totalPages: state.totalPages
  })
);

// 5. Last Operation (Used to trigger Toasts/Navigation in Components)
export const selectLastOperation = createSelector(
  selectCustomerState,
  (state) => state.lastOperation
);