import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FormUtilService, ReportParam } from '@app/shared';
import { FormLink } from '@app/shared/component/base-form';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { PlConstants } from '../common/pl-constants';

@Component({
  selector: 'app-plrp01',
  templateUrl: './plrp01.component.html',
  styleUrls: ['./plrp01.component.scss']
})
export class Plrp01Component implements OnInit, FormLink {
  public static readonly programCode = 'plrp01';
  criteriaForm: FormGroup;
  reportParam = {} as ReportParam;
  masterData = {
    employeeInfo: [],
    workCodes: [],
    customerTypes: []
  };
  radioTaskType = [{ value: PlConstants.TaskType.Development, text: '' }
    , { value: PlConstants.TaskType.Other, text: '' }];

  constructor(
    private fb: FormBuilder,
    public util: FormUtilService,
    private route: ActivatedRoute,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.masterData = data.plrp01.masterData;
    });
    this.createForm();
    this.installEvent();
    this.criteriaForm.patchValue(this.masterData.employeeInfo[0]);
    forkJoin([
      this.translate.get('label.PLRP01.Development'),
      this.translate.get('label.PLRP01.Other')]
    ).pipe(map(result => {
      this.radioTaskType[0].text = result[0];
      this.radioTaskType[1].text = result[1];
    })).subscribe();
  }
  // test 1.0.1
  createForm() {
    this.criteriaForm = this.fb.group({
      divCodeName: { value: null, disabled: true },
      divCodeId: null,
      managerName: { value: null, disabled: true },
      managerId: null,
      empCode: { value: null, disabled: true },
      empName: { value: null, disabled: true },
      customerTypeStart: null,
      customerTypeEnd: null,
      workTypeCodeStart: null,
      workTypeCodeEnd: null,
      docDateStart: new Date(),
      docDateEnd: new Date(),
      taskType: PlConstants.TaskType.Development
    });
  }

  assignReportParam() {
    this.reportParam.module = PlConstants.ModuleCode;
    this.reportParam.reportName = 'PLRP01';
    this.reportParam.autoLoadLabel = 'PLRP01';
    this.reportParam.paramsJson = {
      p_emp_code: this.criteriaForm.controls.empCode.value,
      p_customer_type_start: this.criteriaForm.controls.customerTypeStart.value,
      p_customer_type_end: this.criteriaForm.controls.customerTypeEnd.value,
      p_work_type_code_start: this.criteriaForm.controls.workTypeCodeStart.value,
      p_work_type_code_end: this.criteriaForm.controls.workTypeCodeEnd.value,
      p_doc_date_start: this.criteriaForm.controls.docDateStart.value,
      p_doc_date_end: this.criteriaForm.controls.docDateEnd.value,
      p_task_type: this.criteriaForm.controls.taskType.value
    };
  }

  clear() {
    this.criteriaForm.patchValue(this.masterData.employeeInfo[0]);
    this.criteriaForm.patchValue({
      taskType: PlConstants.TaskType.Development
    });
  }

  installEvent() {
  }
}
