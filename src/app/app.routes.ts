import { Routes } from '@angular/router';
import { TaskComponent } from './controllers/task';
import { LoginComponent, LogoutComponent } from './controllers/session';

import { DataResolver } from './app.resolver';

export const ROUTES: Routes = [
    { path: '', component: LoginComponent },
    { path: 'task', component: TaskComponent },
    { path: 'logout', component: LogoutComponent },
    { path: '**', component: LoginComponent },
];
