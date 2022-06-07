import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '@app/shared';
import { FormGroup } from '@angular/forms';


export interface SuUser {
  userId: number;
  userName: string;
  profileId: number;
  description: string;
  address: string;
  telephone: string;
  email: string;
  empId: string;
  rowVersion: number;
  tFirstName: string;
  tLastName: string;
  eFirstName: string;
  eLastName: string;
  preNameId: string;
  birthday: Date;
  age: number;
  sex: string;
  personalDate: Date;
  personalExpDate?: Date;
  count: number;
  activeBool: boolean;
  Active: string;
  rows: any;
}
@Injectable({
  providedIn: 'root'
})
export class Surt01Service {

  constructor(private http: HttpClient) { }

  findUsers() {
    return this.http.get<any>('surt01');
  }

  findSuUser(searchCriteria: any, page: any) {
    const filter = Object.assign(searchCriteria, page);
    return this.http.get<any>('surt01', { params: filter });
  }

  findsuUserByKey(userId, empId) {
    return this.http.get<any>('surt01/detail', { params: { userId, empId } });
  }

  findPreNameIdForAtc(Keyword: string, Value: string) {
    return this.http.get<any>('surt01/findPreNameIdForAtc', { params: { keyword: Keyword, value: Value} });
  }

  findPositionForAtc(Keyword: string, Value: string) {
    return this.http.get<any>('surt01/findPositionForAtc', { params: { keyword: Keyword, value: Value} });
  }

  findEmpTypeForAtc(Keyword: string, Value: string) {
    return this.http.get<any>('surt01/findEmpTypeForAtc', { params: { keyword: Keyword, value: Value} });
  }

  save(suUser: SuUser, formGroup: FormGroup) {
    const su = Object.assign({}, suUser, formGroup);
    if (su.rowVersion) {
        return this.http.put<any>('surt01', su);
    } else {
        return this.http.post<any>('surt01', su);
    }
  }
}
