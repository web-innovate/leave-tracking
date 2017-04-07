import { bindable, inject, ObserverLocator } from 'aurelia-framework';
import moment from 'moment'
import business from 'moment-business';


@inject(ObserverLocator)
export class AddRequest {
    @bindable sPick;
    @bindable ePick;

    pickerOptions = {
        daysOfWeekDisabled: [0, 6],
        format: 'YYYY-MM-DD',
        showTodayButton: true,
        minDate: moment.now(),
        widgetPositioning: {
            horizontal: 'left'
        }
    };

    start = '';
    end = '';


    constructor(observer) {
        this.observer = observer;
        const subscription = this.observer
        .getObserver(this, 'end')
        .subscribe(this.leaveChanged);
    }

    leaveChanged(newVal, oldVal) {
        console.log('newVal', newVal)
        console.log('oldVal', oldVal)
    }

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
        const fr = moment(end, 'YYYY-MM-DD');
        const to = moment(start, 'YYYY-MM-DD');


        this.dateDiff = business.weekDays(to,fr);

        if (this.dateDiff < 0) {
            this.computeDiff(this.start, this.end)
        }

    }

    get canSave() {
        return this.start && this.end && this.dateDiff > 0;
    }
}
