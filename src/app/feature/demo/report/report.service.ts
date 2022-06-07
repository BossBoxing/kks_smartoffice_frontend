import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RowState, BaseService, BaseList } from '@app/shared';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

export interface ReportParam {
  FacCode: string;
  ReportName: string;
  ExportType: string;
  }

@Injectable()
export class ReportService extends BaseService {
    constructor(private http: HttpClient) { super() }
  
    generateReport(param: ReportParam) {
        return this.http.post('Demo/getdemoreport', param, { responseType: 'blob',observe:'response' });
    }
}