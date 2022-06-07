import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseList, BaseService, Page } from '@app/shared';
import { FormGroup } from '@angular/forms';

export interface DbProvince {
    provinceCode: string;
    provinceNameTha: string;
    provinceNameEng: string;
    countryCode: string;
    active: string;
    activeBool: boolean;
    rowVersion: number;
    districts: DbDistrictDTO[];
}

export interface DbDistrictDTO extends BaseList {
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
export class Dbrt05Service extends BaseService {
    constructor(private http: HttpClient) {
        super();
    }

    findDbProvinces(searchCriteria: any, page: any) {
        const filter = Object.assign(searchCriteria, page);
        return this.http.get<any>('dbrt05', { params: filter });
    }

    findDbProvinceByKey(countryCode, provinceCode) {
        return this.http.get<DbProvince>('dbrt05/detail', {
            params: { countryCode, provinceCode }
        });
    }

    findCountryForATC(Keyword: string, Value: string) {
        return this.http.get<any>('dbrt05/findCountryForATC', { params: { keyword: Keyword, value: Value } });
    }

    save(dbProvince: DbProvince , formGroup: FormGroup, dbDistrictDetailDelete: DbDistrictDTO[]) {
        const province = Object.assign({}, dbProvince, formGroup);
        province.districts = this.prepareSaveList(province.districts, dbDistrictDetailDelete);
        if (province.rowVersion) {
            return this.http.put<any>('dbrt05', province);
        } else {
            return this.http.post<any>('dbrt05', province);
        }
    }

    delete(countryCode, provinceCode, version) {
        return this.http.delete('dbrt05', {
            params: { countryCode, provinceCode, rowVersion: version }
        });
    }
}
