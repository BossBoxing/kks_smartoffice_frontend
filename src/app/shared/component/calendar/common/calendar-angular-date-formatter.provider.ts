import { CalendarDateFormatterInterface, DateFormatterParams } from './calendar-date-formatter.interface';
import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';
import { DateAdapter } from '../date-adapters/date-adapter';
import { getWeekViewPeriod } from './util';

export const thaiYearOffset = 543;

@Injectable()
export class CalendarAngularDateFormatter implements CalendarDateFormatterInterface {
  constructor(protected dateAdapter: DateAdapter) { }

  public monthViewColumnHeader({ date, locale }: DateFormatterParams): string {
    return formatDate(date, 'EEEE', locale);
  }

  public monthViewDayNumber({ date, locale }: DateFormatterParams): string {
    return formatDate(date, 'd', locale);
  }

  public monthViewTitle({ date, locale }: DateFormatterParams): string {
    return `${formatDate(date, 'LLLL', locale)} ${+formatDate(date, 'y', locale) + thaiYearOffset}`;
  }

  public weekViewColumnHeader({ date, locale }: DateFormatterParams): string {
    return formatDate(date, 'EEEE', locale);
  }

  public weekViewColumnSubHeader({ date, locale }: DateFormatterParams): string {
    return `${formatDate(date, 'd MMM', locale)} ${(+formatDate(date, 'y', locale) + thaiYearOffset).toString().substring(2)}`;
  }

  public weekViewTitle({ date, locale, weekStartsOn, excludeDays, daysInWeek }: DateFormatterParams): string {
    const { viewStart, viewEnd } = getWeekViewPeriod(this.dateAdapter, date, weekStartsOn, excludeDays, daysInWeek);
    const format = (dateToFormat: Date, showYear: boolean) => `${formatDate(dateToFormat, 'd MMM', locale)} ${showYear ? +formatDate(dateToFormat, 'y', locale) + thaiYearOffset : ''}`;
    return `${format(viewStart, viewStart.getUTCFullYear() !== viewEnd.getUTCFullYear())} - ${format(viewEnd, true)}`;
  }

  public weekViewHour({ date, locale }: DateFormatterParams): string {
    return formatDate(date, 'h a', locale);
  }

  public dayViewHour({ date, locale }: DateFormatterParams): string {
    return formatDate(date, 'h a', locale);
  }

  public dayViewTitle({ date, locale }: DateFormatterParams): string {
    return `${formatDate(date, 'EEEE d MMMM', locale)} ${+formatDate(date, 'y', locale) + thaiYearOffset}`;
  }
}
