import { bindable, inject } from 'aurelia-framework';
import { LeaveService } from '../services/leave-service';
import moment from 'moment'
import business from 'moment-business';


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
        daysOfWeekDisabled: [0, 6], // we disable saturday & sunday
        format: this.dateFormat,
        minDate: this.allowedDate,
        widgetPositioning: {
            horizontal: 'left'
        }
    };

    sPickChanged() {
        this.sPick.events.onChange = (e) => {
            this.ePick.methods.minDate(e.date);
            this.start = e.date.toDate();
            this.computeDiff();
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
        this.computeDiff();
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
                start: this.start,
                end: this.end,
                workDays: this.dateDiff
            });

            this.start = moment().toDate();
            this.end = moment().toDate();
            this.computeDiff();
        }
    }
}
