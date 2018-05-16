import { inject } from 'aurelia-framework';
import { ApiService } from './api-service';

@inject(ApiService)
export class HolidayService {

    constructor(api) {
        this.http = api.http;
    }

    createHoliday(holiday) {
        return this.http.post('holidays', holiday);
    }

    getHolidays() {
        return this.http.get('holidays');
    }

    getAggregatedHolidays() {
        return this.http.get('holidays/aggregate');
    }

    getHoliday(id) {
        return this.http.get(`holidays/${id}`);
    }

    deleteHoliday(id) {
        return this.http.delete(`holidays/${id}`);
    }

    updateHoliday(holiday) {
        return this.http.put(`holidays/${holiday._id}`, holiday);
    }
}
