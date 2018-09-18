import { bindable, inject } from 'aurelia-framework';
import { LeaveService } from '~/services/leave-service';
import { REQUEST_STATUS } from '~/util/constants';

@inject(LeaveService)
export class Requests {
    @bindable requests = [];
    @bindable loading = false;

    constructor(_leave){
        this._leave = _leave;
    }

    approveRequest(request) {
        return this._leave.updateLeaveRequestStatus(request, REQUEST_STATUS.APPROVED);
    }

    cancelRequest(request) {
        return this._leave.updateLeaveRequestStatus(request, REQUEST_STATUS.CANCELLED);
    }

    rejectRequest(request) {
        return this._leave.updateLeaveRequestStatus(request, REQUEST_STATUS.REJECTED);
    }

    showExtra(extra) {
        return extra.workDays > 1 ? true : false;
    }
}
