import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseService } from '@app/shared';

export interface TnIdpTransMaster {
  ouCode: string;
  transNo: string;
  transYear: number;
  transPeriod: number;
  startMonth: number;
  endMonth: number;
  empId: string;
  teamEmpId: string;
  submitDate: Date;
  status: string;
  totalScore: number;
  grade: string;
  remark: string;
  rowVersion: number;
}

@Injectable()
export class Tndt01Service extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }

  findTnIdpTransMaster(kWord, kYear, kPeriod, page) {
    const filter = Object.assign({keyword: kWord, keywordYear: kYear, keywordPeriod: kPeriod}
      , page);
    return this.http.get<any>('tndt01', { params: filter});
  }

  findTnIdpTransByKey(tNo) {
    return this.http.get<TnIdpTransMaster>('tndt01/detail', { params: { transNo: tNo } });
  }

  delete(tCode, version) {
    return this.http.delete('tndt01', { params: { titleCode: tCode, rowVersion: version } });
  }

  save(transMaster: TnIdpTransMaster, formGroup: FormGroup) {
    const db = Object.assign({}, transMaster, formGroup);
    if (db.rowVersion) {
      return this.http.put<any>('tndt01', db);
    } else {
      return this.http.post<any>('tndt01', db);
    }
  }
}
