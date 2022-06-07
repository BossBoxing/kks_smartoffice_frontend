import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseList, BaseService } from '@app/shared';

export interface DpTransectionMaster {
  transNo: string;
  evaluationYear: number;
  evaluationPeriod: number;
  docFormatNo: string;
  empId: number;
  totalScore: number;
  submitDate: Date;
  evaluator: string;
  status: string;
  updatedBy: string;
  updatedDate: string;
  nextEvaluators: string;
  isLastEvaluator: boolean;
  remark: string;
  rowVersion: number;
  scores: DpTransactionScore[];

  statusDesc: string;
  statusColor: string;
  flagStatus: string;
}

export interface DpTransactionScore extends BaseList {
  ouCode: string;
  transNo: string;
  transSeq: number;
  topicNo: string;
  mainTopic: string;
  maxScore: number;
  scoreMonth1: number;
  scoreMonth2: number;
  scoreMonth3: number;
  scoreMonth4: number;
  scoreMonth5: number;
  scoreMonth6: number;
  scoreMonth7: number;
  scoreMonth8: number;
  scoreMonth9: number;
  scoreMonth10: number;
  scoreMonth11: number;
  scoreMonth12: number;
  rowVersion: number;
}

export interface DpFormatMaster {
  docFormatNo: string;
  docFormatNameTha: string;
  docFormatNameEng: string;
  startDate: string;
  endDate: string;
  detailDto: DpFormatDetail[];
}

export interface DpFormatDetail extends BaseList {
  topicNo: string;
  isMainType: boolean;
  docFormatNo: string;
  mainTopic: string;
  maxScore: number;
  description: string;
  subDetailDto: DpFormatDetail[];
  guides: DpFormatGuildeline[];
  transSeq: number;
  scoreMonth1: number;
  scoreMonth2: number;
  scoreMonth3: number;
  scoreMonth4: number;
  scoreMonth5: number;
  scoreMonth6: number;
  scoreMonth7: number;
  scoreMonth8: number;
  scoreMonth9: number;
  scoreMonth10: number;
  scoreMonth11: number;
  scoreMonth12: number;
  avgScore: number;
  rowVersion: number;
}

export interface DpFormatGuildeline extends BaseList {
  docFormatNo: string;
  topicNo: string;
  guidelineSeq: number;
  guidelineDescTha: string;
  guidelineDescEng: string;
  guidelineScore: number;
}

@Injectable()
export class Dpdt01Service extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }

  findFnReceiveMasterByKey(transNo) {
    return this.http.get<DpTransectionMaster>('dpdt01/detail', { params: { transNo } });
  }

  findMasterData(Page: string) {
    return this.http.get<any>('dpdt01/master', { params: { page: Page } });
  }
  findDpTransectionMaster(searchCriteria: any, page: any) {
    const filter = Object.assign(searchCriteria, page);
    return this.http.get<any>('dpdt01', { params: filter });
  }

  findEvaYearForATC(keyword: string, value: string) {
    return this.http.get<any>('dpdt01/findEvaYearForATC', { params: { keyword, value } });
  }

  findEvaPeriodForATC(keyword: string, value: string, year: string) {
    return this.http.get<any>('dpdt01/findEvaPeriodForATC', { params: { keyword, value, year } });
  }

  findDocFormatNoForATC(keyword: string, value: string) {
    return this.http.get<any>('dpdt01/findDocFormatNoForATC', { params: { keyword, value } });
  }

  findEvaluatorsForATC(keyword: string, value: string) {
    return this.http.get<any>('dpdt01/findEvaluatorsForATC', { params: { keyword, value } });
  }

  findStatusATC(keyword: string, value: string) {
    return this.http.get<any>('dpdt01/findStatusForATC', { params: { keyword, value } });
  }

  findDpTransectionMasterByKey(transNo) {
    return this.http.get<DpTransectionMaster>('dpdt01/detail', { params: { transNo } });
  }

  findDocFormatDetailForTab(params: any) {
    return this.http.get<any>('dpdt01/findDocFormatDetailForTab', { params });
  }

  save(dpTransectionMaster: DpTransectionMaster, formGroup: FormGroup) {
    const Transaction = Object.assign({}, dpTransectionMaster, formGroup);
    if (dpTransectionMaster.rowVersion) {
      return this.http.put<any>('dpdt01', Transaction);
    } else {
      return this.http.post<any>('dpdt01', Transaction);
    }
  }
}
