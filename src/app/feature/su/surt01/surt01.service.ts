import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseList, BaseService } from '@app/shared';
import { FormGroup } from '@angular/forms';

export interface SuOrganize {
  ouCode: string;
  ouNameTha: string;
  ouNameEng: string;
  addrTha1: string;
  addrTha2: string;
  addrEng1: string;
  addrEng2: string;
  provinceTha: string;
  provinceEng: string;
  zipCode: string;
  telephone: string;
  fax: string;
  taxId: string;
  email: string;
  logo: string;
  socialAcc: string;
  socialBranch: string;
  mainYn: string;
  ouMain: string;
  active: string;
  mainOuBool: boolean; // non-base
  activeBool: boolean; // non-base
  rowVersion: number;
  divisions: SuDivision[];
}

export class SuDivision extends BaseList {
  ouCode: string;
  divCode: string;
  divName: string;
  levelCtl: number;
  divParent: string;
  mainParent: string;
  subFlag: string;
  subFlagBool: boolean; // non-base
  rowId: number;
  glDfDivCode: string;
  rowVersion: number;
}

@Injectable()
export class Surt01Service extends BaseService {

  constructor(private http: HttpClient) { super(); }

  findOuMainForATC(keyword: string, value: string, ouCode: string) {
    return this.http.get<any>('surt01/findOuMainForATC', { params: { keyword, value, ouCode } });
  }

  findDivParentForATC(keyword: string, value: string, ouCode: string, divCode: string) {
    return this.http.get<any>('surt01/findDivParentForATC', { params: { keyword, value, ouCode, divCode } });
  }

  findSuOrganizes(search: string, page: any) {
    const filter = Object.assign({ keyword: search }, page);
    return this.http.get<any>('surt01', { params: filter });
  }

  findSuOrganizeByKey(ouCode: string) {
    return this.http.get<SuOrganize>('surt01/detail', { params: { ouCode } });
  }

  save(suOrganize: SuOrganize
    ,  suOrganizeForm: FormGroup
    ,  suDivisionDelete: SuDivision[]) {
    const suOrganizeDTO = Object.assign({}, suOrganize, suOrganizeForm);
    suOrganizeDTO.divisions = this.prepareSaveList(suOrganize.divisions, suDivisionDelete);
    if (suOrganizeDTO.rowVersion) {
      return this.http.put<any>('surt01', suOrganizeDTO);
    } else {
      return this.http.post<any>('surt01', suOrganizeDTO);
    }
  }

  delete(ouCode, rowVersion) {
    return this.http.delete('surt01', { params: { ouCode, rowVersion } });
  }

}
