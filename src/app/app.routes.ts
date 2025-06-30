import { Routes } from '@angular/router';
import { OnboardingComponent } from './onboarding-component/onboarding.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'onboarding', pathMatch: 'full' }, // default route
  { path: 'onboarding', component: OnboardingComponent },
];
