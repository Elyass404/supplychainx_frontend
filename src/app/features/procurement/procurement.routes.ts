import { Routes } from '@angular/router';
import { SupplierList } from './supplier-list/supplier-list';
import { SupplierForm } from './supplier-form/supplier-form';

export const PROCUREMENT_ROUTES: Routes = [

  {
    path: 'suppliers/new',
    component: SupplierForm
  },
  // When user goes to /procurement/suppliers -> Show the List
  {
    path: 'suppliers',
    component: SupplierList
  },

  {
    path: 'suppliers/:id/edit',
    component: SupplierForm
  },
  
  // Default: If they just go to /procurement, redirect to suppliers
  {
    path: '',
    redirectTo: 'suppliers',
    pathMatch: 'full'
  }
];