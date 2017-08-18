import { Injectable } from '@angular/core';

@Injectable()
export class AuthorizationService {

    public login(data): Promise<any> {
        return new Promise((resolve, reject) => {
            localStorage.setItem('user', JSON.stringify({
                login: data.login,
                token: data.token,
                expireDate: data.expireDate
            }));

            resolve();
        });
    }

    public logout(): Promise<any> {
        return new Promise((resolve, reject) => {
            localStorage.removeItem('user');

            resolve();
        });
    }

    public isUserLoggedIn(): boolean {
        return this.getUser() !== null;
    }

    public getAuthenticationToken(): string {
        if (this.isUserLoggedIn()) {
            let user = this.getUser();

            return user.token;
        }

        return '';
    }

    private getUser(): any {
        return JSON.parse(localStorage.getItem('user'));
    }
}
