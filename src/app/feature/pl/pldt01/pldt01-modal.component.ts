import { PlConstants } from './../common/pl-constants';
import { Component, OnInit } from '@angular/core';
import { FormUtilService, SubscriptionDisposer } from '@app/shared';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Pldt01Service, PlTaskEntry } from './pldt01.service';
import { BasicForm } from '@app/shared/component/base-form';
import { MessageService } from '@app/core';
import { distinctUntilChanged, finalize, switchMap, takeUntil } from 'rxjs/operators';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-pldt01-modal',
  templateUrl: './pldt01-modal.component.html',
  styleUrls: ['./pldt01-modal.component.scss']
})
export class Pldt01ModalComponent extends SubscriptionDisposer implements OnInit, BasicForm {
  public static readonly programCode = 'pldt01';
  result = new Subject<boolean>();
  progTypeCodeChange = new Subject<any>();
  plTaskEntryForm: FormGroup;
  plTaskEntry: PlTaskEntry = {} as PlTaskEntry;
  masterData: { workTypes: [], progStatusCodes: [] };
  saving = false;

  constructor(
    public util: FormUtilService,
    public modal: BsModalRef,
    private fb: FormBuilder,
    private ms: MessageService,
    private pl: Pldt01Service
  ) { super(); }

  ngOnInit(): void {
    this.createForm();
    this.rebuildForm();
    this.installEvent();
  }

  createForm() {
    this.plTaskEntryForm = this.fb.group({
      empCode: null
      , seq: 0
      , workType: [PlConstants.WorkType.Develop, [Validators.required]]
      , custCode: [null, [Validators.required]]
      , releaseCode: [null, [Validators.required]]
      , projCode: [null, [Validators.required]]
      , workCode: [null, [Validators.required]]
      , progStatus: null
      , progDevId: null
      , progName: [null, [Validators.maxLength(200)]]
      , progTypeCode: null
      , assPts: [0, [Validators.min(0), Validators.max(100)]]
      , calAssPts: { value: 0, disabled: true }
      , remark: [null, [Validators.maxLength(1000)]]
      , startWorkDate: [null, [Validators.required]]
      , endWorkDate: [null, [Validators.required]]
      , progress: 0
      , startTimeHrs: [null, [Validators.required]]
      , endTimeHrs: [null, [Validators.required]]
      , totalHrs: { value: 0, disabled: true }
      , rowVersion: null
    });
  }

  rebuildForm() {
    this.plTaskEntryForm.markAsPristine();
    if (this.plTaskEntry.rowVersion) {
      this.plTaskEntryForm.patchValue(this.plTaskEntry);
      this.plTaskEntryForm.controls.startWorkDate.disable({ emitEvent: false });
      this.plTaskEntryForm.controls.endWorkDate.disable({ emitEvent: false });
      this.calculateAssignPoints();
      this.calculateTotalHrs();
    }
    if (this.plTaskEntry.workDate) {
      this.plTaskEntryForm.controls.startWorkDate.setValue(this.plTaskEntry.workDate, { emitEvent: false });
      this.plTaskEntryForm.controls.endWorkDate.setValue(this.plTaskEntry.workDate, { emitEvent: false });
    }
    this.setTaskEntryProperties();
    this.plTaskEntryForm.markAsPristine();
  }

