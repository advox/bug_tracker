import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {
    NgModule,
    ApplicationRef
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

/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from './environment';
import { ROUTES } from './app.routes';
// App is our top level component
import { AppComponent } from './app.component';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { AppState, InternalStateType } from './app.service';
import { HomeComponent } from './controllers/home';
import { LoginComponent } from './controllers/session';

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

export function RestangularConfigFactory(RestangularProvider) {
    RestangularProvider.setBaseUrl('http://localhost:3001');
    RestangularProvider.setDefaultHeaders({ 'Authorization': 'Bearer UDXPx-Xko0w4BRKajozCVy20X11MRZs1' });
}

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
    bootstrap: [AppComponent],
    declarations: [
        AppComponent,
        HomeComponent,
        LoginComponent
    ],
    /**
     * Import Angular's modules.
     */
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        RouterModule.forRoot(ROUTES, { useHash: true, preloadingStrategy: PreloadAllModules }),
        RestangularModule.forRoot(RestangularConfigFactory),
    ],
    /**
     * Expose our Services and Providers into Angular's dependency injection.
     */
    providers: [
        ENV_PROVIDERS,
        APP_PROVIDERS
    ]
})
export class AppModule {

    constructor(
        public appRef: ApplicationRef,
        public appState: AppState
    ) { }

}
