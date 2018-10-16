import moment from 'moment';
import { inject } from 'aurelia-framework';
import { LEAVE_TYPES, HUMAN_LEAVE_TYPES, REQUEST_STATUS } from '~/util/constants';
import { ApiService } from './api-service';

@inject(ApiService)
export class LeaveService {
    constructor(api) {
        this.http = api.http;
    }

    getLeaveRequests() {
        return this.http.get('leaves');
    }

    getLeaveRequest(requestId) {
        return this.http.get(`leaves/${requestId}`);
    }

    async getCalendarEvents() {
        let leaves = await this.getLeaveRequests();
        // show just the approved leaves
        leaves = leaves.filter(x => x.status === REQUEST_STATUS.APPROVED);

        const events = leaves.map(leave => {
            const { leaveType } = leave;

            return {
                id: leave._id,
                title: `${leave.userId.fullName} | ${HUMAN_LEAVE_TYPES[leaveType]}`,
                type: leaveType,
                class: this.computeEventClass(leaveType),
                start: moment(leave.start).valueOf(),
                end: moment(leave.end).valueOf()
            }
        });

        return events;
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
        const { start, end, workDays, leaveType, userId } = request;
        const leave = {
            leaveType,
            start,
            end,
            workDays,
            userId,
            status: REQUEST_STATUS.PENDING
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

    deleteRequest(requestId) {
        return this.http.delete(`leaves/${requestId}`);
    }

    updateLeaveRequestStatus(request, status) {
        request.status = status;
        return this.http.patch(`leaves/${request._id}`, request);
    }

    updateLeaveRequest(request) {
        return this.http.put(`leaves/${request._id}`, request);
    }

    fetch(endpoint) {
        return this.http.get(endpoint);
    }
}
