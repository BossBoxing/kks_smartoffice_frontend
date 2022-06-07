import { Component, Input, OnInit } from '@angular/core';
import { DayHeader } from '../service/calendar.service';

@Component({
  selector: 'calendar-day-header',
  templateUrl: 'calendar-day-header.html'
})
export class CalendarDayViewHeaderComponent {
  @Input() dayHeader: DayHeader;
}
