import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Liliana Gorga — Developer Portfolio' },
  { path: 'projects', title: 'Progetti — Liliana Gorga', loadComponent: () => import('./pages/projects/projects.component').then(m => m.ProjectsComponent) },
  { path: 'contact', title: 'Contatti — Liliana Gorga', loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent) },
  { path: 'login', title: 'Accedi — Liliana Gorga', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', title: 'Registrati — Liliana Gorga', loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent) },
  { path: 'admin', title: 'Admin — Liliana Gorga', loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent), canActivate: [adminGuard] },
  { path: '**', redirectTo: '' }
];
