import { createReducer, on } from '@ngrx/store';
import { CustomerState } from '../../../api/customer.model';
import * as CustomerActions from './customer.actions';

export const initialState: CustomerState = {
  customers: [],
  selectedCustomer: null,
  totalElements: 0,
  totalPages: 0,
  
  query: {
    page: 0,
    size: 10,
    sort: 'name,asc',
    search: ''
  },

  // Initial Loading States (All false)
  loadingList: false,
  loadingDetail: false,
  loadingCreate: false,
  loadingUpdate: false,
  loadingDelete: false,

  error: null,
  lastOperation: { type: null, status: null }
};

export const customerReducer = createReducer(
  initialState,

  // --- LIST ACTIONS ---
  on(CustomerActions.loadCustomers, (state) => ({
    ...state,
    loadingList: true,
    error: null
  })),

  on(CustomerActions.loadCustomersSuccess, (state, { response }) => ({
    ...state,
    loadingList: false,
    customers: response.content,
    totalElements: response.totalElements,
    totalPages: response.totalPages
  })),

  on(CustomerActions.loadCustomersFailure, (state, { error }) => ({
    ...state,
    loadingList: false,
    error: { operation: 'LOAD_LIST', status: error.status, message: error.message }
  })),

  // --- DELETE ACTIONS ---
  on(CustomerActions.deleteCustomer, (state) => ({
    ...state,
    loadingDelete: true,
    error: null,
    lastOperation: { type: 'DELETE', status: null }
  })),

  on(CustomerActions.deleteCustomerSuccess, (state) => ({
    ...state,
    loadingDelete: false,
    // We update lastOperation so the Effect knows to show a Toast
    lastOperation: { type: 'DELETE', status: 'SUCCESS' }
  })),

  on(CustomerActions.deleteCustomerFailure, (state, { error }) => ({
    ...state,
    loadingDelete: false,
    error: { operation: 'DELETE', status: error.status, message: error.message },
    lastOperation: { type: 'DELETE', status: 'FAILURE' }
  })),

  // --- CREATE ACTIONS ---
  on(CustomerActions.createCustomer, (state) => ({
    ...state,
    loadingCreate: true,
    error: null,
    lastOperation: { type: 'CREATE', status: null }
  })),

  on(CustomerActions.createCustomerSuccess, (state) => ({
    ...state,
    loadingCreate: false,
    lastOperation: { type: 'CREATE', status: 'SUCCESS' }
  })),

  on(CustomerActions.createCustomerFailure, (state, { error }) => ({
    ...state,
    loadingCreate: false,
    error: { operation: 'CREATE', status: error.status, message: error.message },
    lastOperation: { type: 'CREATE', status: 'FAILURE' }
  }))
);