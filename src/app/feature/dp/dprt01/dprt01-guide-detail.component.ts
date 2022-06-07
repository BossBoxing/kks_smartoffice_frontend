import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CanComponentDeactivate, MessageService } from '@app/core';
import { FormUtilService, ModalService, RowState } from '@app/shared';
import { CustomValidators } from '@app/shared/directive/custom.validator';
import { Guid } from 'guid-typescript';
import { Observable, of } from 'rxjs';
import { finalize, switchMap } from 'rxjs/operators';
import { Dprt01Service, DpFormatDetail, DpFormatGuideline, DpFormatMaster } from './dprt01.service';


@Component({
  selector: 'app-dprt01-guide-detail',
  templateUrl: './dprt01-guide-detail.component.html',
  styleUrls: ['./dprt01-guide-detail.component.scss']
})
export class Dprt01GuideDetailComponent implements OnInit, CanComponentDeactivate {
  dpFormatMasterForm: FormGroup;
  dpFormatDetailForm: FormGroup;
  dpFormatMaster: DpFormatMaster = {} as DpFormatMaster;
  dpFormatDetail: DpFormatDetail = {} as DpFormatDetail;
  dpFormatGuidelineDelete: DpFormatGuideline[] = [] as DpFormatGuideline[];
  saving = false;
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private dp: Dprt01Service,
    public util: FormUtilService,
    private ms: MessageService,
    private modal: ModalService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.createForm();
    this.route.data.subscribe((data) => {
      this.dpFormatMaster = data.dprt01.detail;
      console.log(this.dpFormatMaster);
      this.dpFormatDetail = this.dpFormatMaster.details[0];
      this.rebuildForm();
    });
  }
  createForm() {
    this.dpFormatMasterForm = this.fb.group({
      docFormatNo: { value: null, disabled: true }
      , docFormatNameTha: { value: null, disabled: true }
      , docFormatNameEng: { value: null, disabled: true }
      , docFormatType: { value: null, disabled: true }
      , active: { value: null, disabled: true }
      , rowVersion: null
    });
    this.dpFormatDetailForm = this.fb.group({
      topicNo: { value: null, disabled: true }
      , isSubType: { value: null, disabled: true }
      , mainTopic: { value: null, disabled: true }
      , descriptionTha: { value: null, disabled: true }
      , descriptionEng: { value: null, disabled: true }
      , maxScore: { value: null, disabled: true }
      , rowVersion: null
    });
  }

  rebuildForm() {
    this.dpFormatGuidelineDelete = [];
    this.dpFormatMasterForm.markAsPristine();
    this.dpFormatDetailForm.markAsPristine();
    if (this.dpFormatDetail.rowVersion) {
      this.dpFormatMasterForm.patchValue(this.dpFormatMaster);
      this.dpFormatDetailForm.patchValue(this.dpFormatDetail);
      this.dpFormatDetail.guides.forEach(row => row.form = this.createFormatGuideline(row));

      this.dpFormatDetail.rowState = RowState.Edit;
    } else {
      this.dpFormatDetail.guides = [] as DpFormatGuideline[];
    }
    this.dpFormatMasterForm.markAsPristine();
    this.dpFormatDetailForm.markAsPristine();
  }

  createFormatGuideline(guide: DpFormatGuideline) {
    const fg = this.fb.group({
      docFormatNo: null
      , topicNo: null
      , guidelineSeq: [null, [Validators.required, CustomValidators.duplicate(this.dpFormatDetail.guides)]]
      , guidelineDescTha: [null, [Validators.required, Validators.maxLength(200)]]
      , guidelineDescEng: [null, [Validators.required, Validators.maxLength(200)]]
      , guidelineScore: [null, [Validators.required, Validators.min(1), Validators.max(100)]]
      , rowVersion: null
      , guid: Guid.raw()
    });
    guide.guid = fg.controls.guid.value;
    fg.patchValue(guide, { emitEvent: false });

    fg.valueChanges.subscribe((row) => {
      if (guide.rowState === RowState.Normal) {
        guide.rowState = RowState.Edit;
      }
    });

    if (guide.rowVersion) {
      fg.controls.guidelineSeq.disable();
      fg.markAsPristine();
    }
    return fg;
  }

  addFormatGuideline() {
    const guide: DpFormatGuideline = {
      docFormatNo: null
      , topicNo: null
      , guidelineSeq: null
      , guidelineDescTha: null
      , guidelineDescEng: null
      , guidelineScore: null
      , rowVersion: null
      , guid: Guid.raw()
      , rowState: RowState.Add
    };
    guide.form = this.createFormatGuideline(guide);
    this.dpFormatDetail.guides = this.dpFormatDetail.guides.concat(guide);
    this.dpFormatDetailForm.markAsDirty();
  }

  removeFormatGuideline(guide: DpFormatGuideline) {
    if (guide.rowState !== RowState.Add) {
      guide.rowState = RowState.Delete;
      this.dpFormatGuidelineDelete.push(guide);
    }
    this.dpFormatDetail.guides = this.dpFormatDetail.guides.filter(item => item.guid !== guide.guid);
    this.dpFormatDetailForm.markAsDirty();
  }

  save() {
    const forms: FormGroup[] = [this.dpFormatDetailForm].concat(this.dpFormatDetail.guides.map(detail => detail.form));
    if (this.util.isFormGroupsValid(forms) && this.isFormValid()) {
      this.saving = true;
      this.dp.saveDetail(this.dpFormatMaster
        , this.dpFormatMasterForm.getRawValue()
        , this.dpFormatDetail
        , this.dpFormatDetailForm.getRawValue()
        , this.dpFormatGuidelineDelete)
        .pipe(
          switchMap(result => this.dp.findDpFormatMasterByKey(result.docFormatNo, result.topicNo)),
          finalize(() => this.saving = false)
        ).subscribe((result) => {
          this.dpFormatMaster = result;
          this.dpFormatDetail = this.dpFormatMaster.details[0];
          this.rebuildForm();
          this.ms.success('message.STD00006');
        });
    }
  }

  isFormValid(): boolean {
    let isValidated = true;
    if (this.util.isFormGroupValid(this.dpFormatDetailForm) === false) {
      isValidated = false;
    }

    if (this.isFormGroupsValid(this.dpFormatDetail.guides.map(row => row.form), isValidated) === false) {
      isValidated = false;
    }

    let count = 0;
    this.dpFormatDetail.guides.forEach(guide => {
      this.dpFormatDetail.guides.forEach(guide2 => {
        if (guide.form.controls.guidelineSeq.value !== guide2.form.controls.guidelineSeq.value
          && guide.form.controls.guidelineScore.value === guide2.form.controls.guidelineScore.value) {
          count++;
        }
      });
    });
    if (count > 0) {
      // ระบุคะแนนซ้ำ
      this.ms.warning('message.DP000011');
      isValidated = false;
    }

    let Score = 0;
    this.dpFormatDetail.guides.forEach(guide => {
      if (guide.form.controls.guidelineScore.value > this.dpFormatDetail.maxScore) {
        Score++;
      }
    });
    if (Score > 0) {
      // ระบุคะแนนเกินคะแนนเต็ม
      this.ms.warning('message.DP000010');
      isValidated = false;
    }

    return isValidated;
  }

  isFormGroupsValid(formGroups: FormGroup[], showWarning: boolean = true) {
    let isInvalid = false;
    if (formGroups && formGroups.length > 0) {
      formGroups.forEach(formGroup => {
        this.util.markFormGroupTouched(formGroup);
        this.cd.detectChanges();
        isInvalid = isInvalid || formGroup.invalid;
      });
    }
    if (isInvalid) {
      if (showWarning) {
        this.ms.warning('message.STD00045');
      }
      return false;
    } else {
      return true;
    }
  }

  isFormDirty(): boolean {
    return this.dpFormatDetailForm.dirty
      || (this.dpFormatDetail.guides && this.dpFormatDetail.guides.some(list => list.form.dirty));
  }

  canDeactivate(): Observable<boolean> {
    if (!this.isFormDirty()) {
      return of(true);
    }
    return this.modal.confirm('message.STD00002');
  }

}
