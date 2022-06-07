import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CanComponentDeactivate, MessageService } from '@app/core';
import { FormUtilService, ModalService, RowState } from '@app/shared';
import { BasicForm } from '@app/shared/component/base-form';
import { CustomValidators } from '@app/shared/directive/custom.validator';
import { Guid } from 'guid-typescript';
import { from, Observable, of } from 'rxjs';
import { finalize, switchMap } from 'rxjs/operators';
import { Dprt01Service, DpFormatMaster, DpFormatDetail } from './dprt01.service';


@Component({
  selector: 'app-dprt01-detail',
  templateUrl: './dprt01-detail.component.html',
  styleUrls: ['./dprt01-detail.component.scss']
})
export class Dprt01DetailComponent implements OnInit, CanComponentDeactivate, BasicForm {
  dpFormatMasterForm: FormGroup;
  dpFormatMaster: DpFormatMaster = {} as DpFormatMaster;
  dpFormatDetailDelete: DpFormatDetail[] = [] as DpFormatDetail[];
  saving = false;
  masterData = {
    selectFormatType: []
  };
  userInfo;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private dp: Dprt01Service,
    public util: FormUtilService,
    private ms: MessageService,
    private modal: ModalService,
    private cd: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit() {
    this.createForm();
    this.route.data.subscribe((data) => {
      this.dpFormatMaster = data.dprt01.detail;
      this.initialMasterData(data);
      this.rebuildForm();
    });
    this.installEvent();
  }

  createForm() {
    this.dpFormatMasterForm = this.fb.group({
      docFormatNo: [null, Validators.required]
      , docFormatNameTha: [null, Validators.required]
      , docFormatNameEng: [null, Validators.required]
      , docFormatType: [null, Validators.required]
      , active: true
      , totalScore: { value: 0, disabled: true }
      , rowVersion: null
    });
  }

  initialMasterData(data: any) {
    this.masterData = data.dprt01.masterData;
  }

  rebuildForm() {
    this.dpFormatDetailDelete = [];
    this.dpFormatMasterForm.markAsPristine();
    if (this.dpFormatMaster.rowVersion) {
      this.dpFormatMasterForm.patchValue(this.dpFormatMaster);
      this.dpFormatMaster.details.forEach(row => row.form = this.createFormatDetailForm(row));
      this.dpFormatMasterForm.controls.docFormatNo.disable({ emitEvent: false });
      this.calculateTotalScore();
    } else {
      this.dpFormatMaster.details = [] as DpFormatDetail[];
      this.dpFormatMasterForm.controls.docFormatNo.enable({ emitEvent: false });
    }
    this.dpFormatMasterForm.markAsPristine();
  }

  installEvent() {
  }

  calculateTotalScore() {
    let score = 0;
    this.dpFormatMaster.details.forEach((row) => {
      if (row.form.controls.isMainType.value) {
        score = score + row.form.controls.maxScore.value;
      }
    });
    this.dpFormatMasterForm.controls.totalScore.setValue(score, { emitEvnt: false });
  }

  createFormatDetailForm(detail: DpFormatDetail) {
    const fg = this.fb.group({
      topicNo: [null, [Validators.required, CustomValidators.duplicate(this.dpFormatMaster.details)]]
      , isMainType: false
      , mainTopic: [null, [Validators.required]]
      , descriptionTha: [null, [Validators.required, Validators.maxLength(200)]]
      , descriptionEng: [null, [Validators.required, Validators.maxLength(200)]]
      , maxScore: [null, [Validators.required, Validators.min(1), Validators.max(100)]]
      , rowVersion: null
      , guid: Guid.raw()
    });
    detail.guid = fg.controls.guid.value;
    fg.patchValue(detail, { emitEvent: false });

    fg.controls.isMainType.valueChanges.subscribe((isMainType) => {
      if (fg.controls.isMainType.dirty) {
        if (isMainType) {
          fg.controls.mainTopic.disable({ emitEvent: false });
        } else {
          fg.controls.mainTopic.enable({ emitEvent: false });
        }
        fg.controls.mainTopic.patchValue(null, { emitEvent: false });
        this.calculateTotalScore();
      }
    });

    if (fg.controls.isMainType.value) {
      fg.controls.mainTopic.disable({ emitEvent: false });
    } else {
      fg.controls.mainTopic.enable({ emitEvent: false });
    }

    fg.controls.maxScore.valueChanges.subscribe(() => {
      if (fg.controls.maxScore.dirty) {
        this.calculateTotalScore();
      }
    });

    fg.valueChanges.subscribe((row) => {
      if (detail.rowState === RowState.Normal) {
        detail.rowState = RowState.Edit;
      }
    });

    if (detail.rowVersion) {
      fg.controls.topicNo.disable();
      fg.markAsPristine();
    }
    return fg;
  }

