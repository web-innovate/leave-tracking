import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { HolidayService } from '~/services/holiday-service';

@inject(HolidayService, Router)
export class EditHoliday {
    pickerOptions = {
        calendarWeeks: true,
        showTodayButton: true,
        showClose: true,
        daysOfWeekDisabled: [0, 6], // we disable saturday & sunday
        format: 'YYYY-MM-DD',
        widgetPositioning: {
            horizontal: 'left'
        }
    };

    constructor(_holiday, router) {
        this._holiday = _holiday;
        this.router = router;
    }

    async activate(params) {
        const holiday = await this._holiday.getHoliday(params.holidayId);
        this.holiday = holiday;
    }

    get canSave() {
        return this.holiday
            && this.holiday.name !== ''
            && this.holiday.description !== ''
            && this.holiday.date !== '';
    }

    async save() {
        await this._holiday.updateHoliday(this.holiday);
        this.router.navigateBack();
    }

    async delete() {
        await this._holiday.deleteHoliday(this.holiday._id);
        this.router.navigateBack();
    }

}
