import moment from 'moment';
import { inject } from 'aurelia-framework';
import { REQUEST_STATUS } from '../util/constants';
import { ApiService } from './api-service';
import { UserService } from './user-service';

@inject(ApiService, UserService)
export class LeaveService {
    leaveRequests = [
                {
                    workDays: 1,
                    start: 'Wed Apr 12 2017 00:00:00 GMT+0300 (EEST)',
                    end: 'Wed Apr 13 2017 00:00:00 GMT+0300 (EEST)',
                    status: 'approved'
                },
                {
                    workDays: 2,
                    start: 'Wed Apr 12 2017 00:00:00 GMT+0300 (EEST)',
                    end: 'Wed Apr 14 2017 00:00:00 GMT+0300 (EEST)',
                    status: 'rejected'
                },
                {
                    workDays: 3,
                    start: 'Wed Apr 12 2017 00:00:00 GMT+0300 (EEST)',
                    end: 'Wed Apr 15 2017 00:00:00 GMT+0300 (EEST)',
                    status: 'pending'
                }
            ];

    approvedLeaves = [
        {
            "id": 1,
            "title": "Jane",
            "url": "http://example.com",
            "class": "event-important",
            "start": moment().subtract(2, 'days').toDate().valueOf(), // Milliseconds
            "end": moment().valueOf() // Milliseconds
        },
        {
            "id": 2,
            "title": "John",
            "url": "http://example.com",
            "class": "event-special",
            "start": moment().valueOf(), // Milliseconds
            "end": moment().valueOf() // Milliseconds
        }
    ];

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

            const leaveEvent = {
                id: leave._id,
                title: user.fullName,
                url: '123',
                start: moment(leave.start).toDate().valueOf(),
                end: moment(leave.end).toDate().valueOf()
            }
            return await leaveEvent;
        })

        return await Promise.all(events)
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
        console.log('saving', request);
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
            })
    }
}
