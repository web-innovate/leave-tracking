import { inject } from 'aurelia-framework';
import { REQUEST_STATUS } from '../util/constants';
import { ApiService } from './api-service';
import { UserModel } from '../models/user-model';

@inject(ApiService)
export class AuthService {
    isAuth = false;
    meData = {};

    constructor(_api){
     this.http = _api.http;
     this._api = _api;
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
                console.log('succes', res);
                const { token } = JSON.parse(res.response);

                this._api.attachToken(token);
                this.isAuth = true;

                return this.me();
            })
            .catch(res => console.log('failed', res))
    }

    me() {
        return this.http.get('auth/me')
            .then(res => new UserModel(JSON.parse(res.response)))
    }
}
