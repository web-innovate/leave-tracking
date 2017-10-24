import BaseHoliday from './base-holiday';

export class EditHoliday extends BaseHoliday {

    async activate(params) {
        this.setTemplateParams();
        this.holiday = await this._holiday.getHoliday(params.holidayId);
        this.holiday.submit = this.save.bind(this);
    }

    setTemplateParams() {
        this.isEdit = true;
        this.ctaButtonLabel = 'Save';
    }
}
