import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '@app/shared';
import { FormGroup } from '@angular/forms';

export interface SuMenuInfo {
  menuCode: string;
  programCode: string;
  mainMenu: string;
  systemCode: string;
  icon: string;
  active: boolean;
  menuNameTh: string;
  menuNameEng: string;
  rowVersion: number;
  rowVersionMenuTh: number;
  rowVersionMenuEn: number;
}

@Injectable()
export class Surt03Service extends BaseService {

  constructor(private http: HttpClient) { super(); }

  findMenus(search: string, page: any) {
    return this.http.get<any>('surt03', { params: Object.assign({ keyword: search }, page) });
  }

  findSuMenuInfoByKeys(code) {
    return this.http.get<SuMenuInfo>('surt03/detail', { params: { menuCode: code } });
  }

  findMasterData(params) {
    return this.http.get<any>('surt03/master', { params });
  }

  findMainMenuForATC(keyword: string, value: string, parameter: any) {
    parameter = Object.assign(parameter, { keyword, value });
    return this.http.get<any>('surt03/findMainMenuForATC', { params: parameter });
  }

  save( suMenu: SuMenuInfo, suMenuForm: FormGroup) {
    const menu = Object.assign({}, suMenu, suMenuForm);
    if (menu.rowVersion) {
      return this.http.put<any>('surt03', menu);
    } else {
      return this.http.post<any>('surt03', menu);
    }
  }

  delete(code, version) {
    return this.http.delete('surt03', { params: { menuCode: code, rowVersion: version } });
  }
}
