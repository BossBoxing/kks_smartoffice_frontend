import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

export interface SuUser {
  id: number;
  sex: string;
  profileId: number;
  userName: string;
  description: string;
  preNameId: string;
  tFirstName: string;
  tLastName: string;
  eFirstName: string;
  eLastName: string;
  position: string;
  address: string;
  telephone: string;
  email: string;
  active: string;
  rowVersion: number;
  activeBool: boolean;
}

@Injectable()
export class Surt03Service {
  constructor(private http: HttpClient) {}

  findUsers() {
    return this.http.get<any>('surt03');
  }

  findsuUserByKey(code) {
    return this.http.get<any>('surt03', { params: { id: code } });
  }
  // พวก get เรียกค่าหลังบ้านจาก list
  findPreNameIdForAtc(Keyword: string, Value: string) {
    return this.http.get<any>('surt03/findPreNameIdForAtc', { params: { keyword: Keyword, value: Value} });
  }

  findPositionForAtc(Keyword: string, Value: string) {
    return this.http.get<any>('surt03/findPositionForAtc', { params: { keyword: Keyword, value: Value} });
  }
  save(suUser: SuUser, formGroup: FormGroup) {
    const su = Object.assign({}, suUser, formGroup);
    if (su.rowVersion) {
        return this.http.put<any>('surt03', su); // edit
    } else {
        return this.http.post<any>('surt03', su); // create
    }
}
}
