import {
    Component,
    ViewEncapsulation,
} from '@angular/core';
import { AppState } from './app.service';
import { Router, NavigationStart } from '@angular/router';

@Component({
    selector: 'app',
    encapsulation: ViewEncapsulation.None,
    styleUrls: [
        './app.component.css'
    ],
    template: `<router-outlet></router-outlet>`
})
export class AppComponent {
    constructor(
        public appState: AppState,
        private router: Router
    ) {
        this.router.events
            .filter(event => event instanceof NavigationStart)
            .subscribe((event: NavigationStart) => {
                let loggedUser = localStorage.getItem('user');

                if (loggedUser !== null) {

                } else {
                    if (event.url !== '' && event.url !== '/') {
                        this.router.navigate(['']);
                    }
                }
            });
    }

}
