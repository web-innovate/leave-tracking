import moment from 'moment';

export class DateFormatValueConverter {
  toView(value, format = 'M/D/YYYY') {
    return moment(value).format(format);
  }
}
