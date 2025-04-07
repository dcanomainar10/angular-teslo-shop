import { Routes, CanMatchFn } from '@angular/router';
import { IsAdminGuard } from '@auth/guards/is-admin.guard';
import { NotAuthenticatedGuard } from '@auth/guards/not-authenticated.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes'),
    canMatch: [
      // () => {
      //   console.log('hola mundo');
      //   return false;
      // },
      NotAuthenticatedGuard
    ]
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin-dashboard/admin-dashboard.routes'),
    canMatch: [
      // IsAdminGuard
    ]
  },
  {
    path: '',
    loadChildren: () => import('./store-front/store-front.routes'),
  },
];
