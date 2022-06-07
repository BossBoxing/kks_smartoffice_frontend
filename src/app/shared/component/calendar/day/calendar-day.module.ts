import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarDayViewComponent } from './calendar-day-view.component';
import { CalendarDayViewHeaderComponent } from './calendar-day-header.component';
import { CalendarDayReserveComponent } from './calendar-day-reserve.component';
import { CalendarCommonModule } from '../common/calendar-common.module';
import { CalendarDaySegmentComponent } from './calendar-day-segment.component';

export { CalendarDayViewComponent } from './calendar-day-view.component';
export { WeekViewAllDayEvent as CalendarWeekViewAllDayEvent, WeekViewAllDayEventRow as CalendarWeekViewAllDayEventRow, GetWeekViewArgs as CalendarGetWeekViewArgs } from 'calendar-utils';
export { getWeekViewPeriod } from '../common/util';

@NgModule({
  imports: [
    CommonModule,
    CalendarCommonModule
  ],
  declarations: [
    CalendarDayViewComponent,
    CalendarDayViewHeaderComponent,
    CalendarDayReserveComponent,
    CalendarDaySegmentComponent
  ],
  exports: [
    CalendarDayViewComponent,
    CalendarDayViewHeaderComponent,
    CalendarDayReserveComponent,
    CalendarDaySegmentComponent
  ]
})
export class CalendarDayModule { }