  addFormatDetail() {
    const detail: DpFormatDetail = {
      docFormatNo: null
      , topicNo: null
      , isMainType: false
      , mainTopic: null
      , descriptionTha: null
      , descriptionEng: null
      , maxScore: null
      , rowVersion: null
      , guid: Guid.raw()
      , rowState: RowState.Add
      , guides: []
    };
    detail.form = this.createFormatDetailForm(detail);
    this.dpFormatMaster.details = this.dpFormatMaster.details.concat(detail);
    this.dpFormatMasterForm.markAsDirty();
  }

  removeFormatDetail(detail: DpFormatDetail) {
    if (detail.rowState !== RowState.Add) {
      detail.rowState = RowState.Delete;
      this.dpFormatDetailDelete.push(detail);
    }
    this.dpFormatMaster.details = this.dpFormatMaster.details.filter(item => item.guid !== detail.guid);
    this.dpFormatMasterForm.markAsDirty();
  }

  save() {
    const forms: FormGroup[] = [this.dpFormatMasterForm].concat(this.dpFormatMaster.details.map(detail => detail.form));
    if (this.isFormValid()) {
      this.saving = true;
      this.dp.save(this.dpFormatMaster, this.dpFormatMasterForm.getRawValue(), this.dpFormatDetailDelete).pipe(
        switchMap(result => this.dp.findDpFormatMasterByKey(result.docFormatNo, null)),
        finalize(() => this.saving = false)
      ).subscribe((result) => {
        this.dpFormatMaster = result;
        this.rebuildForm();
        this.ms.success('message.STD00006');
      });
    }
  }

  guideDetail(detail: DpFormatDetail) {
    this.router.navigate(['/dp/dprt01/guide'], {
      state: { docFormatNo: detail.docFormatNo, topicNo: detail.topicNo }
    });
  }

  onSearchFormatType = (keyword, value) => {
    return this.dp.findFormatTypeForATC(keyword, value);
  }

  isFormValid(): boolean {
    let isValidated = true;
    if (this.util.isFormGroupValid(this.dpFormatMasterForm) === false) {
      isValidated = false;
    }

    if (this.isFormGroupsValid(this.dpFormatMaster.details.map(row => row.form), isValidated) === false) {
      isValidated = false;
    }

    if (this.dpFormatMaster.details.length === 0) {
      // กรุณาระบุหัวข้อประเมิน
      this.ms.warning('message.DP00005');
      isValidated = false;
    }

    this.dpFormatMaster.details.forEach(detail => {
      if (detail.form.controls.mainTopic.value === detail.form.controls.topicNo.value) {
        // ข้อมูลซ้ำกับหัวข้อประเมิน
        this.ms.warning('message.DP00001');
        isValidated = false;
      }
    });

    const subTopicNo = [];
    this.dpFormatMaster.details.forEach(detail => {
      if (!detail.form.controls.isMainType.value) {
        subTopicNo.push(detail.form.controls.mainTopic.value);
      }
    });

    let noSubTopic = 0;
    this.dpFormatMaster.details.forEach(main => {
      if (main.form.controls.isMainType.value) {
        if (!subTopicNo.includes(main.form.controls.topicNo.value)) {
          noSubTopic++;
        }
      }
    });
    if (noSubTopic > 0) {
      // กรุณาระบุหัวข้อย่อย
      this.ms.warning('message.DP000012');
      isValidated = false;
    }

    const mainTopic = [];
    this.dpFormatMaster.details.forEach(detail => {
      mainTopic.push(detail.form.controls.topicNo.value);
    });

    this.dpFormatMaster.details.forEach(row => {
      if (!row.form.controls.isMainType.value) {
        if (!mainTopic.includes(row.form.controls.mainTopic.value)) {
          // ข้อมูลที่ระบุไม่พบในหัวข้อหลัก
          this.ms.warning('message.DP00002');
          isValidated = false;
        }
      }
    });

    let mainScore = 0;
    this.dpFormatMaster.details.forEach(detail => {
      if (detail.form.controls.isMainType.value) {
        mainScore = mainScore + detail.form.controls.maxScore.value;
      }
    });
    if (mainScore > 100) {
      // คะแนนรวมไม่เกิน 100
      this.ms.warning('message.DP00008');
      isValidated = false;
    }

    let subScore = 0;
    this.dpFormatMaster.details.forEach(detail => {
      subScore = 0;
      //  if (detail.form.controls.isMainType.value === false) {
      this.dpFormatMaster.details.forEach(subDetail => {
        if (detail.form.controls.topicNo.value === subDetail.form.controls.mainTopic.value) {
          console.log('topicNo', subDetail.form.controls.topicNo.value);
          subScore = subScore + subDetail.form.controls.maxScore.value;
        }
      });
      if (subScore > detail.form.controls.maxScore.value) {
        // คะแนนเกินหัวข้อหลัก
        this.ms.warning('message.DP00007');
        isValidated = false;
        //   }
      }
    });

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
    return this.dpFormatMasterForm.dirty || this.dpFormatMaster.details.some(list => list.form.dirty);
  }

  canDeactivate(): Observable<boolean> {
    if (!this.isFormDirty()) {
      return of(true);
    }
    return this.modal.confirm('message.STD00002');
  }
}
