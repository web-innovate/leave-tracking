import {inject} from 'aurelia-framework';
import { HolidayService } from '~/services/holiday-service';

@inject(HolidayService)
export class ViewHolidays {
    loading = true;
    constructor(_holiday) {
        this._holiday = _holiday;
    }

    async attached() {
        console.log('>>>>')
        const holidays = await this._holiday.getHolidays();

        this.holidays = holidays;
        this.loading = false;
    }
}
