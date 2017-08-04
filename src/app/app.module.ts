import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {
    NgModule,
    ApplicationRef,
    ViewContainerRef
} from '@angular/core';
import {
    removeNgStyles,
    createNewHosts,
    createInputTransfer
} from '@angularclass/hmr';
import {
    RouterModule,
    PreloadAllModules
} from '@angular/router';

import { RestangularModule, Restangular } from 'ngx-restangular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from './environment';
import { ROUTES } from './app.routes';
// App is our top level component
import { AppComponent } from './app.component';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { AppState, InternalStateType } from './app.service';
import { TaskComponent } from './controllers/task';
import { LoginComponent, LogoutComponent } from './controllers/session';

// toastr
import { ToastModule, ToastsManager } from 'ng2-toastr/ng2-toastr';

import '../styles/styles.scss';

// Application wide providers
const APP_PROVIDERS = [
    ...APP_RESOLVER_PROVIDERS,
    AppState
];

type StoreType = {
    state: InternalStateType,
    restoreInputValues: () => void,
    disposeOldHosts: () => void
};

export function RestangularConfigFactory(RestangularProvider, toast: ToastsManager) {
    RestangularProvider.setBaseUrl('http://localhost:3001');

    // toast.setRootViewContainerRef(vRef);

    RestangularProvider.addErrorInterceptor((response, subject, responseHandler) => {
        switch (response.status) {
            case 400:
            case 500:
                alert(response.data.error);
                // toast.error(response.data.error);
                break;
            default:
                break;
        }

        return true;
    });

    RestangularProvider.addFullRequestInterceptor((element, operation, path, url, headers, params) => {
        let loggedUser = localStorage.getItem('user');
        
        if(loggedUser !== null) {
            loggedUser = JSON.parse(loggedUser);
            
            headers['Authorization-Token'] = loggedUser['token'];
        }
        
        return {
            params: params,
            headers: headers,
            element: element,
            url: url,
            path: path,
            operation: operation
        }
    });
}

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
    bootstrap: [AppComponent],
    declarations: [
        AppComponent,
        TaskComponent,
        LoginComponent,
        LogoutComponent,
    ],
    /**
     * Import Angular's modules.
     */
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpModule,
        RouterModule.forRoot(ROUTES, { useHash: true, preloadingStrategy: PreloadAllModules }),
        ToastModule.forRoot(),
        RestangularModule.forRoot([ToastsManager], RestangularConfigFactory),
    ],
    /**
     * Expose our Services and Providers into Angular's dependency injection.
     */
    providers: [
        ENV_PROVIDERS,
        APP_PROVIDERS,
        ToastsManager
    ]
})
export class AppModule {

    constructor(
        public appRef: ApplicationRef,
        public appState: AppState
    ) {
    }

}
