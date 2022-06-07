import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface DbHolidayTmpl {
  id: number;
  ouCode: string;
  holidayName: string;
  holidayMonth: number;
  holidayDay: number;
  holidayDesc: string;
  specialConditionSeq: number;
  active: string;
  activeBool: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class Plrt03LookupService {

  constructor(private http: HttpClient) { }
  findPlHoliday(page: any) {
    return this.http.get<any>('plrt03/lookup', { params: page });
  }
}
