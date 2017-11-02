import { ObserverLocator, inject } from 'aurelia-framework';

@inject(ObserverLocator)
export class MultiObserver {
    constructor(observerLocator) {
        this.observerLocator = observerLocator;
    }

    observe(properties, callback) {
        const subscriptions = [];
        let i = properties.length;
        let object = {};
        let propertyName = {};

        while(i--) {
            object = properties[i][0];
            propertyName = properties[i][1];
            subscriptions.push(this.observerLocator.getObserver(object, propertyName).subscribe(callback));
        }

        // return dispose function
        return () => {
            while(subscriptions.length) {
                subscriptions.pop()();
            }
        }
    }
}
