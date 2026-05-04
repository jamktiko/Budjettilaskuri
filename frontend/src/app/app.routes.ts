import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Home } from './home/home';
import { Register } from './register/register';
import { authGuard } from './auth.guard';
import { AddExpense } from './expense/add-expense/add-expense';
import { Profile } from './shared/profile/profile';
import { Addbudget } from './addbudget/addbudget';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: Login },

  { path: 'home', component: Home, canActivate: [authGuard] },

  { path: 'add', component: AddExpense, canActivate: [authGuard] },

  { path: 'profile', component: Profile, canActivate: [authGuard] },

  { path: 'addbudget', component: Addbudget },
];
