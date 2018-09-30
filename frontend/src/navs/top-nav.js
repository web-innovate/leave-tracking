import { inject, bindable } from 'aurelia-framework';
import { AuthService } from '~/services/auth-service';

@inject(AuthService)
export class TopNav {
    @bindable router;

    constructor(_auth) {
        this._auth = _auth;
    }

    logout() {
        this._auth.logout();
    }

    get isAuth() {
        return this._auth.isAuth;
    }
}
