import { inject } from 'aurelia-framework';
import { LeaveService } from '~/services/leave-service';
import { UserService } from '~/services/user-service';
import { REQUEST_STATUS } from '~/util/constants';

@inject(LeaveService, UserService)
export class Approvals {
    pendingLoading = true;
    approvedLoading = true;
    rejectedLoading = true;

    constructor(_leave, _user) {
        this._leave = _leave;
        this._user = _user;
    }
    activate() {
        this.pendingRequests();
        this.approvedRequests();
        this.rejectedRequests();
    }

    async pendingRequests() {
        let pendingsRequests = await this._leave.getPendingRequests();

        pendingsRequests = await this.agregateUserData(pendingsRequests);

        this.allPendingRequests = pendingsRequests;
        this.pendingLoading = false;
    }


    async approvedRequests() {
        let approvedRequests = await this._leave.getApprovedRequests();

        approvedRequests = await this.agregateUserData(approvedRequests);

        this.allApprovedRequests = approvedRequests;
        this.approvedLoading = false;
    }

    async rejectedRequests() {
        let rejectedRequests = await this._leave.getRejectedRequests();

        rejectedRequests = await this.agregateUserData(rejectedRequests);

        this.allRejectedRequests = rejectedRequests;
        this.rejectedLoading = false;
    }

    agregateUserData(pendings) {
        return Promise.all(pendings.map(async item => {
            const user = await this._user.getUser(item.userId);

            item.user = user;
            return item;
        }));
    }
}