import environment from '~/environment';
import { setupCustomValidationRules } from '~/components/validation/custom-rules';
import LogRocket from 'logrocket';

export function configure(aurelia) {

    aurelia.use
        .standardConfiguration()
        .plugin('aurelia-bootstrap')
        .plugin('aurelia-bootstrap-datetimepicker')
        .plugin('aurelia-validation')
        .plugin('aurelia-bootstrap-select')
        .plugin("aurelia-chart")
        .plugin('aurelia-notify', settings => {
          settings.timeout = 5000;
        })
        .plugin('aurelia-google-analytics', config => {
            config.init('UA-118670465-1');
            config.attach({
                logging: {
                    // Set to `true` to have some log messages appear in the browser console.
                    enabled: true
                },
                pageTracking: {
                    // Set to `false` to disable in non-production environments.
                    enabled: true,
                    // Optional. By default it gets the title from payload.instruction.config.title.
                    getTitle: (payload) => {
                        // For example, if you want to retrieve the tile from the document instead override with the following.
                        return document.title;
                    },
                    // Optional. By default it gets the URL fragment from payload.instruction.fragment.
                    getUrl: (payload) => {
                    // For example, if you want to get full URL each time override with the following.
                    return window.location.href;
                    }
                },
                clickTracking: {
                    // Set to `false` to disable in non-production environments.
                    enabled: true,
                    // Optional. By default it tracks clicks on anchors and buttons.
                    filter: (element) => {
                        // For example, if you want to also track clicks on span elements override with the following.
                        return element instanceof HTMLElement &&
                        (element.nodeName.toLowerCase() === 'a' ||
                        element.nodeName.toLowerCase() === 'button' ||
                        element.nodeName.toLowerCase() === 'span');
                    }
                },
                exceptionTracking: {
                    // Set to `false` to disable in non-production environments.
                    enabled: true
                }
            });
        })
        .feature('resources');

    if (environment.debug) {
        aurelia.use.developmentLogging();
    }

    if (environment.testing) {
        aurelia.use.plugin('aurelia-testing');
    }

    setupCustomValidationRules();
    aurelia.start().then(() => {
        if (!environment.debug) {
            LogRocket.init('o8pmf8/leave-tracker');
        }
        return aurelia.setRoot()
    });
}
