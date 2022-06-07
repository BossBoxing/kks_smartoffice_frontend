import { SuDivision, SuOrganize, Surt01Service } from './surt01.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FormUtilService, ModalService, RowState, } from '@app/shared';
import { CanComponentDeactivate, MessageService } from '@app/core';
import { switchMap, finalize } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Guid } from 'guid-typescript';
import { CustomValidators } from '@app/shared/directive/custom.validator';
import { CommonConstants } from '@app/feature/common/common-constants';
import { SuConstants } from '../common/su-constants';

@Component({
  selector: 'app-surt01-detail',
  templateUrl: './surt01-detail.component.html'
})
export class Surt01DetailComponent implements OnInit, CanComponentDeactivate {
  suOrganizeForm: FormGroup;
  suOrganize: SuOrganize = {} as SuOrganize;
  suDivisionDelete: SuDivision[] = [] as SuDivision[];
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
    private su: Surt01Service,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.createForm();
    this.route.data.subscribe((data) => {
      this.suOrganize = data.surt01.detail;
      this.rebuildForm();
    });
    this.installEvent();
  }

  createForm() {
    this.suOrganizeForm = this.fb.group({
      ouCode: [null, [Validators.required, Validators.maxLength(10)]]
      , mainYn: SuConstants.MainCompanyFlag.Yes
      , mainOuBool: true
      , ouMain: { value: null, disabled: true }
      , taxId: [null, [Validators.maxLength(15), CustomValidators.idCard()]]
      , ouNameTha: [null, [Validators.required, Validators.maxLength(100)]]
      , ouNameEng: [null, [Validators.maxLength(100)]]
      , addrTha1: [null, [Validators.required, Validators.maxLength(100)]]
      , addrEng1: [null, [Validators.maxLength(100)]]
      , addrTha2: [null, [Validators.maxLength(100)]]
      , addrEng2: [null, [Validators.maxLength(100)]]
      , provinceTha: [null, [Validators.maxLength(100)]]
      , provinceEng: [null, [Validators.maxLength(100)]]
      , zipCode: [null, [Validators.maxLength(5)]]
      , telephone: [null, [Validators.maxLength(50), CustomValidators.phoneNo()]]
      , fax: [null, [Validators.maxLength(50)]]
      , email: [null, [Validators.maxLength(50), Validators.email]]
      , active: CommonConstants.Status.Active
      , activeBool: true
      , rowVersion: null
    });
  }

  rebuildForm() {
    this.suDivisionDelete = [];
    this.suOrganizeForm.markAsPristine();
    if (this.suOrganize.rowVersion) {
      this.suOrganize.activeBool = this.suOrganize.active === CommonConstants.Status.Active;
      this.suOrganize.mainOuBool = this.suOrganize.mainYn === SuConstants.MainCompanyFlag.Yes;
      this.suOrganizeForm.patchValue(this.suOrganize, { emitEvent: false });
      this.suOrganizeForm.controls.ouCode.disable({ emitEvent: false });
      if (!this.suOrganize.mainOuBool) {
        this.suOrganizeForm.controls.ouMain.enable({ emitEvent: false });
        this.suOrganizeForm.controls.ouMain.setValidators([Validators.required]);
      }
      this.suOrganize.divisions.forEach(row => row.form = this.createDivisionForm(row));
    } else {
      this.suOrganize.divisions = [] as SuDivision[];
      this.addDivision();
    }
    if (this.permission.isReadOnly) {
      this.suOrganizeForm.disable({ emitEvent: false });
      this.suOrganize.divisions.forEach(row => row.form.disable({ emitEvent: false }));
    }
    this.suOrganizeForm.markAsPristine();
  }

  installEvent() {
    this.suOrganizeForm.controls.activeBool.valueChanges.subscribe((activeBool) => {
      if (this.suOrganizeForm.controls.activeBool.dirty) {
        this.suOrganizeForm.controls.active.setValue(activeBool ? CommonConstants.Status.Active : CommonConstants.Status.Inactive);
      }
    });

    this.suOrganizeForm.controls.mainOuBool.valueChanges.subscribe((mainOuBool) => {
      if (this.suOrganizeForm.controls.mainOuBool.dirty) {
        this.suOrganizeForm.controls.mainYn.setValue(mainOuBool ? SuConstants.MainCompanyFlag.Yes : SuConstants.MainCompanyFlag.No);
        if (mainOuBool) {
          this.suOrganizeForm.controls.ouMain.disable({ emitEvent: false });
          this.suOrganizeForm.controls.ouMain.setValue(null, { emitEvent: false });
          this.suOrganizeForm.controls.ouMain.clearValidators();
        } else {
          this.suOrganizeForm.controls.ouMain.enable({ emitEvent: false });
          this.suOrganizeForm.controls.ouMain.setValue(null, { emitEvent: false });
          this.suOrganizeForm.controls.ouMain.setValidators([Validators.required]);
        }
        this.suOrganizeForm.controls.ouMain.updateValueAndValidity();
      }
    });

    if (this.isInsertMode()) {
      this.suOrganizeForm.controls.ouCode.valueChanges.subscribe((ouCode) => {
        if (this.suOrganizeForm.controls.ouCode.dirty) {
          this.suOrganize.divisions.filter((row, index) => {
            if (index === 0) { row.form.controls.divCode.setValue(ouCode.toUpperCase(), { emitEvent: false }); }
          });
        }
      });

      this.suOrganizeForm.controls.ouNameTha.valueChanges.subscribe((ouNameTha) => {
        if (this.suOrganizeForm.controls.ouCode.dirty) {
          this.suOrganize.divisions.filter((row, index) => {
            if (index === 0) { row.form.controls.divName.setValue(ouNameTha, { emitEvent: false }); }
          });
        }
      });
    }
  }

  createDivisionForm(division: SuDivision) {
    const fg = this.fb.group({
      ouCode: null
      , divCode: [null, [Validators.required, Validators.maxLength(15), CustomValidators.duplicate(this.suOrganize.divisions)]]
      , divName: [null, [Validators.required, Validators.maxLength(100)]]
      , subFlag: SuConstants.MainDivisionFlag.No
      , subFlagBool: true
      , divParent: null
      , rowVersion: null
      , guid: Guid.raw()
    });
    division.guid = fg.controls.guid.value;
    fg.patchValue(division, { emitEvent: false });

    if (this.isInsertMode()) {
      fg.controls.subFlagBool.disable({ emitEvent: false });
    }

    if (division.subFlag) {
      fg.controls.subFlagBool.setValue((division.subFlag === SuConstants.MainDivisionFlag.No) ? true : false);
      if (fg.controls.subFlagBool.value) {
        fg.controls.divParent.disable({ emitEvent: false });
        fg.controls.divParent.clearValidators();
      } else {
        fg.controls.divParent.enable({ emitEvent: false });
        fg.controls.divParent.setValidators([Validators.required]);
      }
      fg.controls.divParent.updateValueAndValidity();
    }

    fg.controls.subFlagBool.valueChanges.subscribe((subFlagBool) => {
      if (fg.controls.subFlagBool.dirty) {
        fg.controls.subFlag.setValue((subFlagBool) ? SuConstants.MainDivisionFlag.No : SuConstants.MainDivisionFlag.Yes);
        if (subFlagBool) {
          fg.controls.divParent.setValue(null, { emitEvent: false });
          fg.controls.divParent.disable({ emitEvent: false });
          fg.controls.divParent.clearValidators();
        } else {
          fg.controls.divParent.setValue(null, { emitEvent: false });
          fg.controls.divParent.enable({ emitEvent: false });
          fg.controls.divParent.setValidators([Validators.required]);
        }
        fg.controls.divParent.updateValueAndValidity();
      }
    });

    fg.valueChanges.subscribe((controls) => {
      if (division.rowState === RowState.Normal) {
        division.rowState = RowState.Edit;
      }
    });

    if (division.rowVersion) {
      fg.markAsPristine();
    }
    return fg;
  }

  addDivision() {
    const division: SuDivision = {
      ouCode: null
      , divCode: null
      , divName: null
      , levelCtl: null
      , divParent: null
      , mainParent: null
      , subFlag: SuConstants.MainCompanyFlag.No
      , subFlagBool: true
      , rowId: null
      , glDfDivCode: null
      , rowVersion: null
      , rowState: RowState.Add
      , guid: Guid.raw()
    };
    division.form = this.createDivisionForm(division);
    this.suOrganize.divisions = this.suOrganize.divisions.concat(division);
    this.suOrganizeForm.markAsDirty();
  }

  removeDivision(division: SuDivision) {
    if (division.rowState !== RowState.Add) {
      division.rowState = RowState.Delete;
      this.suDivisionDelete.push(division);
    }
    this.suOrganize.divisions = this.suOrganize.divisions.filter(item => item.guid !== division.guid);
    this.suOrganizeForm.markAsDirty();
  }

  isFormDirty(): boolean {
    return this.suOrganizeForm.dirty || this.suOrganize.divisions.some(item => item.form.dirty);
  }

  isFormValid(): boolean {
    let isValidated = true;
    if (this.util.isFormGroupValid(this.suOrganizeForm) === false) {
      isValidated = false;
    }

    if (this.isFormGroupsValid(this.suOrganize.divisions.map(row => row.form), isValidated) === false) {
      isValidated = false;
    }

    if (this.suOrganize.divisions.length === 0) {
      this.ms.warning('message.STD00012', ['label.SURT01.Divisions']);
      // ต้องมี {{0}} อย่างน้อย 1 รายการ
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

  save() {
    if (this.isFormValid()) {
      this.saving = true;
      this.su.save(this.suOrganize, this.suOrganizeForm.getRawValue(), this.suDivisionDelete).pipe(
        switchMap(result => this.su.findSuOrganizeByKey(result.ouCode)),
        finalize(() => this.saving = false)
      ).subscribe((result) => {
        this.suOrganize = result;
        this.rebuildForm();
        this.ms.success('message.STD00006');
      });
    }
  }

  onSearchOuMain = (keyword, value) => {
    return this.su.findOuMainForATC(keyword, value, this.suOrganize.ouCode);
  }

  onSearchDivParent(division: SuDivision) {
    return (keyword, value) => {
      return this.su.findDivParentForATC(keyword, value, this.suOrganize.ouCode, division.divCode);
    };
  }

  isInsertMode(): boolean {
    return !this.suOrganize.rowVersion || this.suOrganize.rowVersion === null;
  }

  canDeactivate(): Observable<boolean> {
    if (!this.isFormDirty()) {
      return of(true);
    }
    return this.modal.confirm('message.STD00002');
  }
}
