import { inject } from 'aurelia-framework';
import { UserModel } from '../models/user-model';
import { ApiService } from './api-service';

@inject(ApiService)
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

    constructor(api) {
        this.http = api.http;
    }

    getUser(id) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.loggedUser = this.user;
                resolve(new UserModel(this.user));
            }, 500)
        });
    }

    get currentUser() {
        return this.loggedUser;
    }

    createUser(user) {
        return this.http.post('users', user);
    }

    getUsers() {
        return this.http.get('users');
    }
}
