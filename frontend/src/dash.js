import { inject } from 'aurelia-framework';
import { LeaveService } from './services/leave-service';
import { UserService } from './services/user-service';
import { REQUEST_STATUS } from './util/constants';
import {HttpClient} from 'aurelia-http-client';


@inject(LeaveService, UserService)
export class Dash {
    allRequests = [];
    allPendingApprovals = [];

    constructor(leaveService, userService) {
        this.leaveService = leaveService;
        this.userService = userService;
        this.http = new HttpClient();
    }

    activate() {
        this.leaveRequests();
        this.pendingApprovals();
    }

    async leaveRequests() {
        this.allRequests = await this.leaveService.getLeaveRequests();
    }

    async pendingApprovals() {
        const pendings = await this.leaveService.getPendingApprovals();
        const complete = await Promise.all( pendings.map(async item => {
            const user = await this.userService.getUser(item.userId);

            item.user = user;
            return item;
        }));

        this.allPendingApprovals = complete;
    }

    computeBadge(requestStatus) {
        switch(requestStatus) {
            case REQUEST_STATUS.APPROVED:
                return 'list-group-item-success';
            case REQUEST_STATUS.REJECTED:
                return 'list-group-item-danger';
            case REQUEST_STATUS.PENDING:
                return 'list-group-item-info';
        }
    }

    showExtra(extra) {
        return extra.workDays > 1 ? true : false;
    }

    async approveRequest(request) {
        const response = await this.leaveService.updateLeaveRequestStatus(request, REQUEST_STATUS.APPROVED);
        console.log('approve', response)
    }

    async rejectRequest(request) {
        const response = await this.leaveService.updateLeaveRequestStatus(request, REQUEST_STATUS.REJECTED);
        console.log('reject', response)
    }
}
