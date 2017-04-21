import { inject } from 'aurelia-framework';
import { ApiService } from './api-service';

@inject(ApiService)
export class HolidayService {

    constructor(api) {
        this.http = api.http;
    }

    createHoliday(holiday) {
        return this.http.post('holidays', holiday)
            .then(res => this.toJson(res.response));
    }

    getHolidays() {
        return this.http.get('holidays')
            .then(res => this.toJson(res.response));
    }

    getHoliday(id) {
        return this.http.get(`holidays/${id}`)
            .then(res => this.toJson(res.response));
    }

    deleteHoliday(id) {
        return this.http.delete(`holidays/${id}`)
            .then(res => this.toJson(res.response));
    }

    updateHoliday(holiday) {
        return this.http.put(`holidays/${holiday._id}`, holiday);
    }

    toJson(data) {
        return JSON.parse(data);
    }
}
