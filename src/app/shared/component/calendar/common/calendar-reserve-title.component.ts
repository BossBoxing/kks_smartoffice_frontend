import { Component, Input, TemplateRef, OnInit } from '@angular/core';
import { CalendarEvent } from 'calendar-utils';
import { CalendarView } from './calendar-view.enum';

@Component({
  selector: 'calendar-reserve-title',
  templateUrl: 'calendar-reserve-title.html'
})
export class CalendarReserveTitleComponent {
  CalendarView = CalendarView;
  @Input() titleColor: string;
  @Input() calendarView: CalendarView;
  @Input() event: CalendarEvent;
  @Input() view: string;
}
