import { Injectable } from '@angular/core'
import { NativeDateAdapter } from '@angular/material/core'

export const thaiYearOffset = 543

@Injectable()
export class AppDateAdapter extends NativeDateAdapter {
  offsetYear = this.locale === 'th-TH' ? thaiYearOffset : 0

  parse(value: any): Date | null {
    const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/\d{1,4}$/
    const isValid = regex.test(value)
    if (typeof value === 'string' && isValid) {
      const str = value.split('/')
      const year = Number(str[2]) - this.offsetYear
      const month = Number(str[1]) - 1
      const date = Number(str[0])
      return new Date(year, month, date)
    }
    return null
  }

  format(date: Date, displayFormat: string): string {
    if (displayFormat == 'input') {
      let day = date.getDate()
      let month = date.getMonth() + 1
      let year = date.getFullYear() + this.offsetYear
      return `${this._to2digit(day)}/${this._to2digit(month)}/${year}`
    } else {
      return super.format(date, displayFormat)
    }
  }

  private _to2digit(n: number) {
    return ('00' + n).slice(-2)
  }

  getYearName(date: Date) {
    return String(this.getYear(date) + this.offsetYear)
  }
}

export const APP_DATE_FORMATS = {
  parse: {
    dateInput: { month: 'short', year: '2-digit', day: 'numeric' },
  },
  display: {
    dateInput: 'input',
    monthYearLabel: { month: 'long', year: 'numeric' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' },
  },
}
