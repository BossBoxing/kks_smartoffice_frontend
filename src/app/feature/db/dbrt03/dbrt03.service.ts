import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '@app/shared';
import { FormGroup } from '@angular/forms';

export interface DbTitle {
    titleCode: string;
    titleNameTha: string;
    titleNameEng: string;
    suffixNameTha: string;
    suffixNameEng: string;
    titleIniTha: string;
    titleIniEng: string;
    suffixIniTha: string;
    suffixIniEng: string;
    active: string;
    activeBool: boolean;
    rowVersion: number;
}

@Injectable()
export class Dbrt03Service extends BaseService {
    constructor(private http: HttpClient) {
        super();
    }

    findDbTitles(searchCriteria: any, page: any) {
        const filter = Object.assign(searchCriteria, page); // merge object
        return this.http.get<any>('dbrt03', { params: filter });
    }

    findDbTitleByKey(code) {
        return this.http.get<DbTitle>('dbrt03/detail', { params: { titleCode: code } });
    }

    save(dbTitle: DbTitle , formGroup: FormGroup) {
        const db = Object.assign({}, dbTitle, formGroup);
        if (db.rowVersion) {
            return this.http.put<any>('dbrt03', db);
        } else {
            return this.http.post<any>('dbrt03', db);
        }
    }

    delete(code, version) {
        return this.http.delete('dbrt03', { params: { titleCode: code, rowVersion: version }});
    }
}
