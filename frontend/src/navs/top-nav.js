import { inject, bindable } from 'aurelia-framework';
import { DialogService } from 'aurelia-dialog';
import { Profile } from '~/profile/profile';
import { AuthService } from '~/services/auth-service';


@inject(DialogService, AuthService)
export class TopNav {
    @bindable router;

    constructor(dialogService, _auth) {
        this.dialogService = dialogService;
        this._auth = _auth;
    }

    logout() {
        this._auth.logout();
    }

    get isAuth() {
        return this._auth.isAuth;
    }
}
