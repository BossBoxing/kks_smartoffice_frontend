import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '@app/shared';
import { FormGroup } from '@angular/forms';

export interface DbNational {
    nationalCode: string;
    nationalNameTha: string;
    nationalNameEng: string;
    active: string;
    activeBool: boolean;
    rowVersion: number;
}

@Injectable()
export class Dbrt08Service extends BaseService {
    constructor(private http: HttpClient) {
        super();
    }

    findDbNationals(searchCriteria: any, page: any) {
        const filter = Object.assign(searchCriteria, page);
        return this.http.get<any>('dbrt08', { params: filter });
    }
    findDbNationalByKey(code) {
        return this.http.get<DbNational>('dbrt08/detail', { params: { nationalCode: code } });
      }

    save(dbNational: DbNational , formGroup: FormGroup) {
        const db = Object.assign({}, dbNational, formGroup);
        if (db.rowVersion) {
            return this.http.put<any>('dbrt08', db);
        } else {
            return this.http.post<any>('dbrt08', db);
        }
    }

    delete(nationalCode, version) {
        return this.http.delete('dbrt08', { params: { nationalCode, rowVersion: version } });
    }
}
