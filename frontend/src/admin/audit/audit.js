import { inject } from 'aurelia-framework';
import { AuditService } from '~/services/audit-service';

@inject(AuditService)
export class Audit {
    loading = true;

    constructor(_audit) {
        this._audit = _audit;
    }

    async attached() {
        this.audits = await this._audit.getAudits();
        this.loading = false;
    }
}
