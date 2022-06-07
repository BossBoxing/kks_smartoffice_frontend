import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

export interface PlTaskEntry {
    empCode: string;
    workDate: Date;
    startWorkDate: Date; // non-base
    endWorkDate: Date; // non-base
    start: Date; // non-base
    end: Date; // non-base
    startTimeHrs: string; // non-base
    endTimeHrs: string; // non-base
    seq: number;
    workType: string;
    custCode: string;
    releaseCode: string;
    projCode: string;
    progDevId: string;
    progName: string;
    workCode: string;
    remark: string;
    progTypeCode: string;
    assPts: number;
    progress: number;
    progStatus: string;
    infFlag: string;
    totalHrs: number;
    xlsFlag: string;
    calAssPts: number;
    rowVersion: number;
}

@Injectable()
export class Pldt01Service {
    constructor(private http: HttpClient) { }

    findMasterData() {
        return this.http.get<any>('pldt01/master');
    }

    findPlTaskEntrys() {
        return this.http.get<any>('pldt01');
    }

    findCustCodeForATC(keyword: string, value: string) {
        return this.http.get<any>('pldt01/findCustCodeForATC', { params: { keyword, value } });
    }

    findReleaseCodeForATC(keyword: string, value: string, params: any) {
        return this.http.get<any>('pldt01/findReleaseCodeForATC', { params: Object.assign({ keyword, value }, params) });
    }

    findProjCodeForATC(keyword: string, value: string, params: any) {
        return this.http.get<any>('pldt01/findProjCodeForATC', { params: Object.assign({ keyword, value }, params) });
    }

    findWorkCodeForATC(keyword: string, value: string) {
        return this.http.get<any>('pldt01/findWorkCodeForATC', { params: { keyword, value } });
    }

    findProgTypeCodeForATC(keyword: string, value: string) {
        return this.http.get<any>('pldt01/findProgTypeCodeForATC', { params: { keyword, value } });
    }

    findProgNameByProgId(progId: string) {
        return this.http.get<any>('pldt01/findProgNameByProgId', { params: { progId } });
    }

    save(plTaskEntry: PlTaskEntry, formGroup: FormGroup) {
        const taskEntry = Object.assign({}, plTaskEntry, formGroup);
        if (taskEntry.rowVersion) {
            return this.http.put<any>('pldt01', taskEntry);
        } else {
            return this.http.post<any>('pldt01', taskEntry);
        }
    }

    copy(copyForm: FormGroup) {
        return this.http.post<any>('pldt01/copy', copyForm);
    }

    delete(seq, rowVersion) {
        return this.http.delete('pldt01', { params: { seq, rowVersion } });
    }

}
