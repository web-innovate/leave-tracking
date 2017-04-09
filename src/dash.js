import { inject } from 'aurelia-framework';
import { LeaveService } from './services/leave-service';
import { REQUEST_STATUS } from './util/constants';

@inject(LeaveService)
export class Dash {
    constructor(leaveService) {
      this.leaveService = leaveService;
    }

    activate() {
     this.leaveRequests();
    }

    leaveRequests() {
        return this.leaveService.getLeaveRequests().then(result => this.allRequests = result);
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
