import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '@app/shared';
import { FormGroup } from '@angular/forms';

export interface GbEmployee {
    ouCode: string;
    empId: string;
    preNameId: string;
    tFirstName: string;
    eFirstName: string;
    tLastName: string;
    eLastName: string;
    tNameConcat: string;
    eNameConcat: string;
    empStatus: string;
    empType: string;
    gender: string;
    nationId: string;
    religionId: string;
    raceId: string;
    addr1: string;
    tel1: string;
    addr2: string;
    tel2: string;
    addr3: string;
    tel3: string;
    districtId: string;
    provinceId: string;
    personalId: string;
    positionCode: string;
    locationId: string;
    birthday: Date;
    age: number;
    high: number;
    weight: number;
    flagMilitary: string;
    militaryDate: number;
    militaryYear: number;
    militarySelect: number;
    militaryDesc: string;
    militaryOrg: string;
    militaryEnd: number;
    flagWorkProv: string;
    workDate: Date;
    bloodType: string;
    trunoverDate: Date;
    workDesc: string;
    zipcode: string;
    tNickname: string;
    eNickname: string;
    managerId: string;
    email: string;
    pictureId: number;
    divisionId: string;
    rowVersion: number;
}

@Injectable()
export class Dbrt11Service extends BaseService {
    constructor(private http: HttpClient) { super(); }

    findMasterData() {
        return this.http.get<any>('dbrt11/master');
    }

    findGbEmployees(searchForm: any, page: any) {
        const filter = Object.assign(searchForm, page);
        return this.http.get<any>('dbrt11', { params: filter });
    }

    findGbEmployeeByKey(ouCode: string, empId: string) {
        return this.http.get<GbEmployee>('dbrt11/detail', { params: { ouCode, empId } });
    }

    findDistrict(keyword: string, value: string, provinceId: string) {
        return this.http.get<any>('dbrt11/findDistrictForATC', { params: { keyword, value, provinceId } });
    }

    findProvinceCode(keyword: string, value: string) {
        return this.http.get<any>('dbrt11/findProvinceCodeForATC', { params: { keyword, value } });
    }

    findPreName(keyword: string, value: string) {
        return this.http.get<any>('dbrt11/findPreNameForATC', { params: { keyword, value } });
    }

    findPositionCode(keyword: string, value: string) {
        return this.http.get<any>('dbrt11/findPositionCodeForATC', { params: { keyword, value } });
    }

    findDepartment(keyword: string, value: string) {
        return this.http.get<any>('dbrt11/findDepartmentForATC', { params: { keyword, value } });
    }

    findDivision(keyword: string, value: string) {
        return this.http.get<any>('dbrt11/findDivisionForATC', { params: { keyword, value } });
    }

    findRaceId(keyword: string, value: string) {
        return this.http.get<any>('dbrt11/findRaceIdForATC', { params: { keyword, value } });
    }

    findNation(keyword: string, value: string) {
        return this.http.get<any>('dbrt11/findNationForATC', { params: { keyword, value } });
    }

    findReligion(keyword: string, value: string) {
        return this.http.get<any>('dbrt11/findReligionForATC', { params: { keyword, value } });
    }

    findManager(keyword: string, value: string, params: any) {
        const parameter = Object.assign({ keyword, value }, params);
        return this.http.get<any>('dbrt11/findManagerIdForATC', { params: parameter });
    }

    save(gbEmployee: GbEmployee, formGroup: FormGroup) {
        const db = Object.assign({}, gbEmployee, formGroup);
        if (db.rowVersion) {
            return this.http.put<any>('dbrt11', db);
        } else {
            return this.http.post<any>('dbrt11', db);
        }
    }

    delete(ouCode, empId, rowVersion) {
        return this.http.delete('dbrt11', { params: { ouCode, empId, rowVersion } });
    }
}
