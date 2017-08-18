import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { RouterModule, PreloadAllModules } from '@angular/router';

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
import { TaskComponent } from './controllers/task';
import { LoginComponent, LogoutComponent } from './controllers/session';

// toastr
import { ToastModule, ToastsManager } from 'ng2-toastr';

// Services
import { AuthorizationService } from './services/authorization';
import { NotificationService } from './services/notification';
import { NavigationComponent } from './components/navigation';

import '../styles/styles.scss';

// Application wide providers
const APP_PROVIDERS = [
    ...APP_RESOLVER_PROVIDERS,
    AppState
];

export function RestangularConfigFactory(RestangularProvider, toast: ToastsManager, auth: AuthorizationService, notification: NotificationService) {
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
            case 500:
                // notification.
                // toast.error(response.data.error);
                break;
            case 401:
                notification.displayError(response.data.error);
                auth.logout().then((data) => {

                });
                // toast.error(response.data.error);
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
        TaskComponent,
        LoginComponent,
        LogoutComponent,
        NavigationComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpModule,
        RouterModule.forRoot(ROUTES, {useHash: true, preloadingStrategy: PreloadAllModules}),
        ToastModule.forRoot(),
        RestangularModule.forRoot([ToastsManager, AuthorizationService, NotificationService], RestangularConfigFactory),
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
