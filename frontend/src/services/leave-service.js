import moment from 'moment';
import {HttpClient} from 'aurelia-http-client';


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

    constructor() {
        // const backendURL = 'http://localhost:4040/api/';
        const backendURL = 'https://be-leave-tracking.herokuapp.com/api/';

        this.http = new HttpClient().configure(x => {
            x.withHeader('Content-Type', 'application/json');
            x.withBaseUrl(backendURL);
          //x.withCredentials(true);
        });
    }
    getLeaveRequests() {
        return this.http.get('leaves')
            .then(res => {
                console.log('>>>>>', JSON.parse(res.response))
                return JSON.parse(res.response)
            }
                );
        // return new Promise((resolve, reject) => {
        //     setTimeout(() => {
        //         resolve(this.leaveRequests);
        //     }, 500);
        // });
    }

    addLeaveRequest(request) {
        const { start, end, workDays, leaveType, userId } = request;
        const leave = {
            userId,
            leaveType,
            start,
            end,
            workDays,
            status: 'pending'
        };
        this.leaveRequests.push(leave);
        return this.http.post('leaves', leave);
        console.log('saving', request);
        // return new Promise((resolve, reject) => {
        //     setTimeout(() => {
        //         this.leaveRequests.push(leave);
        //     }, 500)
        // });
    }

    getApprovedLeaves() {

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(this.approvedLeaves);
            }, 500)
        })
    }

    getPendingApprovals() {
        
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(this.leaveRequests);
            }, 500)
        })
    }
}
