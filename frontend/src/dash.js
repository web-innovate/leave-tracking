import { inject } from 'aurelia-framework';
import { UserService } from '~/services/user-service';

@inject(UserService)
export class Dash {
    allRequests = [];
    allPendingApprovals = [];

    constructor(_user) {
        this._user = _user;
    }

    activate() {
        this.leaveRequests();
    }

    async leaveRequests() {
        this.allRequests = await this._user.getLeaves();
    }

    showExtra(extra) {
        return extra.workDays > 1 ? true : false;
    }
}
