import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '@app/shared';
import { FormGroup } from '@angular/forms';

export interface SuProfile {
  profileId: number;
  profileName: string;
  code: string;
  description: string;
  status: string;
  rowVersion: number;
  activeBool: boolean;
  count: number;
}
@Injectable({
  providedIn: 'root',
})
export class Surt04Service {
  constructor(private http: HttpClient) {}

  findUsers() {
    return this.http.get<any>('surt04');
  }

  findSuProfile(searchCriteria: any, page: any) {
    const filter = Object.assign(searchCriteria, page);
    return this.http.get<any>('surt04', { params: filter }); // เรียนค่าหลังบ้านจาก list
  }

  findsuProfileByKey(code) {
    return this.http.get<SuProfile>('surt04/detail', { params: { profileId: code } });
  }

  delete(code, version) {
    return this.http.delete('surt04', { params: { profileId: code, rowVersion: version },
    });
  }

  save(suProfile: SuProfile, formGroup: FormGroup) {
    const su = Object.assign({}, suProfile, formGroup);
    if (su.rowVersion) {
        return this.http.put<any>('surt04', su); // edit
    } else {
        return this.http.post<any>('surt04', su); // create
    }
  }
}
