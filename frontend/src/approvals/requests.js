import { bindable, inject } from 'aurelia-framework';
import { AuthService } from '~/services/auth-service';
import { LeaveService } from '~/services/leave-service';
import { REQUEST_STATUS } from '~/util/constants';

@inject(AuthService, LeaveService)
export class Requests {
    @bindable requests = [];
    @bindable loading = false;

    constructor(_auth, _leave) {
        this._auth = _auth;
        this._leave = _leave;
        this.userType = '';
    }

    async attached() {
        const { userType } = await this._auth.me();

        this.userType = userType;
    }

    approveRequest(request) {
        return this._leave.updateLeaveRequestStatus(request, REQUEST_STATUS.APPROVED);
    }

    rejectRequest(request) {
        return this._leave.updateLeaveRequestStatus(request, REQUEST_STATUS.REJECTED);
    }

    cancelRequest(request) {
        return this._leave.deleteRequest(request._id);
    }

    showExtra(extra) {
        return extra.workDays > 1 ? true : false;
    }
}
