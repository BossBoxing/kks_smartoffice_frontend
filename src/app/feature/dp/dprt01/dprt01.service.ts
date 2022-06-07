import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseList, BaseService } from '@app/shared';

export interface DpFormatMaster {
  docFormatNo: string;
  docFormatNameTha: string;
  docFormatNameEng: string;
  docFormatType: string;
  active: boolean;
  rowVersion: number;
  details: DpFormatDetail[];
}

export interface DpFormatDetail extends BaseList {
  docFormatNo: string;
  topicNo: string;
  isMainType: boolean;
  mainTopic: string;
  descriptionTha: string;
  descriptionEng: string;
  maxScore: number;
  rowVersion: number;
  guides: DpFormatGuideline[];
}

export interface DpFormatGuideline extends BaseList {
  docFormatNo: string;
  topicNo: string;
  guidelineSeq: number;
  guidelineDescTha: string;
  guidelineDescEng: string;
  guidelineScore: number;
  rowVersion: number;
}

@Injectable()
export class Dprt01Service extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }

  findDpformatMaster(searchCriteria: any, page: any) {
    const filter = Object.assign(searchCriteria, page);
    return this.http.get<any>('dprt01', { params: filter });
  }

  findFormatTypeForATC(keyword: string, value: string) {
    return this.http.get<any>('dprt01/findFormatTypeForATC', { params: { keyword, value } });
  }

  findDpFormatMasterByKey(docFormatNo, topicNo) {
    return this.http.get<DpFormatMaster>('dprt01/detail', { params: { docFormatNo, topicNo } });
  }

  findMasterData(Page: string) {
    return this.http.get<any>('dprt01/master', { params: { page: Page } });
  }
  // save detail
  save(dpFormatMaster: DpFormatMaster, formGroup: FormGroup, dpFormatDetailDelete: DpFormatDetail[]) {
    const formatMaster = Object.assign({}, dpFormatMaster, formGroup);
    formatMaster.details = this.prepareSaveList(formatMaster.details, dpFormatDetailDelete);
    if (formatMaster.rowVersion) {
      return this.http.put<any>('dprt01', formatMaster);
    } else {
      return this.http.post<any>('dprt01', formatMaster);
    }
  }

  // save guideline
  saveDetail(dpFormatMaster: DpFormatMaster
    ,        dpFormatMasterForm: FormGroup
    ,        dpFormatDetail: DpFormatDetail
    ,        dpFormatDetailForm: FormGroup
    ,        dpFormatGuidelineDelete: DpFormatGuideline[]) {
    const master = Object.assign({}, dpFormatMaster, dpFormatMasterForm);
    const detail = Object.assign({}, dpFormatDetail, dpFormatDetailForm);
    detail.guides = this.prepareSaveList(dpFormatDetail.guides, dpFormatGuidelineDelete);
    master.details = [detail];
    if (master.rowVersion) {
      return this.http.put<any>('dprt01', master);
    }
  }
}
