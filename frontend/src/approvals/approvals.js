import { inject } from 'aurelia-framework';
import { LeaveService } from '~/services/leave-service';

@inject(LeaveService)
export class Approvals {
    pendingLoading = true;
    approvedLoading = true;
    rejectedLoading = true;

    constructor(_leave, _user) {
        this._leave = _leave;
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
        this.allPendingRequests = await this._leave.getPendingRequests();
        this.pendingLoading = false;
    }


    async fetchApprovedRequests() {
        this.allApprovedRequests = await this._leave.getApprovedRequests();
        this.approvedLoading = false;
    }

    async fetchRejectedRequests() {
        this.allRejectedRequests = await this._leave.getRejectedRequests();
        this.rejectedLoading = false;
    }
}
