import { UserModel } from '../models/user-model';

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
}
