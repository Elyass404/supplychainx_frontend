import { Routes } from '@angular/router';
import { AppLayout } from './core/layout/app-layout/app-layout';
import { Login } from './features/auth/login';
import { authGuard } from './core/guards/auth.guard'; 
import { PROCUREMENT_ROUTES } from './features/procurement/procurement.routes'; 

export const routes: Routes = [
  { path: 'login', component: Login },

  {
    path: '',
    component: AppLayout,
    canActivate: [authGuard],
    children: [
      // 1. Dashboard Default Redirect
      { path: '', redirectTo: 'procurement/suppliers', pathMatch: 'full' },

      // "If the URL starts with /procurement, go look at the procurement.routes.ts file"
      {
        path: 'procurement',
        loadChildren: () => import('./features/procurement/procurement.routes').then(m => m.PROCUREMENT_ROUTES)
      }
    ]
  },

  { path: '**', redirectTo: 'login' }
];