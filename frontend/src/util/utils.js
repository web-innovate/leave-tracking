export const compareObjects = (objA, objB) => {
    for (let p in objA) {
        if (objA[p] !== objB[p]) {
            return false;
        }
    }
    return true;
};

export const setupValidationControllers = (cFactory, renderer, scope, validateTrigger) => {
    scope.controller = cFactory.createForCurrentScope();
    scope.controller.validateTrigger = validateTrigger.changeOrBlur;
    scope.controller.addRenderer(new renderer());
};