  installEvent() {
    this.plTaskEntryForm.controls.workType.valueChanges.subscribe((workType) => {
      if (this.plTaskEntryForm.controls.workType.dirty) {
        if (workType) {
          this.plTaskEntryForm.controls.progStatus.setValue(null, { emitEvent: false });
          this.plTaskEntryForm.controls.progTypeCode.setValue(null, { emitEvent: false });
          if (this.isWorkTypeDevelop()) {
            this.plTaskEntryForm.controls.assPts.setValue(0, { emitEvent: false });
            this.plTaskEntryForm.controls.calAssPts.setValue(0, { emitEvent: false });
            this.plTaskEntryForm.controls.progress.setValue(0, { emitEvent: false });
          } else {
            this.plTaskEntryForm.controls.assPts.setValue(null, { emitEvent: false });
            this.plTaskEntryForm.controls.calAssPts.setValue(null, { emitEvent: false });
            this.plTaskEntryForm.controls.progress.setValue(null, { emitEvent: false });
          }
          this.setTaskEntryProperties();
          this.calculateAssignPoints();
        }
      }
    });

    this.plTaskEntryForm.controls.custCode.valueChanges.subscribe((custCode) => {
      if (this.plTaskEntryForm.controls.custCode.dirty) {
        if (custCode) {
          this.plTaskEntryForm.controls.releaseCode.setValue(null, { emitEvent: false });
          this.plTaskEntryForm.controls.projCode.setValue(null, { emitEvent: false });
        }
      }
    });

    this.plTaskEntryForm.controls.releaseCode.valueChanges.subscribe((releaseCode) => {
      if (this.plTaskEntryForm.controls.releaseCode.dirty) {
        if (releaseCode) { this.plTaskEntryForm.controls.projCode.setValue(null, { emitEvent: false }); }
      }
    });

    this.plTaskEntryForm.controls.progStatus.valueChanges.subscribe((progStatus) => {
      if (this.plTaskEntryForm.controls.progStatus.dirty) {
        if (progStatus) {
          this.plTaskEntryForm.controls.progTypeCode.setValue(null, { emitEvent: false });
          this.plTaskEntryForm.controls.assPts.setValue(0, { emitEvent: false });
          this.plTaskEntryForm.controls.calAssPts.setValue(0, { emitEvent: false });
        }
      }
    });

    this.plTaskEntryForm.controls.progTypeCode.valueChanges.pipe(
      switchMap(() => this.progTypeCodeChange),
      distinctUntilChanged((prev: any, curr: any) => prev.value === curr.value),
      takeUntil(this.ngUnsubscribe)
    ).subscribe(selectedRow => {
      if (this.plTaskEntryForm.controls.progTypeCode.dirty) {
        if (selectedRow && selectedRow.value) {
          this.plTaskEntryForm.controls.assPts.setValue(selectedRow.weight, { emitEvent: false });
          this.calculateAssignPoints();
        }
      }
    });

    this.plTaskEntryForm.controls.assPts.valueChanges.subscribe(() => {
      if (this.plTaskEntryForm.controls.assPts.dirty) { this.calculateAssignPoints(); }
    });

    this.plTaskEntryForm.controls.startTimeHrs.valueChanges.subscribe(() => {
      if (this.plTaskEntryForm.controls.startTimeHrs.dirty) { this.calculateTotalHrs(); }
    });

    this.plTaskEntryForm.controls.endTimeHrs.valueChanges.subscribe(() => {
      if (this.plTaskEntryForm.controls.endTimeHrs.dirty) { this.calculateTotalHrs(); }
    });
  }

  calculateAssignPoints() {
    const assPts = this.plTaskEntryForm.controls.assPts.value;
    if (this.plTaskEntryForm.controls.progStatus.value === PlConstants.ProgramStatus.Done) {
      this.plTaskEntryForm.controls.calAssPts.setValue(assPts, { emitEvent: false });
    } else if (this.plTaskEntryForm.controls.progStatus.value === PlConstants.ProgramStatus.Process) {
      this.plTaskEntryForm.controls.calAssPts.setValue(0, { emitEvent: false });
    } else if (this.plTaskEntryForm.controls.progStatus.value === PlConstants.ProgramStatus.Maintenance) {
      this.plTaskEntryForm.controls.calAssPts.setValue(assPts * 0.2, { emitEvent: false });
    } else if (this.plTaskEntryForm.controls.progStatus.value === PlConstants.ProgramStatus.Improve) {
      this.plTaskEntryForm.controls.calAssPts.setValue(assPts * (-0.2), { emitEvent: false });
    } else {
      this.plTaskEntryForm.controls.calAssPts.setValue(assPts, { emitEvent: false });
    }
  }

