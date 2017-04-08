import { inject } from 'aurelia-framework';
import { UserService } from '../services/user-service';

@inject(UserService)
export class Profile {
    constructor(userService) {
        this.user = {};
        this.userLoaded = false;
        this.userService = userService;

        this.userService.getUser().then(user => {
            this.user = user;
            this.userLoaded = true;
        });
    }
}
