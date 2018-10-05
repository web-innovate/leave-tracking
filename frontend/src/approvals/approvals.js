import { inject } from 'aurelia-framework';
import { Events } from '~/services/events';
import { LeaveService } from '~/services/leave-service';

@inject(LeaveService, Events)
export class Approvals {
    pendingLoading = true;
    approvedLoading = true;
    rejectedLoading = true;

    constructor(_leave, _events) {
        this._leave = _leave;
        this._events = _events;
        this.approveSubscriber = this._events.ea.subscribe('approve_event', () => {
            this.fetchApprovedRequests();
            this.fetchPendingRequests();
        });
        this.rejectSubscriber = this._events.ea.subscribe('reject_event', () => {
            this.fetchRejectedRequests();
            this.fetchPendingRequests();
        });
        this.cancelSubscriber = this._events.ea.subscribe('cancel_event', () => {
            this.fetchApprovedRequests();
        });
    }

    activate() {
        this.fetchRequests();
    }

    detached() {
        this.approveSubscriber.dispose();
        this.rejectSubscriber.dispose();
        this.cancelSubscriber.dispose();
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
