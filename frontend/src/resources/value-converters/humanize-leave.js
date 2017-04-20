import { HUMAN_LEAVE_TYPES } from '~/util/constants';

export class HumanizeLeaveValueConverter {
  toView(value) {
    return HUMAN_LEAVE_TYPES[value];
  }
}