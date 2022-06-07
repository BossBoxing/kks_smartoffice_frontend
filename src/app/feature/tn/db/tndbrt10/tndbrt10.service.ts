import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseService } from '@app/shared';

export interface DbPosition {
  positionCode: string;
  positionNameTha: string;
  positionNameEng: string;
  active: string;
  activeBool: boolean;
  rowVersion: number;
}

@Injectable()
export class Tndbrt10Service extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }

  findDbPosition(searchCriteria: any, page: any) {
    const filter = Object.assign(searchCriteria, page);
    return this.http.get<any>('tndbrt10', { params: filter });
}

findDbPositionByKey(pCode) {
  return this.http.get<DbPosition>('tndbrt10/detail', { params: { positionCode: pCode } });
}

delete(pCode, version) {
  return this.http.delete('tndbrt10', { params: { positionCode: pCode, rowVersion: version } });
}

save(dbPositione: DbPosition, formGroup: FormGroup) {
  const db = Object.assign({}, dbPositione, formGroup);
  if (db.rowVersion) {
      return this.http.put<any>('tndbrt10', db);
  } else {
      return this.http.post<any>('tndbrt10', db);
  }
}

}
