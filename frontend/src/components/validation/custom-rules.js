import { ValidationRules } from 'aurelia-validation';

export function setupCustomValidationRules() {
    const integerRangeMessage = `\${$displayName} must be an integer between \${$config.min} and \${$config.max}.`;
    const integerRangeRule = function(value, obj, min, max) {
        return value === null || value === undefined
            || Number.isInteger(parseInt(value)) && parseInt(value) >= min && parseInt(value) <= max;
    };

    const otherThanMessage = `\${$displayName} must be selected.`;
    const otherThanRule = function(value, obj, str) {
        return value === null || value === undefined || value !== str;
    };

    ValidationRules.customRule(
        'integerRange',
        integerRangeRule,
        integerRangeMessage,
        (min, max) => ({ min, max })
    );
    ValidationRules.customRule(
        'otherThan',
        otherThanRule,
        otherThanMessage
    );
}
