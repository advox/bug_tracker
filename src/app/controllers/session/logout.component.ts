import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from './../../services/authorization/authorization.service';
import { Router } from '@angular/router';
import { Restangular } from 'ngx-restangular';

@Component({
    selector: 'logout',
    templateUrl: './logout.component.html'
})
export class LogoutComponent implements OnInit {
    private sessionRest: Restangular = null;

    constructor(
        private router: Router,
        private authorizationService: AuthorizationService,
        private restangular: Restangular
    ) {
        this.sessionRest = restangular.all('session');
    }

    public ngOnInit(): void {
        if (this.authorizationService.isUserLoggedIn()) {
            this.sessionRest.doDELETE().subscribe(
                () => {
                    this.authorizationService.logout().then(
                        () => {
                            this.router.navigate(['']);
                        },
                        () => undefined);
                },
                () => undefined);
        }
    }
}
