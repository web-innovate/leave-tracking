import { OAuthService } from 'aurelia-oauth';
import { inject } from 'aurelia-framework';

@inject(OAuthService)
export class AuthService {
    constructor(auth) {
        this.auth = auth;
    }

    login() {
        return this.auth.login();
    }

    get isLogged() {
        return this.auth.isAuthenticated();
    }
}