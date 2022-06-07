import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '@app/shared';
import { FormGroup } from '@angular/forms';

export interface DbRace {
    raceCode: string;
    raceNameTha: string;
    raceNameEng: string;
    active: string;
    activeBool: boolean;
    rowVersion: number;
}

@Injectable()
export class Dbrt07Service extends BaseService {
    constructor(private http: HttpClient) {
        super();
    }

    findDbRaces(searchCriteria: any, page: any) {
        const filter = Object.assign(searchCriteria, page);
        return this.http.get<any>('dbrt07', { params: filter });
    }

    findDbRaceByKey(code) {
        return this.http.get<DbRace>('dbrt07/detail', { params: { raceCode: code } });
    }

    save(dbRace: DbRace , formGroup: FormGroup) {
        const db = Object.assign({}, dbRace, formGroup);
        if (db.rowVersion) {
            return this.http.put<any>('dbrt07', db);
        } else {
            return this.http.post<any>('dbrt07', db);
        }
    }

    delete(raceCode, version) {
        return this.http.delete('dbrt07', { params: { raceCode, rowVersion: version } });
    }
}
