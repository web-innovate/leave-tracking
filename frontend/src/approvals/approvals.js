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
        this.fetchRequests();
    }

    fetchRequests() {
        this.fetchPendingRequests();
        this.fetchApprovedRequests();
        this.fetchRejectedRequests();
    }

    async fetchPendingRequests() {
        let pendingsRequests = await this._leave.getPendingRequests();

        pendingsRequests = await this.agregateUserData(pendingsRequests);

        this.allPendingRequests = pendingsRequests;
        this.pendingLoading = false;
    }


    async fetchApprovedRequests() {
        let approvedRequests = await this._leave.getApprovedRequests();

        approvedRequests = await this.agregateUserData(approvedRequests);

        this.allApprovedRequests = approvedRequests;
        this.approvedLoading = false;
    }

    async fetchRejectedRequests() {
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