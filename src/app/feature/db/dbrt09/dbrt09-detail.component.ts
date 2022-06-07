import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, finalize } from 'rxjs/operators';
import { FormUtilService, ModalService } from '@app/shared';
import { CanComponentDeactivate, MessageService } from '@app/core';
import { DbReligion, Dbrt09Service } from './dbrt09.service';
import { BasicForm } from '@app/shared/component/base-form';
import { CommonConstants } from '@app/feature/common/common-constants';
import { Permission } from '@app/shared/service/permission.service';


@Component({
  selector: 'app-dbrt09-detail',
  templateUrl: './dbrt09-detail.component.html',
  styleUrls: ['./dbrt09-detail.component.scss']
})
export class Dbrt09DetailComponent implements OnInit, CanComponentDeactivate, BasicForm {
  dbReligionForm: FormGroup;
  dbReligion: DbReligion = {} as DbReligion;
  saving = false;
  permission = {} as Permission;
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public util: FormUtilService,
    private ms: MessageService,
    private modal: ModalService,
    private db: Dbrt09Service
  ) { }

  ngOnInit() {
    this.createForm();
    this.route.data.subscribe((data) => {
      this.permission = data.dbrt09.permission;
      this.dbReligion = data.dbrt09.detail;
      this.rebuildForm();
    });
    this.installEvent();
  }

  createForm() {
    this.dbReligionForm = this.fb.group({
      religionCode: [null , [Validators.required, Validators.maxLength(5)]],
      religionNameTha: [null , [Validators.required, Validators.maxLength(50)]],
      religionNameEng: [null , [Validators.required, Validators.maxLength(50)]],
      active: CommonConstants.Status.Active,
      activeBool: true,
      rowVersion: null
    });
  }

  rebuildForm() {
    if (this.dbReligion.religionCode ) {
      this.dbReligion.activeBool = this.dbReligion.active === CommonConstants.Status.Active;
      this.dbReligionForm.patchValue(this.dbReligion);
      this.dbReligionForm.controls.religionCode.disable({emitEvent: false});
    }
    if (this.permission.isReadOnly) {
      this.dbReligionForm.disable({emitEvent: false});
    }
    this.dbReligionForm.markAsPristine();
  }

  installEvent() {
    this.dbReligionForm.controls.activeBool.valueChanges.subscribe((activeBool) => {
      if (this.dbReligionForm.controls.activeBool.dirty) {
        this.dbReligionForm.controls.active.setValue(activeBool ? CommonConstants.Status.Active : CommonConstants.Status.Inactive);
      }
    });
  }

  save() {
    if (this.isFormValid()) {
      this.saving = true;
      this.db.save(this.dbReligion , this.dbReligionForm.getRawValue()).pipe(
        switchMap(result => this.db.findDbReligionByKey(result.religionCode)),
        finalize(() => this.saving = false)
      ).subscribe((result) => {
        this.dbReligion = result;
        this.rebuildForm();
        this.ms.success('message.STD00006');
      });
    }
  }

  isFormValid(): boolean {
    return this.util.isFormGroupValid(this.dbReligionForm);
  }

  isFormDirty(): boolean {
    return this.dbReligionForm.dirty;
  }

  canDeactivate(): Observable<boolean> {
    if (!this.isFormDirty()) {
      return of(true);
    }
    return this.modal.confirm('message.STD00002'); // ละทิ้งการเปลี่ยนแปลงหรือไม่
  }
}
