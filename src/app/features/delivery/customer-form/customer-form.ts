import { Component, OnInit, inject, signal, computed } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';

import * as CustomerActions from '../store/customer.actions';
//  Import selectError to catch API failures
import { selectAllCustomers, selectError } from '../store/customer.selectors'; 

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './customer-form.html',
  styleUrls: []
})
export class CustomerForm implements OnInit {
  
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private route = inject(ActivatedRoute);

  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    address: ['', Validators.required],
    city: ['', Validators.required]
  });

  isEditMode = signal(false);
  currentId: number | null = null;

  // Connect to the Store's error selector
  private errorState = this.store.selectSignal(selectError);

  // Compute the specific message for the HTML
  errorMessage = computed(() => {
    const err = this.errorState();
    // Only show error if it happened during CREATE or UPDATE (ignore unrelated errors)
    if (err && (err.operation === 'CREATE' || err.operation === 'UPDATE')) {
      return err.message;
    }
    return null;
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.currentId = Number(id);
      this.loadDataFromStore(this.currentId);
    }
  }

  loadDataFromStore(id: number) {
    const customers = this.store.selectSignal(selectAllCustomers)();
    const found = customers.find(c => c.id === id);

    if (found) {
      this.form.patchValue(found);
    } else {
      this.store.dispatch(CustomerActions.loadCustomers());
    }
  }

  onSubmit() {
    if (this.form.invalid) return;

    const customerData = this.form.value;

    if (this.isEditMode() && this.currentId) {
      this.store.dispatch(CustomerActions.updateCustomer({ 
        id: this.currentId, 
        customer: customerData 
      }));
    } else {
      this.store.dispatch(CustomerActions.createCustomer({ 
        customer: customerData 
      }));
    }
  }
}

//comment