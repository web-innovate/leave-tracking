import { ValidationRules } from 'aurelia-validation';

export function setupCustomValidationRules() {
    ValidationRules.customRule(
        'integerRange',
        (value, obj, min, max) => value === null || value === undefined
            || Number.isInteger(parseInt(value)) && parseInt(value) >= min && parseInt(value) <= max,
        `\${$displayName} must be an integer between \${$config.min} and \${$config.max}.`,
        (min, max) => ({ min, max })
    );
    ValidationRules.customRule(
        'otherThan',
        (value, obj, str) => value === null || value === undefined || value !== str,
        `\${$displayName} must be selected.`
    );
}
