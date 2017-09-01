import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { Router } from '@angular/router';

import { RestangularModule } from 'ngx-restangular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from './environment';
import { ROUTES } from './app.routes';
// App is our top level component
import { AppComponent } from './app.component';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { AppState } from './app.service';

// ng-bootstrap
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

// toastr
import { ToastModule, ToastsManager } from 'ng2-toastr';

// primeng
import { PaginatorModule } from 'primeng/primeng';

// Services
import { AuthorizationService } from './services/authorization';
import { NotificationService } from './services/notification';
import { NavigationComponent } from './components/navigation';

// controllers
import { TaskListComponent, TaskEditComponent } from './controllers/task';
import { CommentViewComponent } from './controllers/task/comment';
import { LoginComponent, LogoutComponent } from './controllers/session';

import '../styles/styles.scss';

// Application wide providers
const APP_PROVIDERS = [
    ...APP_RESOLVER_PROVIDERS,
    AppState
];

export function RestangularConfigFactory(RestangularProvider, auth: AuthorizationService, notification: NotificationService, router: Router) {
    RestangularProvider.setBaseUrl('http://localhost:3001');

    if (auth.isUserLoggedIn()) {
        RestangularProvider.setDefaultHeaders({'Authentication-Token': auth.getAuthenticationToken()});
    }

    RestangularProvider.addResponseInterceptor((data, operation, what, url, response) => {
        return data;
    });

    RestangularProvider.addErrorInterceptor((response, subject, responseHandler) => {
        switch (response.status) {
            case 400:
                notification.displayError(response.data.error);
            case 500:
                break;
            case 401:
                notification.displayError(response.data.error);
                auth.logout().then((data) => {
                    router.navigate(['/']);
                });
                break;
            default:
                break;
        }

        return true;
    });

    RestangularProvider.addFullRequestInterceptor((element, operation, path, url, headers, params) => {
        if (auth.isUserLoggedIn()) {
            headers['Authentication-Token'] = auth.getAuthenticationToken();
        }

        return {
            params: params,
            headers: headers,
            element: element,
            url: url,
            path: path,
            operation: operation
        };
    });
}

@NgModule({
    bootstrap: [AppComponent],
    declarations: [
        AppComponent,
        TaskListComponent,
        TaskEditComponent,
        CommentViewComponent,
        LoginComponent,
        LogoutComponent,
        NavigationComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpModule,
        PaginatorModule,
        RouterModule.forRoot(ROUTES, {useHash: true, preloadingStrategy: PreloadAllModules}),
        ToastModule.forRoot(),
        RestangularModule.forRoot([AuthorizationService, NotificationService, Router], RestangularConfigFactory),
        NgbModule.forRoot()
    ],
    providers: [
        ENV_PROVIDERS,
        APP_PROVIDERS,
        ToastsManager,
        AuthorizationService,
        NotificationService
    ]
})
export class AppModule {
}
