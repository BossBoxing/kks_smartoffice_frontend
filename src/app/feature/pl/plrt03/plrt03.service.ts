import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

export interface DbHoliday {
  ouCode: string;
  holidayYear: number;
  holidayName: string;
  holidayDate: Date;
  holidayDesc: string;
  dayOfWeek: string;
  specialConditionSeq: number;
  substitutionYn: string;
  activeBool: boolean;
  active: string;
  tmplFlag: string;
  rowVersion: number;
  id: number;
}

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
  providedIn: 'root',
})
export class Plrt03Service {
  constructor(private http: HttpClient) { }

  findPlHoliday(searchCriteria: any, page: any) {
    const filter = Object.assign(searchCriteria, page);
    return this.http.get<any>('plrt03', { params: filter });
  }

  findDbHolidayByKey(ouCode, holidayYear, holidayName) {
    return this.http.get<DbHoliday>('plrt03/detail', { params: { ouCode, holidayYear, holidayName } });
  }

  delete(ouCode, holidayYear, holidayName, rowVersion) {
    return this.http.delete('plrt03', { params: { ouCode, holidayYear, holidayName, rowVersion } });
  }

  save(dbHoliday: DbHoliday, formGroup: FormGroup) {
    const pl = Object.assign({}, dbHoliday, formGroup);
    if (pl.rowVersion) {
      return this.http.put<any>('plrt03', pl);
    } else {
      return this.http.post<any>('plrt03', pl);
    }
  }
  ///
  findPlHolidayLookup(page: any) {
    return this.http.get<any>('plrt03/lookup', { params: page });
  }
}

