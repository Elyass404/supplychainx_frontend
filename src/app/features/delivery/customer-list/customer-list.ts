import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CustomerService } from '../../../api/customer.service';
import { Customer } from '../../../api/customer.model';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './customer-list.html',
  styleUrls: []
})
export class CustomerList implements OnInit {

  private customerService = inject(CustomerService);
  customers = signal<Customer[]>([]);
  isLoading = signal(true);

  ngOnInit() {
    this.loadCustomers();
  }

  loadCustomers() {
    this.isLoading.set(true);
    this.customerService.getAll().subscribe({
      next: (data) => {
        this.customers.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  onDelete(customer: Customer) {
    if (confirm(`Delete customer ${customer.name}?`)) {
      this.customerService.delete(customer.id).subscribe({
        next: () => {
          this.customers.update(list => list.filter(c => c.id !== customer.id));
        },
        error: (err) => alert('Could not delete customer.')
      });
    }
  }
}