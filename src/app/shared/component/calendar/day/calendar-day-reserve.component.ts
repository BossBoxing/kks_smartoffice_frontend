import { Component, Input } from '@angular/core';
import { WeekViewAllDayEvent, DayViewEvent } from 'calendar-utils';
import { CalendarView } from '../common/calendar-common.module';

@Component({
  selector: 'calendar-day-reserve',
  templateUrl: 'calendar-day-reserve.html'
})
export class CalendarDayReserveComponent {
  color = { background: '#88D0C2', border: '#12A286' };
  @Input() calendarView: CalendarView;
  @Input() weekEvent: WeekViewAllDayEvent | DayViewEvent;
}
