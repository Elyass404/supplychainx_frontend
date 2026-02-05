import { Routes } from '@angular/router';
import { CustomerList } from './customer-list/customer-list';
import { CustomerForm } from './customer-form/customer-form';

export const DELIVERY_ROUTES: Routes = [
  { path: 'customers', component: CustomerList },
  { path: 'customers/new', component: CustomerForm },
  { path: 'customers/:id/edit', component: CustomerForm }
];