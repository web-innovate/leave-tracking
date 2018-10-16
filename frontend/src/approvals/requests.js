import { bindable, inject } from 'aurelia-framework';
import { AuthService } from '~/services/auth-service';
import { LeaveService } from '~/services/leave-service';
import { Events } from '~/services/events';
import { REQUEST_STATUS } from '~/util/constants';

@inject(AuthService, LeaveService, Events)
export class Requests {
    @bindable requests = [];
    @bindable loading = false;

    constructor(_auth, _leave, _events) {
        this._auth = _auth;
        this._leave = _leave;
        this._events = _events;
        this.userType = '';
    }

    async attached() {
        const { userType } = await this._auth.me();

        this.userType = userType;
    }

    async approveRequest(request) {
        this.requests = this.requests.filter(i => i._id !== request._id);
        const resp = await this._leave.updateLeaveRequestStatus(request, REQUEST_STATUS.APPROVED);
        this._events.ea.publish('approve_event');
        return resp;
    }

    async rejectRequest(request) {
        this.requests = this.requests.filter(i => i._id !== request._id);
        const resp = await this._leave.updateLeaveRequestStatus(request, REQUEST_STATUS.REJECTED);
        this._events.ea.publish('reject_event');
        return resp;
    }

    async cancelRequest(request) {
        const resp = await this._leave.deleteRequest(request._id);
        this._events.ea.publish('cancel_event');
        return resp;
    }

    showExtra(extra) {
        return extra.workDays > 1 ? true : false;
    }
}
