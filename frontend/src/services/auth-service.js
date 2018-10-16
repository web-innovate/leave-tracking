import { inject } from 'aurelia-framework';
import { ApiService } from './api-service';
import { UserModel } from '~/models/user-model';
import { Events } from './events';
import LogRocket from 'logrocket';

let shouldIdentifyLogRocket = true;

@inject(ApiService, Events)
export class AuthService {
    meData = {};

    constructor(_api, _events){
     this.http = _api.http;
     this._api = _api;
     this._events = _events;
    }

    /**
    * Send credentials to server
    * reconfigures httpClient to use the authorization header
    * calls /me endpoint
    * @returns {User}
    **/
    login(email, password) {
        return this.http.post('auth/login', {email, password})
            .then(response => {
                const { token } = response;

                this._api.attachToken(token);
                localStorage.setItem('token', token);


                return this.me();
            });
    }

    logout() {
        localStorage.removeItem('me');
        localStorage.removeItem('token');
    }

    get isAuth() {
        const token = localStorage.getItem('token') || false;
        if (!token) {
            this._events.ea.publish('no_token');
        }

        this.identifyLogRocket();

        return !!token;
    }

    me() {
        return this.http.get('auth/me')
            .then(response => {
                const meData = new UserModel(response);
                localStorage.setItem('me', JSON.stringify(meData))
                return meData;
            })
    }

    identifyLogRocket() {
        if (!shouldIdentifyLogRocket) {
            return;
        }

        shouldIdentifyLogRocket = false;

        const me = JSON.parse(localStorage.getItem('me'));

        if(!me) {
            return;
        }

        LogRocket.identify(me._id, {
            name: `${me.firstName} ${me.lastName}`,
            email: me.email,
            userType: me.userType
        });
    }

    localData() {
        return (localStorage.getItem('me') && JSON.parse(localStorage.getItem('me'))) || null;
    }

    get isAdmin() {
        return (this.localData() && this.localData().userType === 'ADMIN') || false
    }

    get isApprover() {
        return (this.localData() && this.localData().userType === 'APPROVER') || false
    }

    recover(email) {
        return this.http.post('auth/recover', { email });
    }

    reset(password, confirmPassword, token) {
        return this.http.post('auth/reset', { password, confirmPassword, token });
    }
}
