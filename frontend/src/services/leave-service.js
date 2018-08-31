import moment from 'moment';
import { inject } from 'aurelia-framework';
import { REQUEST_STATUS, LEAVE_TYPES, HUMAN_LEAVE_TYPES } from '~/util/constants';
import { ApiService } from './api-service';
import { UserService } from './user-service';

@inject(ApiService, UserService)
export class LeaveService {
    constructor(api, _user) {
        this.http = api.http;
        this._user = _user;
    }

    getLeaveRequests() {
        return this.http.get('leaves');
    }

    async getCalendarEvents() {
        let leaves = await this.getLeaveRequests();
        // show just the approved leaves
        leaves = leaves.filter(x => x.status === 'approved');

        const events =  await leaves.map(async leave => {
            const user = await this._user.getUser(leave.userId);
            const { leaveType } = leave;

            const leaveEvent = {
                id: leave._id,
                title: `${user.fullName} | ${HUMAN_LEAVE_TYPES[leaveType]}`,
                type: leaveType,
                class: this.computeEventClass(leaveType),
                start: moment(leave.start).toDate().valueOf(),
                end: moment(leave.end).toDate().valueOf()
            }

            return leaveEvent;
        });

        return await Promise.all(events);
    }

    computeEventClass(type) {
        const { ANNUAL, PARENTING, UNPAID, STUDY, HALF_DAY, SICK } = LEAVE_TYPES;

        switch(type) {
            case ANNUAL:
                return 'event-important';
            case PARENTING:
                return 'event-success';
            case UNPAID:
                return 'event-warning';
            case STUDY:
                return 'event-info';
            case HALF_DAY:
                return 'event-inverse';
            case SICK:
                return 'event-special';
        }
    }

    addLeaveRequest(request) {
        const { start, end, workDays, leaveType } = request;
        const leave = {
            leaveType,
            start,
            end,
            workDays,
            status: 'pending'
        };

        return this.http.post('leaves', leave);
    }

    getPendingRequests() {
        return this.fetch('leaves/pending');
    }

    getApprovedRequests() {
        return this.fetch('leaves/approved');
    }

    getRejectedRequests() {
        return this.fetch('leaves/rejected');
    }

    getCanceledRequests() {
        return this.fetch('leaves/canceled');
    }

    updateLeaveRequestStatus(request, status) {
        request.status = status;
        return this.http.put(`leaves/${request._id}`, request);
    }

    fetch(endpoint) {
        return this.http.get(endpoint);
    }
}
