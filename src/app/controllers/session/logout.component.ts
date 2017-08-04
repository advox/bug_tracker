import { Component } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { Router } from '@angular/router';

@Component({
    selector: 'logout',
    templateUrl: './logout.component.html'
})
export class LogoutComponent {
    private sessionRest: Restangular = null;

    constructor(
        private restangular: Restangular,
        private router: Router
    ) {
        this.sessionRest = restangular.all('session');

        let loggedUser = localStorage.getItem('user');

        if (loggedUser !== null) {
            loggedUser = JSON.parse(loggedUser);

            this.sessionRest.doDELETE().subscribe((data) => {
                localStorage.removeItem('user');
                this.router.navigate(['']);
            });
        }

    }
}
