import { createAction, props } from '@ngrx/store';
import { Customer, PageResponse } from '../../../api/customer.model';

// --- LIST ACTIONS ---
export const loadCustomers = createAction(
  '[Customer List] Load Customers'
);

export const loadCustomersSuccess = createAction(
  '[Customer API] Load Customers Success',
  props<{ response: PageResponse<Customer> }>()
);

export const loadCustomersFailure = createAction(
  '[Customer API] Load Customers Failure',
  props<{ error: any }>()
);

export const setSearchParams = createAction(
  '[Customer List] Set Search Params',
  props<{ page?: number; size?: number; sort?: string; search?: string }>()
);

// --- DELETE ACTIONS ---
export const deleteCustomer = createAction(
  '[Customer List] Delete Customer',
  props<{ id: number }>()
);

export const deleteCustomerSuccess = createAction(
  '[Customer API] Delete Customer Success',
  props<{ id: number }>()
);

export const deleteCustomerFailure = createAction(
  '[Customer API] Delete Customer Failure',
  props<{ error: any }>()
);

// --- CREATE ACTIONS ---
export const createCustomer = createAction(
  '[Customer Form] Create Customer',
  props<{ customer: Partial<Customer> }>()
);

export const createCustomerSuccess = createAction(
  '[Customer API] Create Customer Success',
  props<{ customer: Customer }>()
);

export const createCustomerFailure = createAction(
  '[Customer API] Create Customer Failure',
  props<{ error: any }>()
);

// --- UPDATE ACTIONS ---
export const updateCustomer = createAction(
  '[Customer Form] Update Customer',
  props<{ id: number; customer: Partial<Customer> }>()
);

export const updateCustomerSuccess = createAction(
  '[Customer API] Update Customer Success',
  props<{ customer: Customer }>()
);

export const updateCustomerFailure = createAction(
  '[Customer API] Update Customer Failure',
  props<{ error: any }>()
);