import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseService } from '@app/shared';

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
export class Tndbrt03Service extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }

  findDbTitle(searchCriteria: any, page: any) {
    const filter = Object.assign(searchCriteria, page);
    return this.http.get<any>('tndbrt03', { params: filter });
  }

  findDbTitleByKey(tCode) {
    return this.http.get<DbTitle>('tndbrt03/detail', { params: { titleCode: tCode } });
  }

  delete(tCode, version) {
    return this.http.delete('tndbrt03', { params: { titleCode: tCode, rowVersion: version } });
  }

  save(dbTitle: DbTitle, formGroup: FormGroup) {
    const db = Object.assign({}, dbTitle, formGroup);
    if (db.rowVersion) {
      return this.http.put<any>('tndbrt03', db);
    } else {
      return this.http.post<any>('tndbrt03', db);
    }
  }
}
