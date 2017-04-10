import moment from 'moment';

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

    getLeaveRequests() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(this.leaveRequests);
            }, 500);
        });
    }

    addLeaveRequest(request) {
        const { start, end, workDays, leaveType } = request;
        console.log('saving', request);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.leaveRequests.push({
                    leaveType,
                    start,
                    end,
                    workDays,
                    status: 'pending'
                });
            }, 500)
        });
    }

    getApprovedLeaves() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(this.approvedLeaves);
            }, 1000)
        })
    }
}
