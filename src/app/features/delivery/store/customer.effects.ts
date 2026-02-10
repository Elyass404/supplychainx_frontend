import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CustomerService } from '../../../api/customer.service';
import * as CustomerActions from './customer.actions';
import { catchError, map, mergeMap, tap, of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class CustomerEffects {

  private actions$ = inject(Actions);
  private customerService = inject(CustomerService);
  private router = inject(Router);

  // LOAD LIST
  // Listens for '[Customer List] Load Customers' -> Calls API -> Returns Success/Failure
  loadCustomers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.loadCustomers),
      mergeMap(() =>
        this.customerService.getAll().pipe(
          map(customers => {
            // Mapping array to PageResponse format required by the Reducer
            // (Since your current service returns Customer[], we wrap it)
            return CustomerActions.loadCustomersSuccess({
              response: {
                content: customers,
                totalElements: customers.length,
                totalPages: 1,
                size: customers.length,
                number: 0
              }
            });
          }),
          catchError(error => of(CustomerActions.loadCustomersFailure({ error })))
        )
      )
    )
  );

  // DELETE
  // Listens for 'Delete Customer' -> Calls API -> Returns Success -> Reloads List
  deleteCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.deleteCustomer),
      mergeMap(({ id }) =>
        this.customerService.delete(id).pipe(
          map(() => CustomerActions.deleteCustomerSuccess({ id })),
          catchError(error => of(CustomerActions.deleteCustomerFailure({ error })))
        )
      )
    )
  );

  // Refreshes the list automatically after a successful delete
  reloadAfterDelete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.deleteCustomerSuccess),
      map(() => CustomerActions.loadCustomers())
    )
  );

  // CREATE
  // Listens for 'Create Customer' -> Calls API -> Navigate to List
  createCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.createCustomer),
      mergeMap(({ customer }) =>
        // Cast to any to bypass strict type mismatch if any
        this.customerService.create(customer as any).pipe(
          map(newCustomer => CustomerActions.createCustomerSuccess({ customer: newCustomer })),
          catchError(error => of(CustomerActions.createCustomerFailure({ error })))
        )
      )
    )
  );

  // Navigation Side Effect: Redirects to list on success
  createSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.createCustomerSuccess),
      tap(() => this.router.navigate(['/delivery/customers']))
    ),
    { dispatch: false } // No new action is dispatched
  );

  //  UPDATE
  // Listens for 'Update Customer' -> Calls API -> Navigate to List
  updateCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.updateCustomer),
      mergeMap(({ id, customer }) =>
        this.customerService.update(id, customer as any).pipe(
          map(updated => CustomerActions.updateCustomerSuccess({ customer: updated })),
          catchError(error => of(CustomerActions.updateCustomerFailure({ error })))
        )
      )
    )
  );

  updateSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.updateCustomerSuccess),
      tap(() => this.router.navigate(['/delivery/customers']))
    ),
    { dispatch: false }
  );
}