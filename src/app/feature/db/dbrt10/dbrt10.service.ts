import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '@app/shared';
import { FormGroup } from '@angular/forms';

export interface DbPosition {
    positionCode: string;
    positionNameTha: string;
    positionNameEng: string;
    active: string;
    activeBool: boolean;
    rowVersion: number;
}

@Injectable()
export class Dbrt10Service extends BaseService {
    constructor(private http: HttpClient) {
        super();
    }

    findDbPositions(searchCriteria: any, page: any) {
        const filter = Object.assign(searchCriteria, page);
        return this.http.get<any>('dbrt10', { params: filter });
    }

    findDbPositionByKey(code) {
        return this.http.get<DbPosition>('dbrt10/detail', { params: { positionCode: code } });
    }

    save(dbPosition: DbPosition , formGroup: FormGroup) {
        const db = Object.assign({}, dbPosition, formGroup);
        if (db.rowVersion) {
            return this.http.put<any>('dbrt10', db);
        } else {
            return this.http.post<any>('dbrt10', db);
        }
    }

    delete(positionCode, version) {
        return this.http.delete('dbrt10', { params: { positionCode, rowVersion: version } });
    }
}
