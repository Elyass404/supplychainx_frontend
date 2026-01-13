import { Routes } from '@angular/router';
import { AppLayout } from './core/layout/app-layout/app-layout';

export const routes: Routes = [
  {
    path: '',
    component: AppLayout,
    children: []
  },
  
  { path: '**', redirectTo: '' }
];