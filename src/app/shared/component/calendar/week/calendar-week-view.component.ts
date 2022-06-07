import { Component, Input, Output, EventEmitter, OnChanges, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { WeekDay, WeekView, DayViewEvent } from 'calendar-utils';
import { CalendarUtils } from '../common/calendar-utils.provider';
import { getWeekViewPeriod } from '../common/util';
import { DateAdapter } from '../date-adapters/date-adapter';
import { PlacementArray } from 'positioning';
import { Week, DayColumn, Room, CalendarEvent, Event } from '../service/calendar.service';
import { DatePipe } from '@angular/common';
import { CalendarView } from '../common/calendar-common.module';

@Component({
  selector: 'calendar-week-view',
  templateUrl: 'calendar-week-view.html'
})
export class CalendarWeekViewComponent implements OnChanges, OnInit, OnDestroy {

  @Input() viewDate: Date;
  @Input() excludeDays: number[] = [];
  @Input() tooltipPlacement: PlacementArray = 'auto';
  @Input() tooltipDelay: number | null = 3000;
  @Input() weekStartsOn: number;
  @Input() weekendDays: number[];
  @Input() daysInWeek: number;
  @Output() eventClicked = new EventEmitter<{ event: CalendarEvent; }>();
  days: WeekDay[];
  refreshSubscription: Subscription;

  constructor(
    protected utils: CalendarUtils,
    protected dateAdapter: DateAdapter,
    private datePipe: DatePipe
  ) { }

  week: Week = {} as Week;

  @Input() rooms: Room[];
  @Input() events: CalendarEvent[];
  @Input() calendarView: CalendarView;
  @Input() precision: 'days' | 'minutes' = 'days';
  @Input() hourSegments: number = 2;
  @Input() dayEndHour: number = 23;
  @Input() dayStartHour: number = 0;
  @Input() dayStartMinute: number = 0;
  @Input() dayEndMinute: number = 59;
  @Input() hourSegmentHeight: number = 30;
  view: WeekView;
  @Input() refresh: Subject<any>;

  ngOnInit() {
    if (this.refresh) {
      this.refreshSubscription = this.refresh.subscribe(() => {
        this.refreshHeader();
        this.getEvents();
      });
    }
  }

  getEvents() {
    this.week.roomColumns = this.rooms.map(room => { return { room: room, height: 0 }; });
    let dayColumn: DayColumn[] = this.days.map(() => new DayColumn());
    for (let r = 0; r < this.rooms.length; r++) {

      for (let d = 0; d < this.days.length; d++) {
        let events = this.events.filter(event => this.datePipe.transform(event.date, 'ddMMyyyy') === this.datePipe.transform(this.days[d].date, 'ddMMyyyy') && event.room === this.rooms[r].value);
        let dayViewEvent: Event[] = [];

        for (let e = 0; e < events.length; e++) {
          dayViewEvent.push({
            event: events[e],
            height: 45,
            width: 100,
            top: (44 * e) + this.week.roomColumns.reduce((height, room) => height + room.height, 0) - this.week.roomColumns[r].height,
            left: 0
          });
        }

        const height = dayViewEvent.length === 0 ? 44 : r < this.rooms.length - 1 ? (dayViewEvent.length * 44) + 2 : (dayViewEvent.length * 44) + 1;
        if (!this.week.roomColumns[r].height || height > this.week.roomColumns[r].height) {
          this.week.roomColumns[r].height = height;
        }

        if (!dayColumn[d].events) dayColumn[d].events = [];
        if (dayViewEvent.length > 0) dayColumn[d].events.push(...dayViewEvent);
      };
    }

    this.week.dayColumns = dayColumn;
  }

  ngOnChanges(changes) {
    if (changes.events || changes.viewDate) {
      this.refreshHeader();
      this.getEvents();
    }
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  refreshHeader(): void {
    this.days = this.utils.getWeekViewHeader({
      viewDate: this.viewDate,
      weekStartsOn: this.weekStartsOn,
      excluded: this.excludeDays,
      weekendDays: this.weekendDays,
      ...getWeekViewPeriod(
        this.dateAdapter,
        this.viewDate,
        this.weekStartsOn,
        this.excludeDays,
        this.daysInWeek
      )
    });
  }
}
