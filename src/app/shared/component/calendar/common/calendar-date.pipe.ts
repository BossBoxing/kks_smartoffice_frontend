import { Pipe, PipeTransform } from '@angular/core';
import { CalendarDateFormatter } from './calendar-date-formatter.provider';
import { I18nService } from '@app/core';

/**
 * This pipe is primarily for rendering the current view title. Example usage:
 * ```typescript
 * // where `viewDate` is a `Date` and view is `'month' | 'week' | 'day'`
 * {{ viewDate | calendarDate:(view + 'ViewTitle'):'en' }}
 * ```
 */
@Pipe({ name: 'calendarDate' })
export class CalendarDatePipe implements PipeTransform {
  constructor(private dateFormatter: CalendarDateFormatter, public i18n: I18nService) { }

  transform(
    date: Date,
    method: string,
    locale: string = this.i18n.language === 'th' ? 'th-TH' : 'en-EN',
    weekStartsOn: number = 0,
    excludeDays: number[] = [],
    daysInWeek?: number
  ): string {
    if (typeof this.dateFormatter[method] === 'undefined') {
      const allowedMethods = Object.getOwnPropertyNames(
        Object.getPrototypeOf(CalendarDateFormatter.prototype)
      ).filter(iMethod => iMethod !== 'constructor');
      throw new Error(
        `${method} is not a valid date formatter. Can only be one of ${allowedMethods.join(
          ', '
        )}`
      );
    }

    return this.dateFormatter[method]({
      date,
      locale,
      weekStartsOn,
      excludeDays,
      daysInWeek
    });
  }
}
