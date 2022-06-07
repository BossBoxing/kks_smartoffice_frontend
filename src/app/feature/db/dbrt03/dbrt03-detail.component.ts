import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, finalize } from 'rxjs/operators';
import { FormUtilService, ModalService } from '@app/shared';
import { CanComponentDeactivate, MessageService } from '@app/core';
import { Dbrt03Service, DbTitle } from './dbrt03.service';
import { BasicForm } from '@app/shared/component/base-form';
import { CommonConstants } from '@app/feature/common/common-constants';
import { Permission } from '@app/shared/service/permission.service';


@Component({
  selector: 'app-dbrt03-detail',
  templateUrl: './dbrt03-detail.component.html',
  styleUrls: ['./dbrt03-detail.component.scss']
})
export class Dbrt03DetailComponent implements OnInit, CanComponentDeactivate, BasicForm {
  dbTitleForm: FormGroup;
  dbTitle: DbTitle = {} as DbTitle;
  permission = {} as Permission;
  saving = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public util: FormUtilService,
    private ms: MessageService,
    private modal: ModalService,
    private db: Dbrt03Service
  ) { }

  ngOnInit() {
    this.createForm();
    this.route.data.subscribe((data) => {
      this.permission = data.dbrt03.permission;
      this.dbTitle = data.dbrt03.detail;
      this.rebuildForm();
    });
    this.installEvent();
  }

  createForm() {
    this.dbTitleForm = this.fb.group({
      titleCode: [null , [Validators.required, Validators.maxLength(5)]],
      titleNameTha: [null , [Validators.required, Validators.maxLength(30)]],
      titleNameEng: [null , [Validators.required, Validators.maxLength(30)]],
      suffixNameTha: [null , [Validators.maxLength(30)]],
      suffixNameEng: [null , [Validators.maxLength(30)]],
      titleIniTha: [null , [Validators.maxLength(30)]],
      titleIniEng: [null , [Validators.maxLength(30)]],
      suffixIniTha: [null , [Validators.maxLength(30)]],
      suffixIniEng: [null , [Validators.maxLength(30)]],
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
      this.dbTitleForm.controls.titleCode.disable({emitEvent: false});
    }
    if (this.permission.isReadOnly) {
      this.dbTitleForm.disable({emitEvent: false});
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
      this.db.save(this.dbTitle , this.dbTitleForm.getRawValue()).pipe(
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
    return this.modal.confirm('message.STD00002'); // ละทิ้งการเปลี่ยนแปลงหรือไม่
  }
}
