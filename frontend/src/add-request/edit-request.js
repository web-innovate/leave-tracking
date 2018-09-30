import Moment from 'moment';
import { extendMoment } from 'moment-range';
const moment = extendMoment(Moment);

import business from 'moment-business';
import { bindable, inject } from 'aurelia-framework';
import { Router} from 'aurelia-router';
import { LeaveService } from '~/services/leave-service';
import { UserService } from '~/services/user-service';
import { HolidayService } from '~/services/holiday-service';
import { LEAVE_TYPES, HUMAN_LEAVE_TYPES } from '~/util/constants';

const {
    ANNUAL,
    SICK,
    PARENTING,
    UNPAID,
    STUDY,
    HALF_DAY,
    BEREAVEMENT_LEAVE,
    MARRIAGE_LEAVE } = LEAVE_TYPES;

@inject(LeaveService, UserService, HolidayService, Router)
export class EditRequest {
    @bindable sPick;
    @bindable ePick;
    @bindable leaveType;

    constructor(_leave, _user, _holiday, router) {
        this._leave = _leave;
        this._user = _user;
        this._holiday = _holiday;
        this.router = router;
    }

    async activate(params) {
        this.request = await this._leave.getLeaveRequest(params.requestId);
        this.selectedLeave = this.request.leaveType;
        this.start = moment(this.request.start).toDate() ;
        this.end = moment(this.request.end).toDate();
        this.dateDiff = this.request.workDays;
    }

    attached() {
        this.start = moment(this.request.start).toDate() ;
        this.end = moment(this.request.end).toDate();

        // this.disableDates();
        // this.computeDiff();
    }

    dateFormat = 'YYYY-MM-DD';
    allowedDate = moment().subtract(1, "days").toDate();
    start = '';
    end = '';
    holidays = [];

    pickerOptions = {
        calendarWeeks: true,
        showTodayButton: true,
        showClose: true,
        daysOfWeekDisabled: [0, 6], // we disable saturday & sunday
        format: this.dateFormat,
        minDate: this.allowedDate,
        widgetPositioning: {
            horizontal: 'left'
        }
    };

    selectedLeave = {};
    leaveTypes = [
        { value: ANNUAL , option: HUMAN_LEAVE_TYPES[ANNUAL] },
        { value: SICK, option: HUMAN_LEAVE_TYPES[SICK] },
        { value: PARENTING, option: HUMAN_LEAVE_TYPES[PARENTING] },
        { value: STUDY, option: HUMAN_LEAVE_TYPES[STUDY] },
        { value: UNPAID, option: HUMAN_LEAVE_TYPES[UNPAID] },
        { value: HALF_DAY, option: HUMAN_LEAVE_TYPES[HALF_DAY] },
        { value: BEREAVEMENT_LEAVE, option: HUMAN_LEAVE_TYPES[BEREAVEMENT_LEAVE] },
        { value: MARRIAGE_LEAVE, option: HUMAN_LEAVE_TYPES[MARRIAGE_LEAVE] }
    ];

    leaveTypeChanged() {
        this.leaveType.events.onChanged = (e) => {
            if (this.isHalfDaySelected()) {
                this.ePick.methods.date(this.sPick.methods.date().toDate());
                this.ePick.methods.disable();
            } else {
                this.ePick.methods.minDate(this.sPick.methods.date().toDate());
                this.ePick.methods.enable();
            }
        };

    }

    isHalfDaySelected() {
        return this.leaveType.methods.val() === 'half-day-leave'
    }

    sPickChanged() {
        this.sPick.events.onChange = (e) => {
            if (this.isHalfDaySelected()) {
                this.ePick.methods.date(this.sPick.methods.date().toDate());
            } else {
                this.ePick.methods.minDate(this.sPick.methods.date().toDate());
            }

            this.start = this.sPick.methods.date().toDate();

            this.computeDiff();
        }

        this.sPick.events.onHide = (e) => {
            this.ePick.methods.show();
        }
    }

    ePickChanged() {
        this.ePick.events.onChange = (e) => {
            this.end = this.ePick.methods.date().toDate();
            this.computeDiff();
        }
    }

    computeDiff() {
        const fr = moment(this.start);
        const to = moment(this.end);
        const range = moment.range(fr, to);
        let dateDiff = business.weekDays(fr,to) + 1;

        // go over each holiday and see if the range contains any
        // if it does we do not count that holiday :)
        // it is that easy
        this.holidays.forEach(holiday => {
            const hDate = moment(holiday.date).toDate();

            if(range.contains(hDate)) {
                dateDiff--;
            }
        });

        this.dateDiff = dateDiff;
    }

    get canSave() {
        return this.start && this.end && this.dateDiff >= 1;
    }

    submit() {
        if (this.canSave) {
            this.start = moment(this.start).startOf('day').toDate();
            this.end = moment(this.end).endOf('day').toDate();
            const leave = {
                _id :this.request._id,
                userId: this._user.currentUser.id,
                leaveType: this.selectedLeave,
                start: this.start,
                end: this.end,
                workDays: this.dateDiff
            };

            this._leave.updateLeaveRequestStatus(leave, this.request.status)
                .then(() => {
                    this.start = moment().toDate();
                    this.end = moment().toDate();
                    this.dateDiff = 0;

                    this.router.navigate('home')
                });
        }
    }

    async disableDates() {
        const holidays = await this._holiday.getHolidays();
        const disabledDates = holidays.map(h => moment(h.date).toDate());

        this.ePick.methods.disabledDates(disabledDates);
        this.sPick.methods.disabledDates(disabledDates);
        this.holidays = holidays;
    }
}
