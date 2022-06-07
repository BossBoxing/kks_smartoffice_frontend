import { Component, Input, Output, EventEmitter } from '@angular/core';
import { trigger, style, state, transition, animate, AnimationTriggerMetadata } from '@angular/animations';
import { CalendarEvent } from 'calendar-utils';
import { CalendarView } from '../common/calendar-common.module';

export const collapseAnimation: AnimationTriggerMetadata = trigger('collapse', [
  state(
    'void',
    style({
      height: 0,
      overflow: 'hidden',
      'padding-top': 0,
      'padding-bottom': 0
    })
  ),
  state(
    '*',
    style({
      height: '*',
      overflow: 'hidden',
      'padding-top': '*',
      'padding-bottom': '*'
    })
  ),
  transition('* => void', animate('150ms ease-out')),
  transition('void => *', animate('150ms ease-in'))
]);

@Component({
  selector: 'calendar-open-day-events',
  templateUrl: 'calendar-open-day-events.html',
  animations: [collapseAnimation]
})
export class CalendarOpenDayEventsComponent {
  @Input() calendarView: CalendarView;
  @Input() isOpen: boolean = false;
  @Input() events: CalendarEvent[];
  @Output() eventClicked: EventEmitter<{ event: CalendarEvent }> = new EventEmitter<{ event: CalendarEvent; }>();
}
