import { inject } from 'aurelia-framework';
import { LeaveService } from './services/leave-service'
import { HUMAN_LEAVE_TYPES } from './util/constants';

@inject(LeaveService)
export class Calendar {
    isLoading = true;
    calendar ={}
    constructor(leaveService) {
        this.leaveService = leaveService;
    }

    async attached() {
        const events = await this.leaveService.getCalendarEvents()

        this.displayCalendar(events)
        this.isLoading = false;
    }

    displayCalendar(events) {
        this.calendar = $('#calendar').calendar(
            {
                tmpl_path: "bootstrap-calendar/tmpls/",
                events_source: events,
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
                holidays: {
                },
                onAfterViewLoad: function(view) {
                    $('.page-header h3').text(this.getTitle());
                    $('.btn-group button').removeClass('active');
                    $('button[data-calendar-view="' + view + '"]').addClass('active');
                }
            }
      );
    }

    switchViewTo(view) {
        this.calendar.view(view);
    }
    navigateTo(nav) {
        this.calendar.navigate(nav);
    }
}