  calculateTotalHrs() {
    if (parseFloat(this.plTaskEntryForm.controls.startTimeHrs.value) >= 0
      && parseFloat(this.plTaskEntryForm.controls.endTimeHrs.value) >= 0) {
      const startHours = this.plTaskEntryForm.controls.startTimeHrs.value.split(':');
      const endHours = this.plTaskEntryForm.controls.endTimeHrs.value.split(':');
      const minute = endHours[1] - startHours[1] + ((startHours[1] > endHours[1]) ? 60 : 0);
      const hours = endHours[0] - startHours[0] - ((startHours[1] > endHours[1]) ? 1 : 0);
      const totalHours = hours.toString() + '.' + ((minute < 10) ? '0' + minute.toString() : minute.toString());
      this.plTaskEntryForm.controls.totalHrs.setValue(parseFloat(totalHours).toFixed(2), { emitEvent: false });
    } else {
      this.plTaskEntryForm.controls.totalHrs.setValue(0, { emitEvent: false });
    }
  }

  setTaskEntryProperties() {
    if (this.isWorkTypeDevelop()) {
      this.plTaskEntryForm.controls.releaseCode.setValidators([Validators.required]);
      this.plTaskEntryForm.controls.projCode.setValidators([Validators.required]);
      this.plTaskEntryForm.controls.progDevId.setValidators([Validators.required, Validators.maxLength(50)]);
      this.plTaskEntryForm.controls.progStatus.setValidators([Validators.required]);
      this.plTaskEntryForm.controls.progTypeCode.setValidators([Validators.required]);
      this.plTaskEntryForm.controls.progress.setValidators([Validators.required, Validators.min(0.01), Validators.max(100.00)]);
    } else {
      this.plTaskEntryForm.controls.releaseCode.clearValidators();
      this.plTaskEntryForm.controls.projCode.clearValidators();
      this.plTaskEntryForm.controls.progDevId.clearValidators();
      this.plTaskEntryForm.controls.progStatus.clearValidators();
      this.plTaskEntryForm.controls.progTypeCode.clearValidators();
      this.plTaskEntryForm.controls.progress.clearValidators();
    }
    this.plTaskEntryForm.controls.releaseCode.updateValueAndValidity();
    this.plTaskEntryForm.controls.projCode.updateValueAndValidity();
    this.plTaskEntryForm.controls.progDevId.updateValueAndValidity();
    this.plTaskEntryForm.controls.progStatus.updateValueAndValidity();
    this.plTaskEntryForm.controls.progTypeCode.updateValueAndValidity();
    this.plTaskEntryForm.controls.progress.updateValueAndValidity();
  }

  isFormValid(): boolean {
    return this.util.isFormGroupValid(this.plTaskEntryForm);
  }

  isFormDirty(): boolean {
    return this.plTaskEntryForm.dirty;
  }

  save() {
    if (this.isFormValid()) {
      this.saving = true;
      this.pl.save(this.plTaskEntry, this.plTaskEntryForm.getRawValue()).pipe(
        finalize(() => this.saving = false)
      ).subscribe((result) => {
        if (result) {
          this.ms.success('message.STD00006');
          this.result.next(true);
          this.modal.hide();
        }
      });
    }
  }

  close() {
    this.result.next(false);
    this.modal.hide();
  }

  isWorkTypeDevelop(): boolean {
    return this.plTaskEntryForm.controls.workType.value === PlConstants.WorkType.Develop;
  }

  onSearchCustCode = (keyword, value) => {
    return this.pl.findCustCodeForATC(keyword, value);
  }

  onSearchReleaseCode = (keyword, value) => {
    return this.pl.findReleaseCodeForATC(keyword, value, this.plTaskEntryForm.value);
  }

  onSearchProjCode = (keyword, value) => {
    return this.pl.findProjCodeForATC(keyword, value, this.plTaskEntryForm.value);
  }

  onSearchWorkCode = (keyword, value) => {
    return this.pl.findWorkCodeForATC(keyword, value);
  }

  onSearchProgTypeCode = (keyword, value) => {
    return this.pl.findProgTypeCodeForATC(keyword, value);
  }

  findProgNameByProgId() {
    if (this.plTaskEntryForm.controls.progDevId.value && this.plTaskEntryForm.controls.progDevId.dirty) {
      this.pl.findProgNameByProgId(this.plTaskEntryForm.controls.progDevId.value).subscribe((result) => {
        this.plTaskEntryForm.controls.progName.setValue((result) ? result.programName : null, { emitEvent: false });
      });
    } else {
      this.plTaskEntryForm.controls.progName.setValue(null, { emitEvent: false });
    }
  }
}
