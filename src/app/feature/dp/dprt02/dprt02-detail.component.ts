import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CanComponentDeactivate, MessageService } from '@app/core';
import { FormUtilService, ModalService } from '@app/shared';
import { BasicForm } from '@app/shared/component/base-form';
import { Observable, of } from 'rxjs';
import { finalize, switchMap } from 'rxjs/operators';
import { Dprt02Service, DpPeriod } from './dprt02.service';

@Component({
  selector: 'app-dprt02-detail',
  templateUrl: './dprt02-detail.component.html',
  styleUrls: ['./dprt02-detail.component.scss']
})
export class Dprt02DetailComponent implements OnInit, CanComponentDeactivate, BasicForm {
  dpPeriodForm: FormGroup;
  dpPeriod: DpPeriod = {} as DpPeriod;
  saving = false;
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private dp: Dprt02Service,
    public util: FormUtilService,
    private ms: MessageService,
    private modal: ModalService
  ) { }

  ngOnInit() {
    this.createForm();
    this.route.data.subscribe((data) => {
      this.dpPeriod = data.dprt02.detail;
      this.rebuildForm();
    });
    this.installEvent();
  }

  createForm() {
    this.dpPeriodForm = this.fb.group({
      evaluationYear: [null, Validators.required],
      evaluationPeriod: [null, Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      closeDate: null,
      active: true,
      rowVersion: null
    });
  }

  rebuildForm() {
    this.dpPeriodForm.markAsPristine();
    if (this.dpPeriod.rowVersion) {
      this.dpPeriodForm.patchValue(this.dpPeriod);
      this.dpPeriodForm.controls.evaluationPeriod.disable({ emitEvent: false });
      this.dpPeriodForm.controls.evaluationYear.disable({ emitEvent: false });
      if (new Date() > new Date(this.dpPeriodForm.controls.startDate.value) &&
        new Date() < new Date(this.dpPeriodForm.controls.endDate.value)) {
        this.dpPeriodForm.controls.startDate.disable({ emitEvent: false });
        this.dpPeriodForm.controls.endDate.disable({ emitEvent: false });
      }
    }
    this.dpPeriodForm.markAsPristine();
  }

  installEvent() {

  }

  save() {
    if (this.isFormValid()) {
      this.saving = true;
      this.dp.save(this.dpPeriod, this.dpPeriodForm.getRawValue()).pipe(
        switchMap(result => this.dp.findDpPeriodByKey(result.evaluationYear, result.evaluationPeriod)),
        finalize(() => this.saving = false)
      ).subscribe((result) => {
        this.dpPeriod = result;
        this.rebuildForm();
        this.ms.success('message.STD00006');
      });
    }
  }

  isFormValid(): boolean {
    let isValidated = true;
    if (this.util.isFormGroupValid(this.dpPeriodForm) === false) {
      isValidated = false;
    }
    return isValidated;
  }

  isFormDirty(): boolean {
    return this.dpPeriodForm.dirty;
  }

  canDeactivate(): Observable<boolean> {
    if (!this.isFormDirty()) {
      return of(true);
    }
    return this.modal.confirm('message.STD00002');
  }
}
