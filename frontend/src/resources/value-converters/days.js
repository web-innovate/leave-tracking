export class DaysValueConverter {
    toView(value) {
        return value != 1 ? `${value} Days` : `${value} Day`;
    }
}
