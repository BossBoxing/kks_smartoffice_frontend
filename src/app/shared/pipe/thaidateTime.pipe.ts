import { Pipe, PipeTransform, Inject, LOCALE_ID } from '@angular/core';

export const thaiYearOffset = 543;

@Pipe({
    name: 'thaidatetime'
})
export class ThaiDateTimePipe implements PipeTransform {
    offsetYear = this.locale === 'th-TH' ? thaiYearOffset : 0;
    constructor(@Inject(LOCALE_ID) public locale: string){}
    transform(date: string): string {
        if (!date) return null;
        let inputDate = new Date(date);
        let day = inputDate.getDate();
        let month = inputDate.getMonth() + 1;
        let year = inputDate.getFullYear() + this.offsetYear;
        let time = inputDate.toLocaleString('en-US', { hour: '2-digit',minute: '2-digit',second:'2-digit', hour12: false })
        return `${this._to2digit(day)}/${this._to2digit(month)}/${year} ${time}`;
    }
    private _to2digit(n: number) {
        return ('00' + n).slice(-2);
    } 
}