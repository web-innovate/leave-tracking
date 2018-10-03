import { bindable, inject } from 'aurelia-framework';
import { LeaveService } from '~/services/leave-service';
import { REQUEST_MAPPING } from '~/util/constants';

@inject(LeaveService)
export class Requests {
    @bindable requests = [];
    @bindable loading = false;

    constructor(_leave) {
        this._leave = _leave;
        this.statuses = [];
    }

    attached() {
        this.excluded = (this.requests[0] || {}).status;
        this.statuses = Object.values(REQUEST_MAPPING).filter(i => i.status !== this.excluded).map(i => i.action);
    }

    updateRequest(request, status) {
        return this._leave.updateLeaveRequestStatus(request, status);
    }

    showExtra(extra) {
        return extra.workDays > 1 ? true : false;
    }
}
