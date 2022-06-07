import { Component, Input, TemplateRef, OnInit } from '@angular/core';
import { WeekViewHourColumn } from 'calendar-utils';
import { Room } from '../service/calendar.service';

@Component({
  selector: 'mwl-calendar-week-view-hour-segment',
  template: `
    <ng-template
      #defaultTemplate
      let-room="room"
      let-segmentHeight="segmentHeight"
      let-isTimeLabel="isTimeLabel"
    >
      <div
        class="cal-hour-segment"
        [style.height.px]="segmentHeight"
 
      >
        <div class="cal-time" *ngIf="isRoomLabel">
          {{ room.text }}
        </div>
      </div>
    </ng-template>
    <ng-template
      [ngTemplateOutlet]="customTemplate || defaultTemplate"
      [ngTemplateOutletContext]="{
        room: room,
        segmentHeight: segmentHeight,
        isRoomLabel: isRoomLabel
      }"
    >
    </ng-template>
  `
})
export class CalendarWeekViewHourSegmentComponent implements OnInit {

  ngOnInit(): void {
    // console.log(this.room);
  }

  @Input() room: Room;
  @Input() segment: WeekViewHourColumn;
  @Input() segmentHeight: number;
  @Input() locale: string;
  @Input() isRoomLabel: boolean;
  @Input() customTemplate: TemplateRef<any>;
}
