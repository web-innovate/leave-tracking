import { inject } from 'aurelia-framework';
import { Api } from './api/api';
import { REQUEST_STATUS } from './util/constants';

@inject(Api)
export class Dash {
    constructor(api) {
      this.api = api;
    }

    activate() {
     this.leaveRequests();
    }

    leaveRequests() {
        return this.api.getLeaveRequests().then( result => this.allRequests = result);
    }

    computeBadge(requestStatus) {
        switch(requestStatus) {
            case REQUEST_STATUS.APPROVED:
                return 'list-group-item-success';
            case REQUEST_STATUS.REJECTED:
                return 'list-group-item-danger';
            case REQUEST_STATUS.PENDING:
                return 'list-group-item-info';
        }
    }
}
