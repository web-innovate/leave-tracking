
import { REQUEST_MAPPING } from '~/util/constants'

export class ComputeBadgeValueConverter {
    toView(value) {
        switch(value) {
            case REQUEST_MAPPING.APPROVED.status:
                return 'list-group-item-success';
            case REQUEST_MAPPING.REJECTED.status:
                return 'list-group-item-danger';
            case REQUEST_MAPPING.PENDING.status:
                return 'list-group-item-info';
        }
    }
}
