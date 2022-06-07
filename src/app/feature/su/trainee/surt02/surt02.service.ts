import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseList, BaseService } from '@app/shared';

export interface SuUser {
  id: number;
  userName: string;
  profileId: number;
  description: string;
  address: string;
  telephone: string;
  status: string;
  email: string;
  active: string;
  activeBool: boolean;
  rowVersion: number;
  count: number;
  profiles: SuUserProfile[];
}

export interface SuUserProfile extends BaseList {
  id: number;
  profileId: number;
  effDate: Date;
  endDate: Date;
  rowVersion: number;
}


@Injectable()
export class Surt02Service extends BaseService {

  constructor(private http: HttpClient) {
    super();
  }

  findUsers() {
    return this.http.get<any>('surt02');
  }

  findsuUser(searchCriteria: any, page: any) {
    const filter = Object.assign(searchCriteria, page);
    return this.http.get<any>('surt02', { params: filter });
  }

  findsuUserByKey(code, userCode) {
    return this.http.get<SuUser>('surt02/detail', { params: { id: code, profileId: userCode } });
  }

  delete(code, version) {
    return this.http.delete('surt02', { params: { profileId: code, rowVersion: version } });
  }

  findProfileNameForAtc(Keyword: string, Value: string) {
    return this.http.get<any>('surt02/findProfileNameForAtc', { params: { keyword: Keyword, value: Value } });
  }

  save(suProfile: SuUser, formGroup: FormGroup, suUserProfileDelete: SuUserProfile[]) {
    const su = Object.assign({}, suProfile, formGroup);
    su.profiles = this.prepareSaveList(su.profiles, suUserProfileDelete);
    if (su.rowVersion) {
      return this.http.put<any>('surt02', su);
    } else {
      return this.http.post<any>('surt02', su);
    }
  }
}
