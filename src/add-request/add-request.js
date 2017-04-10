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

    start = moment().toDate();
    end = moment().toDate();

    pickerOptions = {
        daysOfWeekDisabled: [0, 6], // we disable saturday & sunday
        format: 'YYYY-MM-DD',
        minDate: moment().toDate(),
        widgetPositioning: {
            horizontal: 'left'
        }
    };

    sPickChanged() {
        this.sPick.events.onChange = (e) => {
            this.ePick.methods.minDate(e.date);
            this.computeDiff(e.date, this.end);
        }
    }
    ePickChanged() {
        const that = this;
        this.ePick.events.onChange = (e) => {
            this.computeDiff(this.start, e.date);
        }
    }

    computeDiff(start, end) {
        const fr = moment(end);
        const to = moment(start);


        this.dateDiff = business.weekDays(to,fr);

        if (this.dateDiff < 0) {
            this.computeDiff(this.start, this.end)
        }
    }

    get canSave() {
        return this.start && this.end && this.dateDiff > 0;
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
            this.computeDiff(this.start, this.end)
        }
    }
}
