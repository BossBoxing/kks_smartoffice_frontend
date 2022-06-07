import { Component, Input, Output, EventEmitter, TemplateRef, OnInit } from '@angular/core';
import { WeekViewAllDayEvent, DayViewEvent, WeekViewHourColumn } from 'calendar-utils';
import { PlacementArray } from 'positioning';
import { CalendarView } from '../common/calendar-common.module';


@Component({
  selector: 'mwl-calendar-week-view-event',
  templateUrl: 'calendar-week-view-event.html'
})
export class CalendarWeekViewEventComponent {
  
  color = { background: '#88D0C2', border: '#12A286' };

  @Input() calendarView: CalendarView;
  
  @Input() weekEvent: WeekViewAllDayEvent | DayViewEvent;

  @Input() tooltipPlacement: PlacementArray;

  @Input() tooltipAppendToBody: boolean;

  @Input() tooltipDisabled: boolean;

  @Input() tooltipDelay: number | null;

  @Input() customTemplate: TemplateRef<any>;

  @Input() eventTitleTemplate: TemplateRef<any>;

  @Input() eventActionsTemplate: TemplateRef<any>;

  @Input() tooltipTemplate: TemplateRef<any>;

  @Input() column: WeekViewHourColumn;

  @Output() eventClicked: EventEmitter<any> = new EventEmitter();
}
