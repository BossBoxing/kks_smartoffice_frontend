import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DbHoliday, Plrt03Service } from '../plrt03.service';
import { FormUtilService, ModalService } from '@app/shared';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '@app/core';
import { finalize, switchMap } from 'rxjs/operators';
import { CommonConstants } from '@app/feature/common/common-constants';
import { CustomValidators } from '@app/shared/directive/custom.validator';

@Component({
  selector: 'app-plrt03-detail',
  templateUrl: './plrt03-detail.component.html',
  styleUrls: ['./plrt03-detail.component.scss']
})
export class Plrt03DetailComponent implements OnInit {
  plHolidayForm: FormGroup;
  dbHoliday: DbHoliday = {} as DbHoliday;
  saving = false;

  constructor(
    private modal: ModalService,
    public util: FormUtilService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private ms: MessageService,
    private pl: Plrt03Service
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.route.data.subscribe((data) => {
      this.dbHoliday = data.plrt03.detail;
      this.rebuildForm();
    });
    this.installEvent();
  }

  createForm() {
    this.plHolidayForm = this.fb.group({
      holidayYear: [null, [Validators.required, CustomValidators.fixLength(4)]],
      holidayName: [null, [Validators.required, Validators.maxLength(300)]],
      holidayDate: [null, [Validators.required]],
      holidayDesc: [null, [Validators.maxLength(2000)]],
      substitutionYn: CommonConstants.Status.Active,
      activeBool: true,
      rowVersion: null
    });
  }

  rebuildForm() {
    this.plHolidayForm.markAsPristine();
    if (this.dbHoliday.ouCode) {
      this.dbHoliday.activeBool = this.dbHoliday.substitutionYn === CommonConstants.Status.Active;
      this.plHolidayForm.patchValue(this.dbHoliday);
      this.plHolidayForm.controls.holidayYear.disable({ emitEvent: false });
    }
    this.plHolidayForm.markAsPristine();
  }

  installEvent() {
    this.plHolidayForm.controls.activeBool.valueChanges.subscribe((activeBool) => {
      if (this.plHolidayForm.controls.activeBool.dirty) {
        this.plHolidayForm.controls.substitutionYn.setValue(activeBool ?
          CommonConstants.Status.Active : CommonConstants.Status.Inactive);
      }
    });
  }

  save() {
    if (this.isFormValid()) {
      this.saving = true;
      this.pl.save(this.dbHoliday, this.plHolidayForm.getRawValue()).pipe(
        switchMap(result => this.pl.findDbHolidayByKey(result.ouCode, result.holidayYear, result.holidayName)),
        finalize(() => this.saving = false)
      ).subscribe((result) => {
        this.dbHoliday = result;
        this.rebuildForm();
        this.ms.success('message.STD00006');
      });
    }
  }

  isFormValid(): boolean {
    return this.util.isFormGroupValid(this.plHolidayForm);
  }

  isFormDirty(): boolean {
    return this.plHolidayForm.dirty;
  }

  canDeactivate(): Observable<boolean> {
    if (!this.isFormDirty()) {
      return of(true);
    }
    return this.modal.confirm('message.STD00002');
  }

}
