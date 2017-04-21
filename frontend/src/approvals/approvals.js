import { inject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-http-client';
import { LeaveService } from '~/services/leave-service';
import { UserService } from '~/services/user-service';
import { AuthService } from '~/services/auth-service';
import { REQUEST_STATUS } from '~/util/constants';

@inject(LeaveService, UserService)
export class Approvals {
    constructor(_leave, _user) {
        this._leave = _leave;
        this._user = _user;
    }
    activate() {
        this.pendingApprovals();
    }

    async pendingApprovals() {
        const pendings = await this._leave.getPendingApprovals();
        const complete = await Promise.all(pendings.map(async item => {
            const user = await this._user.getUser(item.userId);

            item.user = user;
            return item;
        }));

        this.allPendingApprovals = complete;
    }

    async approveRequest(request) {
        const response = await this._leave.updateLeaveRequestStatus(request, REQUEST_STATUS.APPROVED);
        console.log('approve', response)
        return response;
    }

    async rejectRequest(request) {
        const response = await this._leave.updateLeaveRequestStatus(request, REQUEST_STATUS.REJECTED);
        console.log('reject', response)
        return response;
    }

    showExtra(extra) {
        return extra.workDays > 1 ? true : false;
    }
}