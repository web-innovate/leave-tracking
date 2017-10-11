import { inject } from 'aurelia-framework';
import { UserModel } from '~/models/user-model';
import { ApiService } from './api-service';
import { AuthService } from './auth-service';

@inject(ApiService, AuthService)
export class UserService {
    loggedUser = {};
    user = {
        id: 'unu-doi-trei',
        name: 'my awesome name',
        place: 'romanica',
        email: 'my@awesome.list',
        avatar: 'http://babyinfoforyou.com/wp-content/uploads/2014/10/avatar-300x300.png',
        department: 'QA/DEV/Lead',
        project: 'Bamboo',
        totalDaysPerYear: 24,
        remaining: 10,
        taken: 14
    };

    constructor(_api, _auth) {
        this.http = _api.http;
        this._auth = _auth;
    }

    getUser(id) {
        return this.http.get(`users/${id}`)
            .then(users => {
                users = JSON.parse(users.response);
                return  new UserModel(users);
            });
    }

    async currentUser() {
        return await this._auth.me();
    }

    createUser(user) {
        return this.http.post('users', user);
    }

    saveUser(user) {
        return this.http.put(`users/${user._id}`, user);
    }

    deleteUser(userID) {
        return this.http.delete(`users/${userID}`);
    }

    async getLeaves() {
        const me = await this.currentUser();

        return this.http.get(`users/${me._id}/leaves`)
            .then(res => JSON.parse(res.response));
    }

    getUsers() {
        return this.http.get('users')
            .then(users => {
                users = JSON.parse(users.response);
                return users.map(x => new UserModel(x));
            });
    }

    getQueryParams(name, type, limit) {
        return `limit=${limit}&name=${name}&fields=firstName,lastName,email${_.isUndefined(type) ? '' : '&userType='+type}`;
    }

    searchUser(name, type, limit = 10) {
        return this.http.get(`users?${this.getQueryParams(name, type, limit)}`)
            .then(users => {
                users = JSON.parse(users.response);
                return users.map(x => new UserModel(x));
            });
    }

    searchUserByName(name) {
        return this.searchUser(name);
    }

    searchApproverUserByName(name) {
        return this.searchUser(name, 'APPROVER');
    }
}
