import 'jquery'
import 'moment'
import 'fullcalendar'
import 'calendar'
import 'bootstrap-calendar'
import moment from 'moment'


export class Calendar {
    constructor() {
    }

    attached() {
        $('#calendar').calendar(
        {
            tmpl_path: "bootstrap-calendar/tmpls/",
            events_source: function () {
                return [ {
                    "id": 293,
                    "title": "Event 1",
                    "url": "http://example.com",
                    "class": "event-important",
                        "start": moment().valueOf(), // Milliseconds
                        "end": moment().valueOf() // Milliseconds
                    }];
                },
                modal_type: 'template',
                        tmpl_cache: true,

                modal: '#events-modal',
                view: 'month',
                weekbox: false,
                views: {
                    year: {
                        slide_events: 1,
                        enable: 1
                    },
                    month: {
                        slide_events: 1,
                        enable: 1
                    },
                    week: {
                        enable: 1
                    },
                    day: {
                        enable: 0
                    }
                },
                merge_holidays: true,
                holidays: {
                    '04-04': 'New Year\'s Day',
                    '09-04': 'New Year\'s Day',
                    '09-04': 'New Year\'s Day',
                }
            }
            );
    }
}