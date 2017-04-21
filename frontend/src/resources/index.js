export function configure(config) {
    config.globalResources(
        './value-converters/days',
        './value-converters/date-format',
        './value-converters/humanize-leave',
        './value-converters/compute-badge',
        './elements/spinner/spinner.html',
        './elements/dialogs/dialog-footer.html'
    );
}
