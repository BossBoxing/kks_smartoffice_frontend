import { Pipe, PipeTransform, Inject, LOCALE_ID } from '@angular/core';

export const thaiYearOffset = 543;

@Pipe({
    name: 'thaidate'
})
export class ThaiDatePipe implements PipeTransform {
    offsetYear = this.locale === 'th-TH' ? thaiYearOffset : 0;
    constructor(@Inject(LOCALE_ID) public locale: string){}
    transform(date: string,format: string): string {
        if (!date) return null;
        let inputDate = new Date(date);
        let day = inputDate.getDate();
        let month = inputDate.getMonth() + 1;
        let year = inputDate.getFullYear() + this.offsetYear;
        return this._to2digit(day) + '/' + this._to2digit(month) + '/' + year;
    }
    private _to2digit(n: number) {
        return ('00' + n).slice(-2);
    } 
}