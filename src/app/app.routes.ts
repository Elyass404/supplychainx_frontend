import { Routes } from '@angular/router';
import { AppLayout } from './core/layout/app-layout/app-layout';
import { Login } from './features/auth/login';
import { authGuard } from './core/guards/auth.guard'; 

export const routes: Routes = [
  // Public Route: Login
  {
    path: 'login',
    component: Login
  },

  // Secured Routes (Protected by Guard)
  {
    path: '',
    component: AppLayout,
    canActivate: [authGuard], // the bouncer
    children: [
      // If we go to localhost:4200, redirect to suppliers
      { path: '', redirectTo: 'procurement/suppliers', pathMatch: 'full' },
      
      //we will make other routes here...
    ]
  },

  // 3. Catch-all
  { path: '**', redirectTo: 'login' }
];