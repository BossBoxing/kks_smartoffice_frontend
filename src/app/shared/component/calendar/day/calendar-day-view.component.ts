import { Component, Input, Output, EventEmitter, OnChanges, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { Room, Period, Day, PeriodColumn, DayHeader, CalendarEvent, Event } from '../service/calendar.service';
import { CalendarView } from '../common/calendar-common.module';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'calendar-day-view',
  templateUrl: 'calendar-day-view.html'
})
export class CalendarDayViewComponent implements OnInit, OnChanges, OnDestroy {

  @Input() viewDate: Date;
  @Output() eventClicked = new EventEmitter<{ event: CalendarEvent; }>();
  @Input() refresh: Subject<any>;
  @Input() rooms: Room[];
  @Input() events: CalendarEvent[];
  @Input() calendarView: CalendarView;
  @Input() periods: Period[];
  day = new Day();
  dayHeader = new DayHeader();
  refreshSubscription: Subscription;

  constructor(private datePipe: DatePipe) { }

  ngOnInit() {
    this.refreshAll();
  }

  getPeriods() {
    this.dayHeader.periods = [];
    let tempTime = this.periods[0].startTime;
    let time: string[];
    while (true) {
      time = tempTime.split(':');
      const startTime = time[0] + ':' + time[1];
      const endTime = (+time[0] + 1).toString().padStart(2, '0') + ':' + time[1];
      if (tempTime > this.periods[0].endTime) {
        this.dayHeader.periods.push({
          startTime: startTime,
          endTime: endTime
        });
        break;
      } else {
        this.dayHeader.periods.push({
          startTime: startTime,
          endTime: endTime
        });
        tempTime = endTime;
      }
    }
  }

  getRooms() {
    this.day.roomRows = this.rooms.map(room => { return { room: room, height: 0 }; });
  }

  getEvents() {
    let period: PeriodColumn[] = this.dayHeader.periods.map(() => new PeriodColumn());
    for (let r = 0; r < this.rooms.length; r++) {
      let hasEvants = 0;
      for (let p = 0; p < this.dayHeader.periods.length; p++) {
        let events = this.events.filter(event => 
          this.datePipe.transform(event.date, 'ddMMyyyy') === this.datePipe.transform(this.viewDate, 'ddMMyyyy') && 
          event.startTime >= this.dayHeader.periods[p].startTime && 
          event.startTime < this.dayHeader.periods[p].endTime && 
          event.room === this.rooms[r].value);
        let event: Event[] = [];

        for (let e = 0; e < events.length; e++) {
          event.push({
            event: events[e],
            height: 45,
            width: 100 + this.getOffSet(events[e], this.dayHeader, p),
            top: (hasEvants * 44) + this.day.roomRows.reduce((height, room) => height + room.height, 0) - this.day.roomRows[r].height,
            left: 0
          });
        }

        // const height = event.length === 0 ? 44 : r < this.rooms.length - 1 ? (event.length * 44) + 2 : (event.length * 44) + 1;
        if (event.length != 0) hasEvants++;
        const height = hasEvants == 0 ? (1 * 44) : hasEvants * 44;
        if (!this.day.roomRows[r].height || height > this.day.roomRows[r].height) {
          this.day.roomRows[r].height = height;
        }

        if (!period[p].events) period[p].events = [];
        if (event.length > 0) period[p].events.push(...event);
      };
    }

    this.day.periodColumns = period;
  }

  getOffSet(event: CalendarEvent, dayHeader: DayHeader, index: number): number {
    const eventStartTime = +(event.startTime.split(':')[0] + event.startTime.split(':')[1]);
    const eventEndTime = +(event.endTime.split(':')[0] + event.endTime.split(':')[1]);
    let indexStart = 0;
    for (let p = 0; p < dayHeader.periods.length; p++) {
      const periodStartTime = +(dayHeader.periods[p].startTime.split(':')[0] + dayHeader.periods[p].startTime.split(':')[1]);
      const periodEndTime = +(dayHeader.periods[p].endTime.split(':')[0] + dayHeader.periods[p].endTime.split(':')[1]);
      if (eventStartTime >= periodStartTime && eventStartTime <= periodEndTime) indexStart = p;
      if (eventEndTime >= periodStartTime && eventEndTime <= periodEndTime) return ((p + 1) - indexStart) * 100;
      // if (eventEndTime > periodStartTime && eventEndTime < periodEndTime)
      //   return offSetStart === 0 ? 100 : (p - offSetStart) * 100;
      
      
      // if (eventStartTime === periodStartTime) {
      //   return (p - dayHeader.periods.indexOf(dayHeader.periods.find(period => period.startTime === event.startTime))) * 100;
      // } else if (eventEndTime < periodEndTime) {
      //   return (p * 100)
      // }
    }
  }

  ngOnChanges(changes) {
    if (changes.viewDate || changes.events) {
      this.refreshAll();
      return;
    }
  }

  ngOnDestroy() {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  refreshAll() {
    this.getPeriods();
    this.getRooms();
    this.getEvents();
  }
}
