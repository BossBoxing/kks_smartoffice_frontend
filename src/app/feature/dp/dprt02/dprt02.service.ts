import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseService } from '@app/shared';

export interface DpPeriod {
  evaluationYear: number;
  evaluationPeriod: number;
  startDate: Date;
  endDate: Date;
  closeDate: Date;
  active: boolean;
  rowVersion: number;
}

@Injectable()
export class Dprt02Service extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }

  findDpPeriods(searchCriteria: any, page: any) {
    const filter = Object.assign(searchCriteria, page);
    return this.http.get<any>('dprt02', { params: filter });
  }

  findDpPeriodByKey(evaluationYear: any, evaluationPeriod: any) {
    return this.http.get<DpPeriod>('dprt02/detail', { params: { evaluationYear, evaluationPeriod } });
  }

  delete(evaluationYear, evaluationPeriod, rowVersion) {
    return this.http.delete('dprt02', { params: { evaluationYear, evaluationPeriod, rowVersion } });
  }

  save(dpPeriod: DpPeriod, formGroup: FormGroup) {
    const period = Object.assign({}, dpPeriod, formGroup);
    if (period.rowVersion) {
      return this.http.put<any>('dprt02', period);
    } else {
      return this.http.post<any>('dprt02', period);
    }
  }

}
