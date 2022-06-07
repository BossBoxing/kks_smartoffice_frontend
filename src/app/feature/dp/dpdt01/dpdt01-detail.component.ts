import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CanComponentDeactivate, MessageService } from '@app/core';
import { CommonConstants } from '@app/feature/common/common-constants';
import { FormUtilService, ModalService } from '@app/shared';
import { BasicForm } from '@app/shared/component/base-form';
import { Guid } from 'guid-typescript';
import { Observable, of } from 'rxjs';
import { finalize, map, switchMap } from 'rxjs/operators';
import { DpConstants } from '../common/dp-constants';
import { Dpdt01Service, DpTransectionMaster, DpFormatMaster, DpFormatDetail } from './dpdt01.service';

@Component({
  selector: 'app-dpdt01-detail',
  templateUrl: './dpdt01-detail.component.html',
  styleUrls: ['./dpdt01-detail.component.scss']
})
export class Dpdt01DetailComponent implements OnInit, CanComponentDeactivate, BasicForm {
  dpTransectionMasterForm: FormGroup;
  dpTransectionMaster: DpTransectionMaster = {} as DpTransectionMaster;
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
    private dp: Dpdt01Service,
    public util: FormUtilService,
    private ms: MessageService,
    private modal: ModalService
  ) { }

  ngOnInit() {
    this.createForm();
    this.route.data.subscribe((data) => {
      this.dpTransectionMaster = data.dpdt01.detail;
      this.initialMasterData(data);
      this.rebuildForm();
    });
    this.installEvent();
  }

  initialMasterData(data: any) {
    this.masterData = data.dpdt01.masterData;
    this.userInfo = data.dpdt01.masterData.userInfo;
  }

  createForm() {
    this.dpTransectionMasterForm = this.fb.group({
      ouCude: null,
      transNo: CommonConstants.Auto.Text,
      evaluationYear: [null, [Validators.required]],
      evaluationPeriod: [null, [Validators.required]],
      docFormatNo: [null, [Validators.required]],
      totalScore: null,
      submitDate: null,
      evaluator: null,
      status: null,
      updatedBy: null,
      updatedDate: null,
      nextEvaluators: null,
      isLastEvaluator: false,
      gradeTotalScore: null,
      remark: null,
      allMaxScore: null,
      rowVersion: null,
      flagStatus: null,
      statusDesc: null,
      StatusColor: null
    });
  }

  rebuildForm() {
    this.dpTransectionMasterForm.controls.statusDesc.disable({ emitEvent: false });
    this.dpTransectionMasterForm.controls.updatedBy.disable({ emitEvent: false });
    this.dpTransectionMasterForm.controls.updatedDate.disable({ emitEvent: false });
    this.dpTransectionMasterForm.controls.totalScore.disable({ emitEvent: false });
    this.dpTransectionMasterForm.controls.gradeTotalScore.disable({ emitEvent: false });
    this.dpTransectionMasterForm.controls.submitDate.disable({ emitEvent: false });
    if (this.dpTransectionMaster.rowVersion) {
      this.dpTransectionMasterForm.patchValue(this.dpTransectionMaster);
      this.dpTransectionMasterForm.controls.transNo.disable({ emitEvent: false });
      this.dpTransectionMasterForm.controls.evaluationYear.disable({ emitEvent: false });
      this.dpTransectionMasterForm.controls.evaluationPeriod.disable({ emitEvent: false });
      this.dpTransectionMasterForm.controls.docFormatNo.disable({ emitEvent: false });
      if (this.dpTransectionMasterForm.controls.totalScore.value) {
        this.dpTransectionMasterForm.controls.gradeTotalScore.setValue(
          this.calculateGrade(this.dpTransectionMasterForm.controls.totalScore.value), { emitEvent: false }
        );
      }
      this.callReloadDetailTable();
    } else {
      this.dpFormatMaster.detailDto = [];
      this.dpTransectionMasterForm.controls.transNo.disable({ emitEvent: false });
      this.dpTransectionMasterForm.controls.nextEvaluators.disable({ emitEvent: false });
      this.dpTransectionMasterForm.controls.evaluationPeriod.disable({ emitEvent: false });
    }
    if (this.dpTransectionMasterForm.controls.isLastEvaluator.value) {
      this.dpTransectionMasterForm.controls.nextEvaluators.enable({ emitEvent: false });
      this.dpTransectionMasterForm.controls.nextEvaluators.setValidators([Validators.required]);
      this.dpTransectionMasterForm.markAsPristine();
    } else {
      this.dpTransectionMasterForm.controls.nextEvaluators.disable({ emitEvent: false });
      this.dpTransectionMasterForm.controls.nextEvaluators.clearAsyncValidators();
      this.dpTransectionMasterForm.markAsPristine();
    }
    if (this.dpTransectionMaster.status === DpConstants.StatusDoc.Cancel
      || this.dpTransectionMaster.status === DpConstants.StatusDoc.Submit
      || this.dpTransectionMaster.status === DpConstants.StatusDoc.Approve) {
      this.dpTransectionMasterForm.controls.isLastEvaluator.disable({ emitEvent: false });
      this.dpTransectionMasterForm.controls.nextEvaluators.disable({ emitEvent: false });
      this.dpTransectionMasterForm.controls.remark.disable({ emitEvent: false });
    }
    this.dpTransectionMasterForm.markAsPristine();
  }

  installEvent() {
    this.dpTransectionMasterForm.controls.totalScore.valueChanges.subscribe(data => {
    });
    this.dpTransectionMasterForm.controls.evaluationYear.valueChanges.subscribe(year => {
      if (this.dpTransectionMasterForm.controls.evaluationYear.value) {
        this.dpTransectionMasterForm.controls.evaluationPeriod.enable({ emitEvent: false });
        this.dpTransectionMasterForm.controls.evaluationPeriod.setValue(null);
      } else {
        this.dpTransectionMasterForm.controls.evaluationPeriod.disable({ emitEvent: false });
        this.dpTransectionMasterForm.controls.evaluationPeriod.setValue(null);
      }
    });

    this.dpTransectionMasterForm.controls.isLastEvaluator.valueChanges.subscribe(isLastEvaluator => {
      if (this.dpTransectionMasterForm.controls.isLastEvaluator.dirty) {
        if (this.dpTransectionMasterForm.controls.isLastEvaluator.value) {
          this.dpTransectionMasterForm.controls.nextEvaluators.setValue(null);
          this.dpTransectionMasterForm.controls.nextEvaluators.enable({ emitEvent: false });
          this.dpTransectionMasterForm.controls.nextEvaluators.setValidators([Validators.required]);
        } else {
          this.dpTransectionMasterForm.controls.nextEvaluators.setValue(null);
          this.dpTransectionMasterForm.controls.nextEvaluators.disable({ emitEvent: false });
          this.dpTransectionMasterForm.controls.nextEvaluators.clearValidators();
        }
        this.dpTransectionMasterForm.controls.nextEvaluators.updateValueAndValidity();
      }
    });
    this.dpTransectionMasterForm.controls.docFormatNo.valueChanges.subscribe(docFormatNo => {
      if (this.dpTransectionMasterForm.controls.docFormatNo.dirty) {
        this.callReloadDetailTable();
      }
    });
    this.dpTransectionMasterForm.controls.evaluationPeriod.valueChanges.subscribe(data => {
      if (this.dpTransectionMasterForm.controls.evaluationPeriod.dirty) {
        this.callReloadDetailTable();
      }
    });
    this.dpTransectionMasterForm.controls.evaluationYear.valueChanges.subscribe(data => {
      if (this.dpTransectionMasterForm.controls.evaluationYear.dirty) {
        this.callReloadDetailTable();
      }
    });
    this.dpTransectionMasterForm.markAsPristine();
  }

  async callReloadDetailTable() {
    if (this.dpTransectionMasterForm.controls.docFormatNo.value &&
      this.dpTransectionMasterForm.controls.evaluationYear.value &&
      this.dpTransectionMasterForm.controls.evaluationPeriod.value) {
      if (this.dpTransectionMasterForm.controls.docFormatNo.value) {
        await this.dp.findDocFormatDetailForTab({
          docFormatNo: this.dpTransectionMasterForm.controls.docFormatNo.value,
          transNo: this.dpTransectionMaster.transNo,
          evaluationYear: this.dpTransectionMasterForm.controls.evaluationYear.value,
          evaluationPeriod: this.dpTransectionMasterForm.controls.evaluationPeriod.value,
        }).subscribe(result => {
          this.dpFormatMaster = result;
          this.dpFormatMaster.detailDto.forEach(row => {
            row.subDetailDto.forEach(sub => sub.form = this.createTransactionScore(sub));
          });
        });
      } else {
        this.dpFormatMaster.detailDto = [];
      }
    }
  }

  createTransactionScore(detail: DpFormatDetail) {
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
    if (this.dpTransectionMaster.status === DpConstants.StatusDoc.Cancel
      || this.dpTransectionMaster.status === DpConstants.StatusDoc.Submit
      || this.dpTransectionMaster.status === DpConstants.StatusDoc.Approve) {
      fg.disable();
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
      this.calculateTotalScore();
      this.dpTransectionMasterForm.markAsDirty();
    });
    if (detail.rowVersion) {
      fg.markAsPristine();
    }
    return fg;
  }

  calculateTotalScore() {
    let totalScore = 0;
    this.dpFormatMaster.detailDto.forEach(row => {
      row.subDetailDto.forEach(detail => {
        if (detail.form.controls.avgScore.value && detail.form.controls.avgScore.value > 0) {
          totalScore = totalScore + detail.form.controls.avgScore.value;
        }
      });
    });
    this.dpTransectionMasterForm.controls.gradeTotalScore.setValue(this.calculateGrade(totalScore), { emitEvent: false });
    this.dpTransectionMasterForm.controls.totalScore.setValue(totalScore, { emitEvent: false });
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
      this.dpTransectionMaster.scores = [];
      this.saving = true;
      this.dpTransectionMasterForm.markAsPristine();

      this.dpFormatMaster.detailDto.forEach(row => {
        row.subDetailDto.forEach(sub => {
          this.dpTransectionMaster.scores.push(sub.form.value);
        });
      });
      this.dp.save(this.dpTransectionMaster, this.dpTransectionMasterForm.getRawValue()).pipe(
        switchMap(result => this.dp.findDpTransectionMasterByKey(result.transNo)),
        finalize(() => this.saving = false)
      ).subscribe((result) => {
        this.dpTransectionMaster = result;
        this.rebuildForm();
        this.ms.success('message.STD00006');
      });
    }
  }
  onSearcheEvaYear = (keyword, value) => {
    return this.dp.findEvaYearForATC(keyword, value);
  }

  onSearcheEvaPeriod = (keyword, value) => {
    return this.dp.findEvaPeriodForATC(keyword, value, this.dpTransectionMasterForm.controls.evaluationYear.value);
  }

  onSearcheDocFormatNo = (keyword, value) => {
    return this.dp.findDocFormatNoForATC(keyword, value);
  }

  onSearcheEvaluators = (keyword, value) => {
    return this.dp.findEvaluatorsForATC(keyword, value);
  }

  isFormValid(): boolean {
    let isValidated = true;
    if (!this.util.isFormGroupValid(this.dpTransectionMasterForm)) {
      isValidated = false;
    }
    this.dpFormatMaster.detailDto.forEach(row => {
      row.subDetailDto.forEach(sub => {
        if (!this.util.isFormGroupValid(sub.form)) {
          isValidated = false;
        }
      });
    });

    if (this.dpTransectionMaster.flagStatus !== DpConstants.StatusDoc.Cancel) {
      let topinNoScore = '';
      let isTruetopinNoScore = false;
      this.dpFormatMaster.detailDto.forEach(row => {
        row.subDetailDto.forEach(sub => {
          if (sub.form.controls.avgScore.value === null) {
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
    return this.dpTransectionMasterForm.dirty;
  }

  canDeactivate(): Observable<boolean> {
    if (!this.isFormDirty()) {
      return of(true);
    }
    return this.modal.confirm('message.STD00002');
  }

  isSaveHide(): boolean {
    let check = false;
    if (this.dpTransectionMaster.status === 'N' || this.dpTransectionMaster.status === DpConstants.StatusDoc.New) {
      check = true;
    }
    return check;
  }

  isPrintHide(): boolean {
    let check = false;
    if (this.dpTransectionMaster.status !== DpConstants.StatusDoc.New) {
      check = true;
    }
    return check;
  }

  isSendHide(): boolean {
    let check = false;
    if (this.dpTransectionMaster.status === 'N') {
      check = true;
    }
    return check;
  }

  isCancelHide(): boolean {
    let check = false;
    if (this.dpTransectionMaster.status !== DpConstants.StatusDoc.Cancel
      && this.dpTransectionMaster.status !== DpConstants.StatusDoc.Submit
      && this.dpTransectionMaster.status !== DpConstants.StatusDoc.New
      && this.dpTransectionMaster.status !== DpConstants.StatusDoc.Approve) {
      check = true;
    }
    return check;
  }

  isCanCancel(): boolean {
    let check = false;
    if (this.dpTransectionMaster.status !== DpConstants.StatusDoc.Cancel
      && this.dpTransectionMaster.status !== DpConstants.StatusDoc.Submit
      && this.dpTransectionMaster.status !== DpConstants.StatusDoc.Approve
      && this.dpTransectionMaster.status !== DpConstants.StatusDoc.New) {
      check = true;
    }
    return !this.isFormDirty() && check;
  }

  isCanSend(): boolean {
    let check = false;
    if (this.dpTransectionMaster.status === 'N') {
      check = true;
    }
    return !this.isFormDirty() && check;
  }

  isCanPrint(): boolean {
    let check = false;
    if (this.dpTransectionMaster.status !== DpConstants.StatusDoc.New) {
      check = true;
    }
    return !this.isFormDirty() && check;
  }

  cancel() {
    this.modal.confirm('message.DP00004').subscribe(
      (res) => {
        if (res) {
          this.dpTransectionMaster.flagStatus = DpConstants.StatusDoc.Cancel;
          this.dpTransectionMasterForm.controls.flagStatus.setValue(DpConstants.StatusDoc.Cancel);
          this.save();
        }
      }
    );
  }

  send() {
    this.modal.confirm('message.DP00003').subscribe(
      (res) => {
        if (res) {
          this.dpTransectionMaster.flagStatus = DpConstants.StatusDoc.Submit;
          this.dpTransectionMasterForm.controls.flagStatus.setValue(DpConstants.StatusDoc.Submit);
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
