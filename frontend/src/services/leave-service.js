import moment from 'moment';
import { inject } from 'aurelia-framework';
import { REQUEST_STATUS, LEAVE_TYPES, HUMAN_LEAVE_TYPES } from '../util/constants';
import { ApiService } from './api-service';
import { UserService } from './user-service';

@inject(ApiService, UserService)
export class LeaveService {
    constructor(api, _user) {
        this.http = api.http;
        this._user = _user;
    }

    getLeaveRequests() {
        return this.http.get('leaves')
            .then(res => JSON.parse(res.response));
    }

    async getCalendarEvents() {
        let leaves = await this.getLeaveRequests();
        // show just the approved leaves
        leaves = await leaves.filter(x => x.status === 'approved');

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
            return await leaveEvent;
        });

        return await Promise.all(events)
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

    getApprovedLeaves() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(this.approvedLeaves);
            }, 500)
        })
    }

    getPendingApprovals() {
        //todo send filtering params to leaves
        return this.http.get('leaves')
            .then(res => {
                return JSON.parse(res.response)
                    .filter(item => item.status === REQUEST_STATUS.PENDING)
            });
    }

    updateLeaveRequestStatus(request, status) {
        request.status = status;
        return this.http.put(`leaves/${request._id}`, request)
            .then(res => {
                console.log('the response', JSON.parse(res.response));
            });
    }
}
