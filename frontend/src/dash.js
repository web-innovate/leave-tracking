import { inject } from 'aurelia-framework';
import { UserService } from '~/services/user-service';
import { AuthService } from '~/services/auth-service';
import { LeaveService } from '~/services/leave-service';
import { REQUEST_STATUS } from "./util/constants";

@inject(UserService, AuthService, LeaveService)
export class Dash {
    allRequests = [];
    allPendingApprovals = [];

    statusData = {
        labels: ["Available", "Taken", "Pending"],
        datasets: [
            {
                data: [300, 50, 100],
                backgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56"
                ],
                hoverBackgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56"
                ]
            }]
    };

    constructor(_user, _auth, _leave) {
        this._user = _user;
        this._auth = _auth;
        this._leave = _leave;
    }

    async activate() {
        await this.leaveRequests();
        await this.populateData();
    }

    async leaveRequests() {
        this.allRequests = await this._user.getLeaves();
    }

    async populateData() {
        const me = await this._auth.me();

        const {holidays, taken, pending} = me;

        this.statusData.datasets[0].data = [holidays, taken, pending];
    }

    showExtra(extra) {
        return extra.workDays > 1;
    }

    isCanceled(request) {
        // console.log('req', request)
        const da =  request.status === 'canceled'
        console.log('req', request, da)
        return da;
    }

    cancelRequest(request) {
        return this._leave.updateLeaveRequestStatus(request, REQUEST_STATUS.CANCELLED);
    }
}
