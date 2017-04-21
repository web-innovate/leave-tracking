import { inject } from 'aurelia-framework';
import { REQUEST_STATUS } from '~/util/constants';
import { ApiService } from './api-service';
import { UserModel } from '~/models/user-model';
import { Events } from './events';

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
            .then(res => {
                const { token } = JSON.parse(res.response);

                this._api.attachToken(token);
                localStorage.setItem('token', token);

                return this.me();
            });
    }

    logout() {
        localStorage.clear();
    }

    get isAuth() {
        const token = localStorage.getItem('token') || false;
        if (!token) {
            this._events.ea.publish('no_token', {});
        }
        return !!token;
    }

    me() {
        return this.http.get('auth/me')
            .then(res => {
                const meData = new UserModel(JSON.parse(res.response));
                localStorage.setItem('me', JSON.stringify(meData))
                return meData;
            })
    }

    localData() {
        return (localStorage.getItem('me') && JSON.parse(localStorage.getItem('me'))) || null;
    }

    get isAdmin() {
        return (this.localData() && this.localData().userType === 'ADMIN') || false
    }
}
