import moment from 'moment';

export class DateFormatValueConverter {
  toView(value, format = 'DD/MM/YYYY') {
    return moment(value).format(format);
  }
}
