import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseList, BaseService, RowState } from '@app/shared';
import { FormGroup } from '@angular/forms';

export interface SuProgramInfo {
  programCode: string;
  programName: string;
  programPath: string;
  systemCode: string;
  moduleCode: string;
  rowVersion: number;
  suProgramLabels: SuProgramLabel[];
}

export class SuProgramLabel extends BaseList {
  systemCode: string;
  moduleCode: string;
  programCode: string;
  fieldName: string;
  linId: string;
  labelName: string;
  labelNameTh: string;
  rowVersion: number;
  labelNameEn: string;
  rowVersionEn: number;
  rowStateEn: RowState;
}

@Injectable()
export class Surt02Service extends BaseService {

  constructor(private http: HttpClient) { super(); }

  findSuPrograms(search: string, page: any) {
    const filter = Object.assign({ keyword: search }, page);
    return this.http.get<any>('surt02', { params: filter });
  }

  findSuProgramInfoByKey(programCode, ReadOnly: boolean = false) {
    return this.http.get<SuProgramInfo>('surt02/detail', { params: { programCode, readOnly: ReadOnly.toString() }});
  }

  findMasterData() {
    return this.http.get<any>('surt02/master');
  }

  save( suProgram: SuProgramInfo
    ,   suProgramForm: FormGroup
    ,   programLabelDelete: SuProgramLabel[]) {
    const suProgramInfoDTO = Object.assign({}, suProgram, suProgramForm);
    suProgramInfoDTO.suProgramLabels = this.prepareSaveProgramLabels(suProgram.suProgramLabels, programLabelDelete);
    if (suProgramInfoDTO.rowVersion) {
        return this.http.put<any>('surt02', suProgramInfoDTO);
    } else {
        return this.http.post<any>('surt02', suProgramInfoDTO);
    }
  }

  delete(code, version) {
    return this.http.delete('surt02', { params: { programCode: code, rowVersion: version }});
  }

  prepareSaveProgramLabels(details, detailsDelete): any[] {
    details = details.filter(item => item.rowState !== RowState.Normal || item.rowStateEn !== RowState.Normal)
      .map(({ ...prop }) => {
          try {
              Object.assign(prop, prop.form.getRawValue());
              delete prop.form;
          } catch (err) {}
          return prop;
      }).concat(detailsDelete.map(({ form, ...prop }) => {prop.rowState = RowState.Delete; return prop; }));
    return details;
  }
}
