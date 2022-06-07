import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '@app/shared';
import { FormGroup } from '@angular/forms';

export interface DbCountry {
    countryCode: string;
    countryNameTha: string;
    countryNameEng: string;
    active: string;
    activeBool: boolean;
    rowVersion: number;
}

@Injectable()
export class Dbrt04Service extends BaseService {
    constructor(private http: HttpClient) {
        super();
    }

    findDbCountries(searchCriteria: any, page: any) {
        const filter = Object.assign(searchCriteria, page); // merge object
        return this.http.get<any>('dbrt04', { params: filter });
    }

    findDbCountryByKey(code) {
        return this.http.get<DbCountry>('dbrt04/detail', { params: { countryCode: code } });
    }

    save(dbCountry: DbCountry , formGroup: FormGroup) {
        const db = Object.assign({}, dbCountry, formGroup);
        if (db.rowVersion) {
            return this.http.put<any>('dbrt04', db);
        } else {
            return this.http.post<any>('dbrt04', db);
        }
    }

    delete(code, version) {
        return this.http.delete('dbrt04', { params: { countryCode: code, rowVersion: version }});
    }
}
