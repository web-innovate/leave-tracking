import { inject, bindable } from 'aurelia-framework';
import { HolidayService } from '~/services/holiday-service';
import moment from 'moment';

@inject(HolidayService)
export class CreateHoliday {
    @bindable date;

    constructor(_holiday) {
        this._holiday = _holiday;
    }

    pickerOptions = {
        calendarWeeks: true,
        showTodayButton: true,
        showClose: true,
        daysOfWeekDisabled: [0, 6], // we disable saturday & sunday
        format: 'YYYY-MM-DD',
        widgetPositioning: {
            horizontal: 'left'
        },
    };

    createHoliday() {
        this._holiday.createHoliday(this.holiday)
    }
}
