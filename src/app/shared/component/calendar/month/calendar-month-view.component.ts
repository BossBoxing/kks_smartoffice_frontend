import { Component, OnChanges, Input, Output, EventEmitter, ChangeDetectorRef, OnInit, OnDestroy, LOCALE_ID, Inject, TemplateRef } from '@angular/core';
import { CalendarEvent, WeekDay, MonthView, MonthViewDay, ViewPeriod } from 'calendar-utils';
import { Subject, Subscription } from 'rxjs';
import { CalendarEventTimesChangedEvent, CalendarEventTimesChangedEventType } from '../common/calendar-event-times-changed-event.interface';
import { CalendarUtils } from '../common/calendar-utils.provider';
import { validateEvents } from '../common/util';
import { DateAdapter } from '../date-adapters/date-adapter';
import { PlacementArray } from 'positioning';
import { CalendarView } from '../common/calendar-common.module';

export interface CalendarMonthViewBeforeRenderEvent {
  header: WeekDay[];
  body: MonthViewDay[];
  period: ViewPeriod;
}

export interface CalendarMonthViewEventTimesChangedEvent<
  EventMetaType = any,
  DayMetaType = any
  > extends CalendarEventTimesChangedEvent<EventMetaType> {
  day: MonthViewDay<DayMetaType>;
}

/**
 * Shows all events on a given month. Example usage:
 *
 * ```typescript
 * <calendar-month-view
 *  [viewDate]="viewDate"
 *  [events]="events">
 * </calendar-month-view>
 * ```
 */
@Component({
  selector: 'calendar-month-view',
  templateUrl: 'calendar-month-view.html'
})
export class CalendarMonthViewComponent implements OnChanges, OnInit, OnDestroy {

  @Input() viewDate: Date;
  @Input() events: CalendarEvent[] = [];
  @Input() excludeDays: number[] = [];
  @Input() activeDayIsOpen: boolean = false;
  @Input() activeDay: Date;
  @Input() refresh: Subject<any>;
  @Input() locale: string;
  @Input() tooltipPlacement: PlacementArray = 'auto';
  @Input() tooltipTemplate: TemplateRef<any>;
  @Input() tooltipAppendToBody: boolean = true;
  @Input() tooltipDelay: number | null = null;
  @Input() weekStartsOn: number;
  @Input() headerTemplate: TemplateRef<any>;
  @Input() cellTemplate: TemplateRef<any>;
  @Input() openDayEventsTemplate: TemplateRef<any>;
  @Input() eventTitleTemplate: TemplateRef<any>;
  @Input() eventActionsTemplate: TemplateRef<any>;
  @Input() weekendDays: number[];
  @Output() beforeViewRender = new EventEmitter<CalendarMonthViewBeforeRenderEvent>();
  @Output() dayClicked = new EventEmitter<{ day: MonthViewDay; }>();
  @Output() eventClicked = new EventEmitter<{ event: CalendarEvent; }>();
  @Output() columnHeaderClicked = new EventEmitter<number>();
  @Output() eventTimesChanged = new EventEmitter<CalendarMonthViewEventTimesChangedEvent>();
  @Input() calendarView: CalendarView;
  columnHeaders: WeekDay[];
  view: MonthView;
  openRowIndex: number;
  openDay: MonthViewDay;
  refreshSubscription: Subscription;

  constructor(
    protected utils: CalendarUtils,
    protected dateAdapter: DateAdapter
  ) { }

  ngOnInit(): void {
    if (this.refresh) {
      this.refreshSubscription = this.refresh.subscribe(() => {
        this.refreshAll();
      });
    }
  }

  ngOnChanges(changes: any): void {
    const refreshHeader =
      changes.viewDate || changes.excludeDays || changes.weekendDays;
    const refreshBody =
      changes.viewDate ||
      changes.events ||
      changes.excludeDays ||
      changes.weekendDays;

    if (refreshHeader) {
      this.refreshHeader();
    }

    if (changes.events) {
      validateEvents(this.events);
    }

    if (refreshBody) {
      this.refreshBody();
    }

    if (
      changes.activeDayIsOpen ||
      changes.viewDate ||
      changes.events ||
      changes.excludeDays ||
      changes.activeDay
    ) {
      this.checkActiveDayIsOpen();
    }
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  refreshHeader(): void {
    this.columnHeaders = this.utils.getWeekViewHeader({
      viewDate: this.viewDate,
      weekStartsOn: this.weekStartsOn,
      excluded: this.excludeDays,
      weekendDays: this.weekendDays
    });
  }

  refreshBody(): void {
    this.view = this.utils.getMonthView({
      events: this.events,
      viewDate: this.viewDate,
      weekStartsOn: this.weekStartsOn,
      excluded: this.excludeDays,
      weekendDays: this.weekendDays
    });
  }

  protected checkActiveDayIsOpen(): void {
    if (this.activeDayIsOpen === true) {
      const activeDay = this.activeDay || this.viewDate;
      this.openDay = this.view.days.find(day =>
        this.dateAdapter.isSameDay(day.date, activeDay)
      );
      const index: number = this.view.days.indexOf(this.openDay);
      this.openRowIndex =
        Math.floor(index / this.view.totalDaysVisibleInWeek) *
        this.view.totalDaysVisibleInWeek;
    } else {
      this.openRowIndex = null;
      this.openDay = null;
    }
  }

  refreshAll(): void {
    this.refreshHeader();
    this.refreshBody();
    this.checkActiveDayIsOpen();
  }
}
