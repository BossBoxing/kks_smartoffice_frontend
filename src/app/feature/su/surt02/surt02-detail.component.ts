import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Surt02Service, SuProgramLabel, SuProgramInfo } from './surt02.service';
import { ActivatedRoute } from '@angular/router';
import { FormUtilService, ModalService, RowState, Pattern } from '@app/shared';
import { CanComponentDeactivate, MessageService } from '@app/core';
import { switchMap, finalize } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Guid } from 'guid-typescript';
import { CustomValidators } from '@app/shared/directive/custom.validator';
import { CommonConstants } from '@app/feature/common/common-constants';

@Component({
  selector: 'app-surt02-detail',
  templateUrl: './surt02-detail.component.html'
})
export class Surt02DetailComponent implements OnInit, CanComponentDeactivate {
  suProgramInfoForm: FormGroup;
  suProgramInfo: SuProgramInfo = {} as SuProgramInfo;
  programLabelDelete: SuProgramLabel[] = [] as SuProgramLabel[];
  masterData = {
    systemCodes: [],
    moduleCodes: []
  };
  saving = false;
  permission = {
    isReadOnly: null
  };

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public util: FormUtilService,
    private ms: MessageService,
    private modal: ModalService,
    private su: Surt02Service,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.createForm();
    this.route.data.subscribe((data) => {
      this.suProgramInfo = data.surt02.detail;
      this.initalMasterData(data);
      this.rebuildForm();
    });
  }

  initalMasterData(data: any) {
    this.masterData = data.surt02.masterData;
  }

  createForm() {
    this.suProgramInfoForm = this.fb.group({
      systemCode: [null, Validators.required],
      moduleCode: [null, Validators.required],
      programCode: [null, [Validators.required, Validators.maxLength(50), Validators.pattern(Pattern.UpperOnly)]],
      programName: [null, [Validators.required, Validators.maxLength(200)]],
      programPath: [null, [Validators.required, Validators.maxLength(200)]]
    });
  }

  rebuildForm() {
    this.programLabelDelete = [];
    this.suProgramInfoForm.markAsPristine();
    if (this.suProgramInfo.rowVersion) {
      this.suProgramInfoForm.patchValue(this.suProgramInfo);
      this.suProgramInfo.suProgramLabels.forEach(row => row.form = this.createProgramLabelForm(row));
      this.suProgramInfoForm.controls.systemCode.disable({emitEvent: false});
      this.suProgramInfoForm.controls.moduleCode.disable({emitEvent: false});
      this.suProgramInfoForm.controls.programCode.disable({emitEvent: false});
    } else {
      this.suProgramInfoForm.controls.systemCode.setValue(this.masterData.systemCodes[0].value);
      this.suProgramInfo.suProgramLabels = [];
      this.addProgramLabel();
    }
    if (this.isReadOnly()) {
      this.suProgramInfoForm.disable({emitEvent: false});
      this.suProgramInfo.suProgramLabels.forEach(row => row.form.disable({ emitEvent: false }));
    }
    this.suProgramInfoForm.markAsPristine();
  }

  addProgramLabel() {
    const programLabel: SuProgramLabel = {
      systemCode: null,
      moduleCode: null,
      programCode: null,
      fieldName: null,
      linId: null,
      labelName: null,
      labelNameTh: null,
      labelNameEn: null,
      rowVersion: null,
      rowVersionEn: null,
      rowState:  RowState.Add,
      rowStateEn: RowState.Add,
      guid: Guid.raw()
    };
    programLabel.form = this.createProgramLabelForm(programLabel);
    this.suProgramInfo.suProgramLabels = this.suProgramInfo.suProgramLabels.concat(programLabel);
    this.suProgramInfoForm.markAsDirty();
  }

  createProgramLabelForm(programLabel: SuProgramLabel) {
    const fg = this.fb.group({
      systemCode: null,
      moduleCode: null,
      programCode: null,
      fieldName: [null, [Validators.required, Validators.maxLength(50), CustomValidators.duplicate(this.suProgramInfo.suProgramLabels)]],
      labelNameTh: [null, [Validators.required, Validators.maxLength(1000)]],
      labelNameEn: [null, [Validators.maxLength(1000)]],
      rowVersionEn: null,
      rowVersion: null,
      guid: Guid.raw()
    });

    programLabel.guid = fg.controls.guid.value;
    fg.patchValue(programLabel, { emitEvent: false });

    fg.controls.labelNameTh.valueChanges.subscribe((labelNameTh) => {
      if (programLabel.rowState === RowState.Normal) {
        programLabel.rowState = RowState.Edit;
      }
    });

    fg.controls.labelNameEn.valueChanges.subscribe((labelNameEn) => {
      if (programLabel.rowStateEn === RowState.Normal) {
        programLabel.rowStateEn = RowState.Edit;
      }
    });

    if (programLabel.rowVersion || programLabel.rowVersionEn) {
      fg.controls.fieldName.disable({ emitEvent: false });
      fg.markAsPristine();
    }
    return fg;
  }

  removeProgramLabel(lebel: SuProgramLabel) {
    if (lebel.rowState !== RowState.Add) {
      const programLebel = Object.assign({}, lebel);
      programLebel.rowState = RowState.Delete;
      programLebel.rowVersion = lebel.rowVersion;
      programLebel.linId = CommonConstants.Language.Thai;
      this.programLabelDelete.push(programLebel);
    }
    if (lebel.rowStateEn !== RowState.Add) {
      const programLebel = Object.assign({}, lebel);
      programLebel.rowState = RowState.Delete;
      programLebel.rowVersion = lebel.rowVersionEn;
      programLebel.linId = CommonConstants.Language.Eng;
      this.programLabelDelete.push(programLebel);
    }

    this.suProgramInfo.suProgramLabels = this.suProgramInfo.suProgramLabels.filter(item => item.guid !== lebel.guid);
    this.suProgramInfoForm.markAsDirty();
  }

  save() {
    if (this.isFormValid()) {
      this.saving = true;
      this.su.save(this.suProgramInfo
        , this.suProgramInfoForm.getRawValue()
        , this.programLabelDelete
      ).pipe(
        switchMap(result => this.su.findSuProgramInfoByKey(result.programCode)),
        finalize(() => this.saving = false)
      ).subscribe((result) => {
        this.suProgramInfo = result;
        this.rebuildForm();
        this.ms.success('message.STD00006');
      });
    }
  }

  isReadOnly(): boolean {
    return this.permission.isReadOnly;
  }

  isFormDirty(): boolean {
    return this.suProgramInfoForm.dirty
    || this.suProgramInfo.suProgramLabels.some(item => item.form.dirty);
  }

  isFormValid(): boolean  {
    let isValidated = true;
    if (this.util.isFormGroupValid(this.suProgramInfoForm) === false) {
      isValidated = false;
    }

    if (this.isFormGroupsValid(this.suProgramInfo.suProgramLabels.map(row => row.form), isValidated) === false) {
      isValidated = false;
    }

    if (this.suProgramInfo.suProgramLabels.length === 0) {
      this.ms.warning('message.STD00012', ['label.SURT02.ProgramLabels']); // ต้องมี {{0}} อย่างน้อย 1 รายการ
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

  canDeactivate(): Observable<boolean> {
    if (!this.isFormDirty()) {
      return of(true);
    }
    return this.modal.confirm('message.STD00002');
  }
}
