export function configure(config) {
    config.globalResources(
        './value-converters/date-format',
        './value-converters/humanize-leave',
        './elements/spinner/spinner.html',
        './elements/dialogs/dialog-footer.html'
    );
}
