import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormUtilService, ReportParam } from '@app/shared';
import { FormLink } from '@app/shared/component/base-form';

@Component({
  selector: 'app-report',
  templateUrl: './reportfinc.component.html',
  styleUrls: ['./reportfinc.component.scss']
})
export class ReportFincComponent implements OnInit, FormLink {
  criteriaForm: FormGroup;
  reportParam = {} as ReportParam;

  vouchNo = [{ text: 'J0163010001', value: 'J0163010001'},
            { text: 'J0163010002', value: 'J0163010002'},
            { text: 'J0163010003', value: 'J0163010003'}];

  constructor(
    private fb: FormBuilder,
    public util: FormUtilService
  ) {}

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.criteriaForm = this.fb.group({
      vouchNoFrom : [null , [Validators.required]],
      vouchNoTo : null,
      docDateStart : null,
      docDateEnd : null
    });
  }

  assignReportParam() {
    this.reportParam.module = 'GL';
    this.reportParam.reportName = 'GLOD01_X';
    this.reportParam.autoLoadLabel = 'GLOD01_X';
    this.reportParam.paramsJson = {
      p_s_vouch_no : this.criteriaForm.controls.vouchNoFrom.value,
      p_e_vouch_no : this.criteriaForm.controls.vouchNoTo.value,
      p_s_doc_date : this.criteriaForm.controls.docDateStart.value,
      p_e_doc_date : this.criteriaForm.controls.docDateEnd.value
    };
  }
}
