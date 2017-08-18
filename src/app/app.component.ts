import {
    Component,
    ViewEncapsulation,
    ViewContainerRef
} from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { AuthorizationService } from './services/authorization';
import { NotificationService } from './services/notification';
import { ToastsManager } from 'ng2-toastr';

@Component({
    selector: 'app',
    encapsulation: ViewEncapsulation.None,
    styleUrls: [
        './app.component.css'
    ],
    template: `
        <router-outlet></router-outlet>`
})
export class AppComponent {
    constructor(
        private router: Router,
        private authorizationService: AuthorizationService,
        private notificationService: NotificationService,
        public vRef: ViewContainerRef,
        private toast: ToastsManager
    ) {
        this.router.events
            .filter((event) => event instanceof NavigationStart)
            .subscribe((event: NavigationStart) => {
                if (!this.authorizationService.isUserLoggedIn()) {
                    if (event.url !== '' && event.url !== '/') {
                        this.router.navigate(['']);
                    }
                }
            });

        this.notificationService.showErrorNotification$.subscribe((data) => {
            this.toast.setRootViewContainerRef(vRef);
            this.toast.error(data);
        });
    }

}
