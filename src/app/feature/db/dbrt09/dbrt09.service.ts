import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '@app/shared';
import { FormGroup } from '@angular/forms';

export interface DbReligion {
    religionCode: string;
    religionNameTha: string;
    religionNameEng: string;
    active: string;
    activeBool: boolean;
    rowVersion: number;
}

@Injectable()
export class Dbrt09Service extends BaseService {
    constructor(private http: HttpClient) {
        super();
    }

    findDbReligions(searchCriteria: any, page: any) {
        const filter = Object.assign(searchCriteria, page);
        return this.http.get<any>('dbrt09', { params: filter });
    }

    findDbReligionByKey(code) {
        return this.http.get<DbReligion>('dbrt09/detail', { params: { religionCode: code } });
    }

    save(dbReligion: DbReligion , formGroup: FormGroup) {
        const db = Object.assign({}, dbReligion, formGroup);
        if (db.rowVersion) {
            return this.http.put<any>('dbrt09', db);
        } else {
            return this.http.post<any>('dbrt09', db);
        }
    }

    delete(religionCode, version) {
        return this.http.delete('dbrt09', { params: { religionCode, rowVersion: version } });
    }
}
