import { inject, bindable } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { HolidayService } from '~/services/holiday-service';
import moment from 'moment';

import { ValidationControllerFactory, ValidationRules } from 'aurelia-validation';
import { ValidationFormRenderer } from '~/validators/validation-form-renderer'


@inject(HolidayService, ValidationControllerFactory, Router)
export class CreateHoliday {
    @bindable date;

    rules = ValidationRules
        .ensure('name')
        .required()
        .ensure('description')
        .required()
        .rules;

    constructor(_holiday, vCtrl, router) {
        this._holiday = _holiday;
        this.router = router;
        this.vCtrl = vCtrl.createForCurrentScope();
        this.vCtrl.addRenderer(new ValidationFormRenderer());
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

    async createHoliday() {
        const res = await this.vCtrl.validate();
        if(res.valid) {
            await this._holiday.createHoliday(this.holiday);
            return this.router.navigateToRoute('holidays')
        } else {
            return Promise.reject();
        }
    }
}
