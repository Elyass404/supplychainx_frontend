import { Routes } from '@angular/router';
import { SupplierList } from './supplier-list/supplier-list';
import { SupplierForm } from './supplier-form/supplier-form';
import { RawMaterialList } from './raw-material-list/raw-material-list';
import { RawMaterialForm} from './raw-material-form/raw-material-form'; 

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

  //raw materials routes

  //Create new raw material
  { 
    path: 'raw-materials/new', 
    component: RawMaterialForm
  },

  //Edit route
  { 
    path: 'raw-materials/:id/edit', 
    component: RawMaterialForm 
  },

  //Show the list of raw materials
  {
    path: 'raw-materials',
    component: RawMaterialList
  },
  
  // Default: If they just go to /procurement, redirect to suppliers
  {
    path: '',
    redirectTo: 'suppliers',
    pathMatch: 'full'
  }
];