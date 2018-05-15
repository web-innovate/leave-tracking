import { inject } from 'aurelia-framework';
import { ApiService } from './api-service';

@inject(ApiService)
export class AuditService {

    constructor(api) {
        this.http = api.http;
    }

    getAudits() {
        return this.http.get('audit');
    }

    getAudit(id) {
        return this.http.get(`audit/${id}`);
    }
}
