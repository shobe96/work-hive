import { Route } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './home/home.component';

export const appRoutes: Route[] = [
    { path: '', component: LoginComponent },
    { path: 'home', component: HomeComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
