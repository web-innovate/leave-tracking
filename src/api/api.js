export class Api {
    constructor() {
        this.leaveRequests = [
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
    }

    getLeaveRequests() {
        return new Promise((resolve, reject) => {
            resolve(this.leaveRequests);
        });
    }

    addLeaveRequest(request) {
        const { start, end, workDays } = request;
        console.log('pushing: ', request)
        this.leaveRequests.push({
            start,
            end,
            workDays,
            status: 'pending'
        })
    }
}
