import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CanComponentDeactivate, MessageService } from '@app/core';
import { CommonConstants } from '@app/feature/common/common-constants';
import { FormUtilService, ModalService } from '@app/shared';
import { BasicForm } from '@app/shared/component/base-form';
import { Observable, of } from 'rxjs';
import { finalize, switchMap } from 'rxjs/operators';
import { DbTitle, Tndbrt03Service } from '../tndbrt03.service';

@Component({
  selector: 'app-tndbrt03-detail',
  templateUrl: './tndbrt03-detail.component.html',
  styleUrls: ['./tndbrt03-detail.component.scss']
})
export class Tndbrt03DetailComponent implements OnInit, CanComponentDeactivate, BasicForm {
  dbTitleForm: FormGroup;
  dbTitle: DbTitle = {} as DbTitle;
  saving = false;
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private db: Tndbrt03Service,
    public util: FormUtilService,
    private ms: MessageService,
    private modal: ModalService
  ) { }

  ngOnInit() {
    this.createForm();
    this.route.data.subscribe((data) => {
      this.dbTitle = data.tndbrt03.detail;
      this.rebuildForm();
    });
    this.installEvent();
    // console.log(this.dbTitle);
  }

  createForm() {
    this.dbTitleForm = this.fb.group({
      titleCode: [null, [Validators.required, Validators.maxLength(5)]],
      titleNameTha: [null, [Validators.required, Validators.maxLength(30)]],
      titleNameEng: [null, [Validators.required, Validators.maxLength(30)]],
      suffixNameTha: [null, [Validators.required, Validators.maxLength(30)]],
      suffixNameEng: [null, [Validators.required, Validators.maxLength(30)]],
      titleIniTha: [null, [Validators.required, Validators.maxLength(30)]],
      titleIniEng: [null, [Validators.required, Validators.maxLength(30)]],
      suffixIniTha: [null, [Validators.required, Validators.maxLength(30)]],
      suffixIniEng: [null, [Validators.required, Validators.maxLength(30)]],
      active: CommonConstants.Status.Active,
      activeBool: true,
      rowVersion: null
    });
  }

  rebuildForm() {
    this.dbTitleForm.markAsPristine();
    if (this.dbTitle.titleCode) {
      this.dbTitle.activeBool = this.dbTitle.active === CommonConstants.Status.Active;
      this.dbTitleForm.patchValue(this.dbTitle);
      this.dbTitleForm.controls.titleCode.disable({ emitEvent: false });
    }
    this.dbTitleForm.markAsPristine();
  }

  installEvent() {
    this.dbTitleForm.controls.activeBool.valueChanges.subscribe((activeBool) => {
      if (this.dbTitleForm.controls.activeBool.dirty) {
        this.dbTitleForm.controls.active.setValue(activeBool ? CommonConstants.Status.Active : CommonConstants.Status.Inactive);
      }
    });
  }

  save() {
    if (this.isFormValid()) {
      this.saving = true;
      this.db.save(this.dbTitle, this.dbTitleForm.getRawValue()).pipe(
        switchMap(result => this.db.findDbTitleByKey(result.titleCode)),
        finalize(() => this.saving = false)
      ).subscribe((result) => {
        this.dbTitle = result;
        this.rebuildForm();
        this.ms.success('message.STD00006');
      });
    }
  }

  isFormValid(): boolean {
    return this.util.isFormGroupValid(this.dbTitleForm);
  }

  isFormDirty(): boolean {
    return this.dbTitleForm.dirty;
  }

  canDeactivate(): Observable<boolean> {
    if (!this.isFormDirty()) {
      return of(true);
    }
    return this.modal.confirm('message.STD00002');
  }

}
