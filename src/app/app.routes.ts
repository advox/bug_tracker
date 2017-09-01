import { Routes } from '@angular/router';
import { TaskListComponent, TaskEditComponent } from './controllers/task';
import { LoginComponent, LogoutComponent } from './controllers/session';

export const ROUTES: Routes = [
    { path: '', component: LoginComponent },
    { path: 'task/:id', component: TaskEditComponent },
    { path: 'task', component: TaskListComponent },
    { path: 'logout', component: LogoutComponent },
    { path: '**', component: LoginComponent },
];
