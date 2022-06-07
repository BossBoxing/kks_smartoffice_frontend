import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseList, BaseService } from '@app/shared';


export interface DpEvaluationMaster {
  transNo: string;
  evaluationYear: number;
  evaluationPeriod: number;
  evaluator: string;
  totalScore: number;
  totalScoreEmp: number;
  submitDate: Date;
  status: string;
  nextEvaluators: string;
  isLastEvaluator: boolean;
  remark: string;
  remarkEmp: string;
  rowVersion: number;
  scores: DpTransactionEvaluation[];
  scoresEva: DpTransactionEvaluation[];
  refTransNo: string;

  updatedBy: string;
  updatedDate: string;
  empId: string;

  statusDesc: string;
  statusColor: string;
  flagStatus: string;
  docFormatNo: string;
}

export interface DpTransactionEvaluation extends BaseList {
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

  evaNo: string;
  evaSeq: number;
  evaScore: number;
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
export class Dpdt02Service extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }

  findDpEvaluationMasterByKey(transNo) {
    return this.http.get<DpEvaluationMaster>('dpdt02/detail', { params: { transNo } });
  }

  findMasterData(Page: string) {
    return this.http.get<any>('dpdt02/master', { params: { page: Page } });
  }

  findDpEvaluationMaster(searchCriteria: any, page: any) {
    const filter = Object.assign(searchCriteria, page);
    return this.http.get<any>('dpdt02', { params: filter });
  }

  findEvaYearForATC(keyword: string, value: string) {
    return this.http.get<any>('dpdt02/findEvaYearForATC', { params: { keyword, value } });
  }

  findEvaPeriodForATC(keyword: string, value: string, year: string) {
    return this.http.get<any>('dpdt02/findEvaPeriodForATC', { params: { keyword, value, year } });
  }

  findDocFormatNoForATC(keyword: string, value: string) {
    return this.http.get<any>('dpdt02/findDocFormatNoForATC', { params: { keyword, value } });
  }

  findEvaluatorsForATC(keyword: string, value: string) {
    return this.http.get<any>('dpdt02/findEvaluatorsForATC', { params: { keyword, value } });
  }

  findStatusATC(keyword: string, value: string) {
    return this.http.get<any>('dpdt02/findStatusForATC', { params: { keyword, value } });
  }

  findDocFormatDetailForTab(params: any) {
    return this.http.get<any>('dpdt02/findDocFormatDetailForTab', { params });
  }

  save(dpEvaluationMaster: DpEvaluationMaster, formGroup: FormGroup) {
    const Transaction = Object.assign({}, dpEvaluationMaster, formGroup);
    if (dpEvaluationMaster.rowVersion) {
      return this.http.put<any>('dpdt02', Transaction);
    } else {
      return this.http.post<any>('dpdt02', Transaction);
    }
  }
}
