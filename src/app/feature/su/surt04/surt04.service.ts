import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseList, BaseService } from '@app/shared';
import { FormGroup } from '@angular/forms';

export interface SuProfile {
  profileId: number;
  code: string;
  profileName: string;
  description: string;
  status: string;
  system: string;
  active: boolean;
  profileMenuDto: SuProfileMenu[];
  rowVersion: number;
}

export class SuProfileMenu extends BaseList {
  profileId: number;
  menuId: string;
  menuCode: string;
  allFlag: string;
  isAllFlag: boolean;
  rowVersion: number;
  menuRowVersion: number;
}

@Injectable()
export class Surt04Service extends BaseService {

  constructor(private http: HttpClient) { super(); }

  findSuProfiles(search: string, page: any) {
    const filter = Object.assign({ keyword: search }, page);
    return this.http.get<any>('surt04', { params: filter });
  }

  findSuProfileByKey(profileId, ReadOnly: boolean = false) {
    return this.http.get<SuProfile>('surt04/detail', { params: { profileId, readOnly: ReadOnly.toString() } });
  }

  findMenuForLookup(search: string, page: any) {
    const filter = Object.assign({ keyword: search }, page);
    return this.http.get<any>('surt04/findMenuForLookup', { params: filter });
  }

  save(profile: SuProfile
    ,  profileForm: FormGroup
    ,  profileMenusDelete: SuProfileMenu[]
  ) {
    const suProfile = Object.assign({}, profile, profileForm);
    suProfile.profileMenuDto = this.prepareSaveList(profile.profileMenuDto, profileMenusDelete);
    if (suProfile.rowVersion) {
      return this.http.put<any>('surt04', suProfile);
    } else {
      suProfile.profileId = 0;
      return this.http.post<any>('surt04', suProfile);
    }
  }

  delete(code, version) {
    return this.http.delete('surt04', { params: { profileId: code, rowVersion: version } });
  }
}
