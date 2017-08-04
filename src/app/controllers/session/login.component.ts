import { Component, OnInit } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { Router } from '@angular/router';

@Component({
    selector: 'login',
    templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
    private sessionRest : Restangular = null;
    private form : any = {
        login: '',
        password: ''
    };

    constructor(
        private restangular: Restangular,
        private router: Router
    ) {
        this.sessionRest = restangular.all('session');
    }

    public loginFunction() {
        this.sessionRest.post(this.form).subscribe((data) => {
            localStorage.setItem('user', JSON.stringify({
                login: data.login,
                token: data.token
            }));
            
            this.router.navigate(['/task']);
        });
    }
    
    public ngOnInit() {
        let loggedUser = localStorage.getItem('user');

        if (loggedUser !== null) {
            this.router.navigate(['task']);
        }
    }
}
