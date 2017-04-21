
import { REQUEST_STATUS } from '~/util/constants'

export class ComputeBadgeValueConverter {
    toView(value) {
        switch(value) {
            case REQUEST_STATUS.APPROVED:
                return 'list-group-item-success';
            case REQUEST_STATUS.REJECTED:
                return 'list-group-item-danger';
            case REQUEST_STATUS.PENDING:
                return 'list-group-item-info';
        }
    }
}
