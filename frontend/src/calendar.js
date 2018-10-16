import { inject } from 'aurelia-framework';
import moment from 'moment';
import { LeaveService } from '~/services/leave-service'
import { HolidayService } from '~/services/holiday-service'

@inject(LeaveService, HolidayService)
export class Calendar {
    isLoading = true;
    calendar ={}
    config = {
        tmpl_path: "bootstrap-calendar/tmpls/",
        events_source: {},
        modal_type: 'template',
        tmpl_cache: true,
        modal: '#events-modal',
        modal_title: function(ev) {
            return ev.title;
        },
        view: 'month',
        weekbox: false,
        views: {
            day: {
                enable: 0
            }
        },
        merge_holidays: false,
        holidays: {},
        onAfterViewLoad: function(view) {
            $('.page-header h3').text(this.getTitle());
            $('.btn-group button').removeClass('active');
            $('button[data-calendar-view="' + view + '"]').addClass('active');
        }
    }

    constructor(_leave, _holiday) {
        this._leave = _leave;
        this._holiday = _holiday;
    }

    async attached() {
        const events = await this._leave.getCalendarEvents();
        const holidays = await this._holiday.getHolidays();

        this.setEventsToConfig(events);
        this.setHolidaysToConfig(holidays);

        this.displayCalendar();
        this.isLoading = false;
    }

    displayCalendar() {
        this.calendar = $('#calendar').calendar(this.config);
    }

    switchViewTo(view) {
        this.calendar.view(view);
    }
    navigateTo(nav) {
        this.calendar.navigate(nav);
    }

    setEventsToConfig(events) {
        this.config.events_source = events
    }

    setHolidaysToConfig(holidays) {
        const legalHolidays = {};

        holidays.forEach(h => {
            const date = moment(h.date).format('DD-MM');
            legalHolidays[date] = h.name;
        });

        this.config.holidays = legalHolidays;
    }
}
