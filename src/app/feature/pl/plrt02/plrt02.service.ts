import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseList, BaseService } from '@app/shared';
import { FormGroup } from '@angular/forms';

export interface PlRelease {
  custCode: string;
  releaseCode: string;
  releaseName: string;
  startDate: Date;
  finishDate: Date;
  workLoad: number;
  price: number;
  currencyCode: string;
  remark: string;
  scopeDate: Date;
  confirmDate: Date;
  releaseShortName: string;
  active: string;
  activeBool: boolean;
  rowVersion: number;
  plProjects: PlProject[];
  plCustomer: PlCustomer;
}

export interface PlProject extends BaseList {
  custCode: string;
  releaseCode: string;
  projCode: string;
  projName: string;
  projDate: Date;
  refModNo: string;
  reqByCust: string;
  busFuncCode: string;
  respEmp: string;
  planStartDate: Date;
  planFinishDate: Date;
  estimateLoad: number;
  addWorkload: number;
  projPrice: number;
  currencyCode: string;
  remark: string;
  confirmDate: Date;
  cancelled: string;
  buCode: string;
  mprojEmp: string;
  active: string;
  activeBool: boolean;
  rowVersion: number;
}

export interface PlCustomer {
  custCode: string;
  custName: string;
  telNo: string;
  faxNo: string;
  active: string;
  crDate: Date;
  areaCode: string;
  countryCode: string;
  color: string;
  address: string;
  effectiveDate: Date;
  activeBool: boolean;
  rowVersion: number;
}

@Injectable({ providedIn: 'root', })
export class Plrt02Service extends BaseService {
  constructor(private http: HttpClient) { super(); }

  findGroupReleaseATC(Keyword: string, Value: string ) {
    return this.http.get<any>('plrt02/findGroupReleaseATC', { params: { keyword: Keyword, value: Value } });
  }

  findPlRelease(searchCriteria: any, page: any) {
    const filter = Object.assign(searchCriteria, page);
    return this.http.get<any>('plrt02', { params: filter });
  }

  findPlReleaseByKey(custCode, releaseCode) {
    return this.http.get<PlRelease>('plrt02/detail', { params: { custCode, releaseCode } });
  }

  // insert(post), update(put) ข้อมูล
  save(plRelese: PlRelease, formGroup: FormGroup, plProjectDelete: PlProject[]) {
    const release = Object.assign({}, plRelese, formGroup);
    release.plProjects = this.prepareSaveList(release.plProjects, plProjectDelete);
    if (release.rowVersion) {
      return this.http.put<any>('plrt02', release);
    } else {
      return this.http.post<any>('plrt02', release);
    }
  }

  // Delete ข้อมูล
  delete(custCode, releaseCode, rowVersion) {
    return this.http.delete('plrt02', { params: { custCode, releaseCode, rowVersion}
    });
  }

  findMasterData() {
    return this.http.get<any>('plrt02/master');
}
}
