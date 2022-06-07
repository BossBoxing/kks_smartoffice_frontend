import { Component, Input, TemplateRef, OnInit } from '@angular/core';
import { WeekViewHourColumn } from 'calendar-utils';
import { Room } from '../service/calendar.service';

@Component({
  selector: 'calendar-day-segment',
  templateUrl: 'calendar-day-segment.html'
})
export class CalendarDaySegmentComponent {
  @Input() room: Room;
  @Input() segmentHeight: number;
  @Input() isRoomLabel: boolean;
}