import BaseHoliday from './base-holiday';

export class CreateHoliday extends BaseHoliday {
    holiday = {
        name: '',
        description: '',
        date: Date.now()
    };

    activate() {
        this.setTemplateParams();
        this.holiday.submit = this.createHoliday.bind(this);
    }

    setTemplateParams() {
        this.ctaButtonLabel = 'Create Holiday';
    }
}
