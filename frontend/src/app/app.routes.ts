import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Home } from './home/home';
import { Register } from './register/register';
import { AddExpense } from './expense/add-expense/add-expense';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: Login },

  { path: 'home', component: Home },

  { path: 'add', component: AddExpense },

  { path: 'register', component: Register },
];
