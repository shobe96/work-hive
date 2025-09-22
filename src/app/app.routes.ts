import { OnboardingComponent } from './onboarding-component/onboarding.component';

import { Route } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './home/data-access/home.component';
import { EmployeesComponent } from './employees/employees.component';

export const appRoutes: Route[] = [
  { path: '', component: LoginComponent },
  { path: 'onboarding', component: OnboardingComponent },
  { path: 'home', component: HomeComponent },
  { path: 'employees', component: EmployeesComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
