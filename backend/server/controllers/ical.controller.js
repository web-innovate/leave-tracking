// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import httpStatus from 'http-status';
// import APIError from '../helpers/APIError';
// import config from '../../config/config';
// import { UserSchema } from '../models/user.model';
// import worker from '../../worker/worker';
// import PasswordResetTokenSchema from '../models/password-reset-token.model';
// import mongoose from 'mongoose';
import ical from 'ical-generator';
import LeaveRequest from '../models/leave-request.model';
import Holiday from '../models/holiday.model';
import moment from 'moment';
let cal;

async function  list(req, res, next) {
    cal = ical({
        domain: 'sebbo.net',
        prodId: {company: 'superman-industries.com', product: 'ical-generator'},
        name: 'Leave tracker',
        // timezone: 'Europe/Berlin',
        url: 'http://localhost:4040/api/iCal'
    });

    const asd = await LeaveRequest.list({query: { status: 'pending' }});
    const holidays = await Holiday.list()
        .map(holiday => moment(holiday.date).format('YYYY-MM-DD'));

    asd.forEach(event => attachEventToCalendar(holidays, event));
    res.send(cal.toString());
    // next();
}

function attachEventToCalendar(holidays, event) {
    if (event.workDays > 1) {
        splitEvents(holidays, event);
    } else {
        createEvent(event);
    }
}

function splitEvents(holidays, event) {
    const start = moment(event.start);
    const end = moment(event.end);

    const diff = end.diff(start, 'days');

    for (let i = 0; i < diff; i++) {
        const custom = moment(event.start).add('days', i);

        if (holidays.indexOf(moment(custom).format('YYYY-MM-DD')) != -1) {
            continue;
        }

        createEvent(event, custom);
    }
}

function createEvent(event, customDate) {
    cal && cal.createEvent({
        start: (customDate && customDate.toDate()) || event.start,
        // end: event.end,
        summary: `${event.leaveType} | ${event.userId}`,
        description: `total work: ${event.workDays}| ${event.status}`,
        location: `my room ${event.start} - ${event.end}`,
        url: 'http://sebbo.net/'
    });
}

function addDay(date) {
    date = moment(date);
    switch(date.day()) {

    case 6:
        return date.add('days', 2);
    default:
        return date.add('days', 1);
    }
}

export default { list };
