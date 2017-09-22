import { inject } from 'aurelia-framework';
import { UserService } from '~/services/user-service';

@inject(UserService)
export class Reports {

    userIds = [];
    results = [];

    constructor(_userService) {
        this._userService = _userService;
        this.model = this;
    }


    userSource(query, limit) {
        return this._userService.searchUserByName(query, limit);
    }
}
