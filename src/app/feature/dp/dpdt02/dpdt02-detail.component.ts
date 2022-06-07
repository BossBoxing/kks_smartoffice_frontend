import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CanComponentDeactivate, MessageService } from '@app/core';
import { CommonConstants } from '@app/feature/common/common-constants';
import { FormUtilService, ModalService } from '@app/shared';
import { BasicForm } from '@app/shared/component/base-form';
import { Guid } from 'guid-typescript';
import { Observable, of } from 'rxjs';
import { finalize, switchMap } from 'rxjs/operators';
import { DpConstants } from '../common/dp-constants';
import { Dpdt02Service, DpEvaluationMaster, DpFormatMaster, DpFormatDetail } from './dpdt02.service';

@Component({
  selector: 'app-dpdt02-detail',
  templateUrl: './dpdt02-detail.component.html',
  styleUrls: ['./dpdt02-detail.component.scss']
})
export class Dpdt02DetailComponent implements OnInit, CanComponentDeactivate, BasicForm {
  dpEvaluationMasterForm: FormGroup;
  dpEvaluationMaster: DpEvaluationMaster = {} as DpEvaluationMaster;
  dpFormatMaster: DpFormatMaster = {} as DpFormatMaster;
  saving = false;
  masterData = {
    evaluationYear: [],
    evaluationPeriod: []
  };
  userInfo;
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private dp: Dpdt02Service,
    public util: FormUtilService,
    private ms: MessageService,
    private modal: ModalService
  ) { }

  ngOnInit() {
    this.createForm();
    this.route.data.subscribe((data) => {
      this.dpEvaluationMaster = data.dpdt02.detail;
      this.initialMasterData(data);
      this.rebuildForm();
    });
    this.installEvent();
  }

  initialMasterData(data: any) {
    this.masterData = data.dpdt02.masterData;
    this.userInfo = data.dpdt02.masterData.userInfo;
  }

  createForm() {
    this.dpEvaluationMasterForm = this.fb.group({
      evaNo: null,
      ouCude: null,
      transNo: CommonConstants.Auto.Text,
      evaluationYear: [null, [Validators.required]],
      evaluationPeriod: [null, [Validators.required]],
      docFormatNo: [null, [Validators.required]],
      totalScore: null,
      submitDate: null,
      evaluator: null,
      status: null,
      nextEvaluators: null,
      isLastEvaluator: false,
      gradeTotalScore: null,
      remark: null,
      allMaxScore: null,
      updatedBy: null,
      updatedDate: null,
      rowVersion: null,
      refTransNo: null,
      flagStatus: null,
      statusDesc: null,
      StatusColor: null,

      totalScoreEmp: null,
      gradeTotalScoreEmp: null,
      remarkEmp: null,
      empId: null
    });
  }

  rebuildForm() {
    this.dpEvaluationMasterForm.markAsPristine();

    this.dpEvaluationMasterForm.controls.refTransNo.disable({ emitEvent: false });
    this.dpEvaluationMasterForm.controls.evaluator.disable({ emitEvent: false });
    this.dpEvaluationMasterForm.controls.empId.disable({ emitEvent: false });
    this.dpEvaluationMasterForm.controls.statusDesc.disable({ emitEvent: false });
    this.dpEvaluationMasterForm.controls.updatedBy.disable({ emitEvent: false });
    this.dpEvaluationMasterForm.controls.updatedDate.disable({ emitEvent: false });
    this.dpEvaluationMasterForm.controls.totalScore.disable({ emitEvent: false });
    this.dpEvaluationMasterForm.controls.totalScoreEmp.disable({ emitEvent: false });
    this.dpEvaluationMasterForm.controls.gradeTotalScore.disable({ emitEvent: false });
    this.dpEvaluationMasterForm.controls.gradeTotalScoreEmp.disable({ emitEvent: false });
    this.dpEvaluationMasterForm.controls.evaluationPeriod.disable({ emitEvent: false });
    this.dpEvaluationMasterForm.controls.submitDate.disable({ emitEvent: false });
    this.dpEvaluationMasterForm.controls.remarkEmp.disable({ emitEvent: false });
    this.dpEvaluationMasterForm.controls.transNo.disable({ emitEvent: false });
    this.dpEvaluationMasterForm.controls.evaluationYear.disable({ emitEvent: false });
    this.dpEvaluationMasterForm.controls.evaluationPeriod.disable({ emitEvent: false });
    this.dpEvaluationMasterForm.controls.docFormatNo.disable({ emitEvent: false });

    if (this.dpEvaluationMasterForm.controls.isLastEvaluator.value) {
      this.dpEvaluationMasterForm.controls.nextEvaluators.enable({ emitEvent: false });
      this.dpEvaluationMasterForm.controls.nextEvaluators.setValidators([Validators.required]);
    } else {
      this.dpEvaluationMasterForm.controls.nextEvaluators.disable({ emitEvent: false });
      this.dpEvaluationMasterForm.controls.nextEvaluators.clearAsyncValidators();
    }
    if (this.dpEvaluationMaster.rowVersion) {
      this.dpEvaluationMasterForm.patchValue(this.dpEvaluationMaster);
      if (this.dpEvaluationMasterForm.controls.isLastEvaluator.value) {
        this.dpEvaluationMasterForm.controls.nextEvaluators.enable({ emitEvent: false });
        this.dpEvaluationMasterForm.controls.nextEvaluators.setValidators([Validators.required]);
        this.dpEvaluationMasterForm.markAsPristine();
      } else {
        this.dpEvaluationMasterForm.controls.nextEvaluators.disable({ emitEvent: false });
        this.dpEvaluationMasterForm.controls.nextEvaluators.clearAsyncValidators();
        this.dpEvaluationMasterForm.markAsPristine();
      }
      this.callReloadDetailTable();
    } else {
      this.dpFormatMaster.detailDto = [];
    }
    if (this.dpEvaluationMaster.status === DpConstants.StatusDoc.Cancel
      || this.dpEvaluationMaster.status === DpConstants.StatusDoc.Approve) {
      this.dpEvaluationMasterForm.controls.isLastEvaluator.disable({ emitEvent: false });
      this.dpEvaluationMasterForm.controls.nextEvaluators.disable({ emitEvent: false });
      this.dpEvaluationMasterForm.controls.remark.disable({ emitEvent: false });
    }
    this.dpEvaluationMasterForm.controls.gradeTotalScore.setValue(
      this.calculateGrade(this.dpEvaluationMasterForm.controls.totalScore.value)
    );
    this.dpEvaluationMasterForm.controls.gradeTotalScoreEmp.setValue(
      this.calculateGrade(this.dpEvaluationMasterForm.controls.totalScoreEmp.value)
    );
    this.dpEvaluationMasterForm.markAsPristine();
  }
  installEvent() {
    this.dpEvaluationMasterForm.controls.isLastEvaluator.valueChanges.subscribe(isLastEvaluator => {
      if (this.dpEvaluationMasterForm.controls.isLastEvaluator.dirty) {
        if (this.dpEvaluationMasterForm.controls.isLastEvaluator.value) {
          this.dpEvaluationMasterForm.controls.nextEvaluators.setValue(null);
          this.dpEvaluationMasterForm.controls.nextEvaluators.enable({ emitEvent: false });
          this.dpEvaluationMasterForm.controls.nextEvaluators.setValidators([Validators.required]);
        } else {
          this.dpEvaluationMasterForm.controls.nextEvaluators.setValue(null);
          this.dpEvaluationMasterForm.controls.nextEvaluators.disable({ emitEvent: false });
          this.dpEvaluationMasterForm.controls.nextEvaluators.clearValidators();
        }
        this.dpEvaluationMasterForm.controls.nextEvaluators.updateValueAndValidity();
      }
    });
    this.dpEvaluationMasterForm.markAsPristine();
  }

  callReloadDetailTable() {
    this.dp.findDocFormatDetailForTab({
      docFormatNo: this.dpEvaluationMasterForm.controls.docFormatNo.value,
      transNo: this.dpEvaluationMaster.refTransNo,
      evaluationYear: this.dpEvaluationMasterForm.controls.evaluationYear.value,
      evaluationPeriod: this.dpEvaluationMasterForm.controls.evaluationPeriod.value,
      evaNo: this.dpEvaluationMaster.transNo,
    }).subscribe(result => {
      this.dpFormatMaster = result;
      this.dpFormatMaster.detailDto.forEach(row => {
        row.subDetailDto.forEach(sub => sub.form = this.createTransactionEvaluation(sub));
      });
      this.dpEvaluationMasterForm.markAsPristine();
    });
  }

  createTransactionEvaluation(detail: DpFormatDetail) {
    const fg = this.fb.group({
      ouCode: null,
      transNo: null,
      transSeq: null,
      topicNo: null,
      mainTopic: null,
      maxScore: null,
      scoreMonth1: [null, [Validators.max(detail.maxScore), Validators.min(0)]],
      scoreMonth2: [null, [Validators.max(detail.maxScore), Validators.min(0)]],
      scoreMonth3: [null, [Validators.max(detail.maxScore), Validators.min(0)]],
      scoreMonth4: [null, [Validators.max(detail.maxScore), Validators.min(0)]],
      scoreMonth5: [null, [Validators.max(detail.maxScore), Validators.min(0)]],
      scoreMonth6: [null, [Validators.max(detail.maxScore), Validators.min(0)]],
      scoreMonth7: [null, [Validators.max(detail.maxScore), Validators.min(0)]],
      scoreMonth8: [null, [Validators.max(detail.maxScore), Validators.min(0)]],
      scoreMonth9: [null, [Validators.max(detail.maxScore), Validators.min(0)]],
      scoreMonth10: [null, [Validators.max(detail.maxScore), Validators.min(0)]],
      scoreMonth11: [null, [Validators.max(detail.maxScore), Validators.min(0)]],
      scoreMonth12: [null, [Validators.max(detail.maxScore), Validators.min(0)]],
      evaNo: null,
      evaSeq: null,
      evaScore: [null, [Validators.max(detail.maxScore), Validators.min(0)]],
      avgScore: { value: null, disabled: true },
      rowVersion: null,
      guid: Guid.raw()
    });
    detail.guid = fg.controls.guid.value;
    fg.patchValue(detail, { emitEvent: false });

    const AllScore: any[] = [];
    AllScore[0] = null;
    AllScore[1] = fg.controls.scoreMonth1.value;
    AllScore[2] = fg.controls.scoreMonth2.value;
    AllScore[3] = fg.controls.scoreMonth3.value;
    AllScore[4] = fg.controls.scoreMonth4.value;
    AllScore[5] = fg.controls.scoreMonth5.value;
    AllScore[6] = fg.controls.scoreMonth6.value;
    AllScore[7] = fg.controls.scoreMonth7.value;
    AllScore[8] = fg.controls.scoreMonth8.value;
    AllScore[9] = fg.controls.scoreMonth9.value;
    AllScore[10] = fg.controls.scoreMonth10.value;
    AllScore[11] = fg.controls.scoreMonth11.value;
    AllScore[12] = fg.controls.scoreMonth12.value;
    fg.controls.avgScore.setValue(this.calculateAllscore(AllScore), { emitEvent: false });
    if (this.dpEvaluationMaster.status === DpConstants.StatusDoc.Cancel
      || this.dpEvaluationMaster.status === DpConstants.StatusDoc.Approve) {
      fg.disable({ emitEvent: false });
    } else {
      fg.controls.scoreMonth1.disable({ emitEvent: false });
      fg.controls.scoreMonth2.disable({ emitEvent: false });
      fg.controls.scoreMonth3.disable({ emitEvent: false });
      fg.controls.scoreMonth4.disable({ emitEvent: false });
      fg.controls.scoreMonth5.disable({ emitEvent: false });
      fg.controls.scoreMonth6.disable({ emitEvent: false });
      fg.controls.scoreMonth7.disable({ emitEvent: false });
      fg.controls.scoreMonth8.disable({ emitEvent: false });
      fg.controls.scoreMonth9.disable({ emitEvent: false });
      fg.controls.scoreMonth10.disable({ emitEvent: false });
      fg.controls.scoreMonth11.disable({ emitEvent: false });
      fg.controls.scoreMonth12.disable({ emitEvent: false });
    }

    fg.valueChanges.subscribe(data => {
      AllScore[0] = null;
      AllScore[1] = fg.controls.scoreMonth1.value;
      AllScore[2] = fg.controls.scoreMonth2.value;
      AllScore[3] = fg.controls.scoreMonth3.value;
      AllScore[4] = fg.controls.scoreMonth4.value;
      AllScore[5] = fg.controls.scoreMonth5.value;
      AllScore[6] = fg.controls.scoreMonth6.value;
      AllScore[7] = fg.controls.scoreMonth7.value;
      AllScore[8] = fg.controls.scoreMonth8.value;
      AllScore[9] = fg.controls.scoreMonth9.value;
      AllScore[10] = fg.controls.scoreMonth10.value;
      AllScore[11] = fg.controls.scoreMonth11.value;
      AllScore[12] = fg.controls.scoreMonth12.value;
      fg.controls.avgScore.setValue(this.calculateAllscore(AllScore), { emitEvent: false });

      this.calculateEvaScore();
      this.dpEvaluationMasterForm.markAsDirty();
    });
    if (detail.rowVersion) {
      fg.markAsPristine();
    }
    return fg;
  }

  calculateEvaScore() {
    let totalScore = 0;
    this.dpFormatMaster.detailDto.forEach(row => {
      row.subDetailDto.forEach(detail => {
        totalScore = totalScore + detail.form.controls.evaScore.value;
      });
    });
    this.dpEvaluationMasterForm.controls.gradeTotalScore.setValue(this.calculateGrade(totalScore), { emitEvent: false });
    this.dpEvaluationMasterForm.controls.totalScore.setValue(totalScore, { emitEvent: false });
  }

  calculateGrade(totalScore: number): string {
    let Grade = '';
    if (totalScore >= 90) {
      Grade = 'A';
    } else if ((totalScore >= 80)) {
      Grade = 'B+';
    } else if ((totalScore >= 70)) {
      Grade = 'B';
    } else if ((totalScore >= 60)) {
      Grade = 'C';
    } else {
      Grade = 'D';
    }
    return Grade;
  }

  save() {
    if (this.isFormValid()) {
      this.dpEvaluationMaster.scores = [];
      this.saving = true;
      this.dpEvaluationMasterForm.markAsPristine();

      this.dpEvaluationMasterForm.controls.evaNo.setValue(this.dpEvaluationMaster.transNo);
      this.dpFormatMaster.detailDto.forEach(row => {
        row.subDetailDto.forEach(sub => {
          this.dpEvaluationMaster.scoresEva.push(sub.form.value);
        });
      });
      this.dp.save(this.dpEvaluationMaster, this.dpEvaluationMasterForm.getRawValue()).pipe(
        switchMap(result => this.dp.findDpEvaluationMasterByKey(result.transNo)),
        finalize(() => this.saving = false)
      ).subscribe((result) => {
        this.dpEvaluationMaster = result;
        this.rebuildForm();
        this.ms.success('message.STD00006');
      });
    }
  }

  onSearcheEvaYear = (keyword, value) => {
    return this.dp.findEvaYearForATC(keyword, value);
  }

  onSearcheEvaPeriod = (keyword, value) => {
    return this.dp.findEvaPeriodForATC(keyword, value, this.dpEvaluationMasterForm.controls.evaluationYear.value);
  }

  onSearcheDocFormatNo = (keyword, value) => {
    return this.dp.findDocFormatNoForATC(keyword, value);
  }

  onSearcheEvaluators = (keyword, value) => {
    return this.dp.findEvaluatorsForATC(keyword, value);
  }

  isFormValid(): boolean {
    let isValidated = true;
    if (!this.util.isFormGroupValid(this.dpEvaluationMasterForm)) {
      isValidated = false;
    }
    this.dpFormatMaster.detailDto.forEach(row => {
      row.subDetailDto.forEach(sub => {
        if (!this.util.isFormGroupValid(sub.form)) {
          isValidated = false;
        }
      });
    });
    if (this.dpEvaluationMaster.flagStatus !== DpConstants.StatusDoc.Cancel) {
      let topinNoScore = '';
      let isTruetopinNoScore = false;
      this.dpFormatMaster.detailDto.forEach(row => {
        row.subDetailDto.forEach(sub => {
          if (sub.form.controls.evaScore.value === null) {
            topinNoScore = topinNoScore + sub.form.controls.topicNo.value + ', ';
            isTruetopinNoScore = true;
          }
        });
      });
      if (isTruetopinNoScore) {
        this.ms.warning('message.DP00009', [topinNoScore]);
        topinNoScore = '';
      }
    }

    return isValidated;
  }

  isFormDirty(): boolean {
    return this.dpEvaluationMasterForm.dirty;
  }

  canDeactivate(): Observable<boolean> {
    if (!this.isFormDirty()) {
      return of(true);
    }
    return this.modal.confirm('message.STD00002');
  }

  isSaveHide(): boolean {
    let check = false;
    if (this.dpEvaluationMaster.status === DpConstants.StatusDoc.Approve
      || this.dpEvaluationMaster.status === DpConstants.StatusDoc.Cancel) {
      check = true;
    }
    return check;
  }

  isPrintHide(): boolean {
    let check = false;
    // if (this.dpEvaluationMaster.status !== null) {
    check = true;
    // }
    return check;
  }

  isSendHide(): boolean {
    let check = false;
    if (this.dpEvaluationMaster.status === DpConstants.StatusDoc.InProcess
      || this.dpEvaluationMaster.status === DpConstants.StatusDoc.Wait) {
      check = true;
    }
    return check;
  }

  isCancelHide(): boolean {
    let check = false;
    if (this.dpEvaluationMaster.status !== DpConstants.StatusDoc.Cancel
      && this.dpEvaluationMaster.status !== DpConstants.StatusDoc.Approve) {
      check = true;
    }
    return check;
  }

  isCanCancel(): boolean {
    let check = false;
    if (this.dpEvaluationMaster.status !== DpConstants.StatusDoc.Cancel
      && this.dpEvaluationMaster.status !== DpConstants.StatusDoc.Approve) {
      check = true;
    }
    return !this.isFormDirty() && check;
  }

  isCanSend(): boolean {
    let check = false;
    if (this.dpEvaluationMaster.status !== DpConstants.StatusDoc.Cancel
      && this.dpEvaluationMaster.status !== DpConstants.StatusDoc.Approve) {
      check = true;
    }
    return !this.isFormDirty() && check;
  }

  isCanPrint(): boolean {
    let check = false;
    // if (this.dpEvaluationMaster.status !== null) {
    check = true;
    // }
    return !this.isFormDirty() && check;
  }

  cancel() {
    this.modal.confirm('message.DP00004').subscribe(
      (res) => {
        if (res) {
          this.dpEvaluationMaster.flagStatus = DpConstants.StatusDoc.Cancel;
          this.dpEvaluationMasterForm.controls.flagStatus.setValue(DpConstants.StatusDoc.Cancel);
          this.save();
        }
      }
    );
  }
  send() {
    this.modal.confirm('message.DP00003').subscribe(
      (res) => {
        if (res) {
          this.dpEvaluationMaster.flagStatus = DpConstants.StatusDoc.Approve;
          this.dpEvaluationMasterForm.controls.flagStatus.setValue(DpConstants.StatusDoc.Approve);
          this.save();
        }
      }
    );
  }
  print() {

  }
  isBetweenStartAndEnd(getDate: number): boolean {
    if (getDate >= Number(this.dpFormatMaster.startDate) && getDate <= Number(this.dpFormatMaster.endDate)) {
      return true;
    } else {
      return false;
    }
  }
  calculateAllscore(data: any[]): number {
    let countValue = 0;
    let sum = 0;
    data.forEach((value) => {
      if (value != null) {
        sum = sum + value;
        countValue++;
      }
    });
    if (countValue > 0) {
      sum = sum / countValue;
    } else {
      sum = null;
    }
    return sum;
  }
}
