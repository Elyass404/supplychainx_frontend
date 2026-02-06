import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';

// Import Actions and Selectors
import * as CustomerActions from '../store/customer.actions';
import { 
  selectAllCustomers, 
  selectIsLoadingList 
} from '../store/customer.selectors';
import { Customer } from '../../../api/customer.model';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './customer-list.html',
  styleUrls: []
})
export class CustomerList implements OnInit {

  private store = inject(Store);

  // 1. Select Data from Store (No more manual signals!)
  // 'selectSignal' automatically updates the UI whenever the store changes.
  customers = this.store.selectSignal(selectAllCustomers);
  isLoading = this.store.selectSignal(selectIsLoadingList);

  ngOnInit() {
    // 2. Dispatch Action to Load Data
    // We don't subscribe here. We just say "Go load them."
    this.store.dispatch(CustomerActions.loadCustomers());
  }

  onDelete(customer: Customer) {
    if (confirm(`Delete customer ${customer.name}?`)) {
      // 3. Dispatch Delete Action
      // The Effect handles the API call and the auto-reload
      this.store.dispatch(CustomerActions.deleteCustomer({ id: customer.id }));
    }
  }
}