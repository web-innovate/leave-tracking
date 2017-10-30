import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { HolidayService } from '~/services/holiday-service';
import {
    ValidationRules,
    ValidationControllerFactory,
    validateTrigger
} from 'aurelia-validation';
import { BootstrapFormRenderer } from '~/components/validation/bootstrap-form-renderer';
import { compareObjects, setupValidationControllers } from '~/util/utils';

@inject(HolidayService, Router, ValidationControllerFactory)
export default class BaseHoliday {

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

    constructor(_holiday, router, controllerFactory) {
        this._holiday = _holiday;
        this.router = router;
        this.originalHoliday = {};

        setupValidationControllers(controllerFactory, BootstrapFormRenderer, this, validateTrigger);
    }

    attached() {
        ValidationRules
            .ensure('name')
                .required()
            .ensure('description')
                .required()
            .on(this.holiday);
    }

    activate(model) {
        this.holiday = model;
        this.originalHoliday = JSON.parse(JSON.stringify(this.holiday));
    }

    get canSave() {
        return compareObjects(this.holiday, this.originalHoliday);
    }

    async save() {
        await this._holiday.updateHoliday(this.holiday);
        this.router.navigateBack();
    }

    async delete() {
        await this._holiday.deleteHoliday(this.holiday._id);
        this.router.navigateBack();
    }

    async createHoliday() {
        this._holiday.createHoliday(this.holiday)
            .then(() => this.router.navigateToRoute('holidays'));
    }

    submit() {
        return this.controller.validate()
            .then(result => result.valid && this.holiday.submit());
    }
}
