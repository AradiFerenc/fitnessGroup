import { Routes } from '@angular/router';
import {adminAuthGuard} from './shared/guards/adminAuth.guard';
import {userAuthGuard} from './shared/guards/userAuth.guard';

export const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)},
  {path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)},
  {path: 'register', loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent)},
  {path: 'listusers', loadComponent: () => import('./user-management/user-management.component').then(m => m.UserManagementComponent), canActivate: [adminAuthGuard] },
  {path: 'listtrainers', loadComponent: () => import('./trainer-management/trainer-management.component').then(m => m.TrainerManagementComponent), canActivate: [userAuthGuard] },
  {path: '**', redirectTo: '/home'},
];
