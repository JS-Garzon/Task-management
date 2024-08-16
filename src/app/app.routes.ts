import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { authGuard } from './auth/auth.guard';
import UsersComponent from './users/users.component';
import { roleGuard } from './auth/role.guard';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { RegisterComponent } from './auth/register/register.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./tasks/tasks.component')
      },
      {
        path: 'users',
        loadComponent: () => import('./users/users.component'),
        canActivate: [roleGuard],
        data: { role: 'admin' }
      },
      {
        path: 'profile',
        loadComponent: () => import('./profile/profile.component')
      }
    ]
  },
  {
    path: 'not-found',
    component: NotFoundComponent
  },
  {
    path: '**',
    redirectTo: 'not-found'
  }
];
