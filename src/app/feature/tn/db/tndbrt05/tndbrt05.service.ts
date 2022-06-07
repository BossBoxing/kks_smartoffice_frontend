import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseList, BaseService } from '@app/shared';
import { FormGroup } from '@angular/forms';

export interface DbProvince {
  provinceCode: string;
  provinceNameTha: string;
  provinceNameEng: string;
  countryCode: string;
  active: string;
  activeBool: boolean;
  rowVersion: number;
  districts: DbDistrict[];
}
export interface DbDistrict extends BaseList {
  provinceCode: string;
  districtCode: string;
  districtNameTha: string;
  districtNameEng: string;
  countryCode: string;
  active: string;
  activeBool: boolean;
  rowVersion: number;
}

@Injectable()
export class Tndbrt05Service extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }

  findDbProvince() {
    return this.http.get<any>('tndbrt05');
  }

  findDbTypes(page: any) {
    const filter = Object.assign(page);
    return this.http.get<any>('tndbrt05', { params: filter });
  }

  findDbId(searchCriteria: any, page: any) {
    const filter = Object.assign(searchCriteria, page);
    return this.http.get<any>('tndbrt05', { params: filter });
  }

  delete(pcode, ccode, version) {
    return this.http.delete('tndbrt05', { params: { provinceCode: pcode, countryCode: ccode, rowVersion: version } });
  }

  findCountryCodeForATC(Keyword: string, Value: string) {
    return this.http.get<any>('tndbrt05/findCountryCodeForATC', { params: { keyword: Keyword, value: Value } });
  }

  // set detail

  findDbProvinceByKey(provinceCode, countryCode) {
    return this.http.get<DbProvince>('tndbrt05/detail', { params: { provinceCode, countryCode } });
  }

  save(dbProvince: DbProvince, formGroup: FormGroup, dbDistrictDetailDelete: DbDistrict[]) {
    const province = Object.assign({}, dbProvince, formGroup);
    province.districts = this.prepareSaveList(province.districts, dbDistrictDetailDelete);
    if (province.rowVersion) {
      return this.http.put<any>('tndbrt05', province);
    } else {
      return this.http.post<any>('tndbrt05', province);
    }
  }

}
