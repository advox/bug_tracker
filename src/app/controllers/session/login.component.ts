import { Component } from '@angular/core';
import { Restangular } from 'ngx-restangular';

@Component({
    selector: 'login',
    templateUrl: './login.component.html'
})
export class LoginComponent {
    private taskRest = null;
    private login = 'xxxx';

    constructor(
        private restangular: Restangular
    ) {
        this.taskRest = restangular.all('task');
    }

    public loginFunction() {
        this.taskRest.getList().subscribe((data) => {
            console.log(data);
        });
    }
}
