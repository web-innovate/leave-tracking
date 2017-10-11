import environment from '~/environment';
import moment from 'moment'
export function configure(aurelia) {

    aurelia.use
        .standardConfiguration()
        .plugin('aurelia-bootstrap')
        .plugin('aurelia-bootstrap-datetimepicker')
        .plugin('aurelia-validation')
        .plugin('aurelia-bootstrap-select')
        .plugin("aurelia-chart")
        .plugin('aurelia-notify', settings => {
          settings.timeout = 4000;
        })
        .feature('resources');

    if (environment.debug) {
        aurelia.use.developmentLogging();
    }

    if (environment.testing) {
        aurelia.use.plugin('aurelia-testing');
    }

    aurelia.start().then(() => aurelia.setRoot());
}
