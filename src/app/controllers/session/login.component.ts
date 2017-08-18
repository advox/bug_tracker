import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthorizationService } from './../../services/authorization/authorization.service';
import { Restangular } from 'ngx-restangular';

@Component({
    selector: 'login',
    templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
    private sessionRest: Restangular = null;
    private form: any = {
        login: '',
        password: ''
    };

    constructor(
        private router: Router,
        private authorizationService: AuthorizationService,
        private restangular: Restangular
    ) {
        this.sessionRest = restangular.all('session');
    }

    public loginFunction() {
        this.sessionRest.post(this.form).subscribe(
            (data) => {
                this.authorizationService.login(data).then(() => {
                    this.router.navigate(['/task']);
                });
            });
    }

    public ngOnInit() {
        if (this.authorizationService.isUserLoggedIn()) {
            this.router.navigate(['task']);
        }
    }
}
