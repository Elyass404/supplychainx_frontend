import { Routes } from '@angular/router';
import { ProductionList } from './production-list/production-list';
//Import the new form
import { ProductionForm } from './production-form/production-form'; 

import { ProductForm } from './product-form/product-form';
import { ProductList } from './product-list/product-list';
ProductList

export const PRODUCTION_ROUTES: Routes = [
  // List
  { path: 'orders', component: ProductionList },
  
  // Create
  { path: 'orders/new', component: ProductionForm },
  
  // Edit
  { path: 'orders/:id/edit', component: ProductionForm },

  //Product Routes
  { path: 'products', component: ProductList },
  { path: 'products/new', component: ProductForm }, 
  { path: 'products/:id/edit', component: ProductForm }
];