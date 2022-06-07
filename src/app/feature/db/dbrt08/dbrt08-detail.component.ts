import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, finalize } from 'rxjs/operators';
import { FormUtilService, ModalService } from '@app/shared';
import { CanComponentDeactivate, MessageService } from '@app/core';
import { DbNational, Dbrt08Service } from './dbrt08.service';
import { BasicForm } from '@app/shared/component/base-form';
import { CommonConstants } from '@app/feature/common/common-constants';
import { Permission } from '@app/shared/service/permission.service';


@Component({
  selector: 'app-dbrt08-detail',
  templateUrl: './dbrt08-detail.component.html',
  styleUrls: ['./dbrt08-detail.component.scss']
})
export class Dbrt08DetailComponent implements OnInit, CanComponentDeactivate, BasicForm {
  dbNationalForm: FormGroup;
  dbNational: DbNational = {} as DbNational;
  saving = false;
  permission = {} as Permission;
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public util: FormUtilService,
    private ms: MessageService,
    private modal: ModalService,
    private db: Dbrt08Service
  ) { }

  ngOnInit() {
    this.createForm();
    this.route.data.subscribe((data) => {
      this.permission = data.dbrt08.permission;
      this.dbNational = data.dbrt08.detail;
      this.rebuildForm();
    });
    this.installEvent();
  }
  createForm() {
    this.dbNationalForm = this.fb.group({
      nationalCode: [null , [Validators.required, Validators.maxLength(5)]],
      nationalNameTha: [null , [Validators.required, Validators.maxLength(50)]],
      nationalNameEng: [null , [Validators.required, Validators.maxLength(50)]],
      active: CommonConstants.Status.Active,
      activeBool: true,
      rowVersion: null
    });
  }

  rebuildForm() {
    if (this.dbNational.nationalCode ) {
      this.dbNational.activeBool = this.dbNational.active === CommonConstants.Status.Active;
      this.dbNationalForm.patchValue(this.dbNational);
      this.dbNationalForm.controls.nationalCode.disable({emitEvent: false});
    }
    if (this.permission.isReadOnly) {
      this.dbNationalForm.disable({emitEvent: false});
    }
    this.dbNationalForm.markAsPristine();
  }

  installEvent() {
    this.dbNationalForm.controls.activeBool.valueChanges.subscribe((activeBool) => {
      if (this.dbNationalForm.controls.activeBool.dirty) {
        this.dbNationalForm.controls.active.setValue(activeBool ? CommonConstants.Status.Active : CommonConstants.Status.Inactive);
      }
    });
  }

  save() {
    if (this.isFormValid()) {
      this.saving = true;
      this.db.save(this.dbNational , this.dbNationalForm.getRawValue()).pipe(
        switchMap(result => this.db.findDbNationalByKey(result.nationalCode)),
        finalize(() => this.saving = false)
      ).subscribe((result) => {
        this.dbNational = result;
        this.rebuildForm();
        this.ms.success('message.STD00006');
      });
    }
  }

  isFormValid(): boolean {
    return this.util.isFormGroupValid(this.dbNationalForm);
  }

  isFormDirty(): boolean {
    return this.dbNationalForm.dirty;
  }

  canDeactivate(): Observable<boolean> {
    if (!this.isFormDirty()) {
      return of(true);
    }
    return this.modal.confirm('message.STD00002'); // ละทิ้งการเปลี่ยนแปลงหรือไม่
  }

}
