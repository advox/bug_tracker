import { Routes } from '@angular/router';
import { HomeComponent } from './controllers/home';
import { LoginComponent } from './controllers/session';

import { DataResolver } from './app.resolver';

export const ROUTES: Routes = [
    { path: '', component: LoginComponent },
    { path: 'home', component: HomeComponent },
    { path: '**', component: LoginComponent },
];
