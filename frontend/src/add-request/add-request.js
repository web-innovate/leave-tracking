import { bindable, inject } from 'aurelia-framework';
import { LeaveService } from '../services/leave-service';
import moment from 'moment'
import business from 'moment-business';
import { LEAVE_TYPES, HUMAN_LEAVE_TYPES } from '../util/constants';

const { ANNUAL, SICK, PARENTING, UNPAID, STUDY, HALF_DAY } = LEAVE_TYPES;

@inject(LeaveService)
export class AddRequest {
    @bindable sPick;
    @bindable ePick;

    constructor(leaveService) {
        this.leaveService = leaveService;
    }

    dateFormat = 'YYYY-MM-DD';
    allowedDate = moment().subtract(1, "days").toDate();
    start = moment().toDate();
    end = moment().toDate();

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
        { value: HALF_DAY, option: HUMAN_LEAVE_TYPES[HALF_DAY] }
    ];

    sPickChanged() {
        this.sPick.events.onChange = (e) => {
            this.ePick.methods.minDate(e.date);
            this.start = e.date.toDate();
            this.computeDiff();
        }

        this.sPick.events.onHide = (e) => {
            this.ePick.methods.show();
        }
    }
    ePickChanged() {
        const that = this;
        this.ePick.events.onChange = (e) => {
            this.end = e.date.toDate();
            this.computeDiff();
        }
    }

    attached() {
        // this.computeDiff();
    }

    computeDiff() {
        const fr = moment(this.start);
        const to = moment(this.end);

        this.dateDiff = business.weekDays(fr,to) + 1;

        console.log('from', fr)
        console.log('to', to)
    }

    get canSave() {
        return this.start && this.end && this.dateDiff >= 1;
    }

    submit() {
        if (this.canSave) {
            console.log('adding', this.start, this.end, this.dateDiff)
            this.leaveService.addLeaveRequest({
                leaveType: this.selectedLeave[0],
                start: this.start,
                end: this.end,
                workDays: this.dateDiff
            });

            this.start = moment().toDate();
            this.end = moment().toDate();
            this.dateDiff = 0;
        }
    }
}
