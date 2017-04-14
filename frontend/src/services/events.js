import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(EventAggregator)
export class Events {
    constructor(EventAggregator) {
        this.ea = EventAggregator;
    }
}