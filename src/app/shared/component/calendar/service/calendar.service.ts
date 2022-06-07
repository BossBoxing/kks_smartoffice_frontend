import { Injectable } from '@angular/core';

export class Week {
  roomColumns: RoomRow[];
  dayColumns: DayColumn[];
}
export class Day {
  roomRows: RoomRow[];
  periodColumns: PeriodColumn[];
}

export class RoomRow {
  room: Room;
  height: number;
}
export class Room {
  text: string;
  value: number;
}
export class DayColumn {
  events: Event[];
}
export class PeriodColumn {
  events: Event[];
}
export class Period {
  startTime: string;
  endTime: string;
}
export class DayHeader {
  periods: Period[];
}
export class Event {
  event: CalendarEvent;
  height: number;
  width: number;
  top: number;
  left: number;
}
export class CalendarEvent {
  // startTime: string;
  // endTime: string;
  // title: string;
  // date: Date;
  // place: string;
  // employeeName: string;
  // room: number;
  id: number;
  start: Date;
  end: Date;
  title: string;
  color?: EventColor;
  date: Date;
  place: string;
  employeeName: string;
  room: number;
  startTime: string;
  endTime: string;
  allDay: boolean;
}
export class EventColor {
  primary: string;
  secondary: string;
}

@Injectable()
export class CalendarService {

  constructor() { }
}
