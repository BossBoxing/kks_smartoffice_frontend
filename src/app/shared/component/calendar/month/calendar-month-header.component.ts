import {Component,Input} from '@angular/core';
import { WeekDay } from 'calendar-utils';

@Component({
  selector: 'calendar-month-header',
  templateUrl: 'calendar-month-header.html',
  styleUrls: ['calendar-month-view.scss']
})
export class CalendarMonthViewHeaderComponent {
  @Input() days: WeekDay[];
}
