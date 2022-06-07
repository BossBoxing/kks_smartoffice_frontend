import { adapterFactory as baseAdapterFactory } from 'calendar-utils/date-adapters/date-fns';
import * as addWeeks from 'date-fns/add_weeks';
import * as addMonths from 'date-fns/add_months';
import * as subDays from 'date-fns/sub_days';
import * as subWeeks from 'date-fns/sub_weeks';
import * as subMonths from 'date-fns/sub_months';
import * as getISOWeek from 'date-fns/get_iso_week';
import * as setDate from 'date-fns/set_date';
import * as setMonth from 'date-fns/set_month';
import * as setYear from 'date-fns/set_year';
import * as getDate from 'date-fns/get_date';
import * as getYear from 'date-fns/get_year';
import { DateAdapter } from '../../calendar.module';

export function adapterFactory(): DateAdapter {
  return {
    ...baseAdapterFactory(),
    addWeeks,
    addMonths,
    subDays,
    subWeeks,
    subMonths,
    getISOWeek,
    setDate,
    setMonth,
    setYear,
    getDate,
    getYear
  };
}
