import {inject} from 'aurelia-framework';
import { HolidayService } from '~/services/holiday-service';

@inject(HolidayService)
export class ViewHolidays {
    loading = true;
    constructor(_holiday) {
        this._holiday = _holiday;
    }

    async attached() {
        // const holidays = await this._holiday.getHolidays();
        const aggregatedHolidays = await this._holiday.getAggregatedHolidays();

        // this.holidays = holidays;
        this.aggregatedHolidays = aggregatedHolidays;

        this.loading = false;
    }
}
